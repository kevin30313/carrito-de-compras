# Google Cloud Platform - Terraform Configuration
# Implementación económica y escalable para CYBERSTORE

terraform {
  required_version = ">= 1.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

# Variables
variable "project_id" {
  description = "GCP Project ID"
  type        = string
  default     = "cyberstore-prod"
}

variable "region" {
  description = "GCP Region"
  type        = string
  default     = "us-central1"
}

variable "zone" {
  description = "GCP Zone"
  type        = string
  default     = "us-central1-a"
}

# Provider configuration
provider "google" {
  project = var.project_id
  region  = var.region
  zone    = var.zone
}

# Enable required APIs
resource "google_project_service" "apis" {
  for_each = toset([
    "compute.googleapis.com",
    "container.googleapis.com",
    "sqladmin.googleapis.com",
    "redis.googleapis.com",
    "storage.googleapis.com",
    "cloudbuild.googleapis.com",
    "run.googleapis.com",
    "secretmanager.googleapis.com"
  ])
  
  project = var.project_id
  service = each.key
  
  disable_dependent_services = true
}

# VPC Network
resource "google_compute_network" "vpc" {
  name                    = "cyberstore-vpc"
  auto_create_subnetworks = false
}

resource "google_compute_subnetwork" "subnet" {
  name          = "cyberstore-subnet"
  ip_cidr_range = "10.0.0.0/24"
  region        = var.region
  network       = google_compute_network.vpc.id
}

# Cloud SQL - PostgreSQL (económico)
resource "google_sql_database_instance" "postgres" {
  name             = "cyberstore-db"
  database_version = "POSTGRES_15"
  region          = var.region
  
  settings {
    tier      = "db-f1-micro"  # Más económico
    disk_size = 10
    
    backup_configuration {
      enabled = true
      start_time = "03:00"
    }
    
    ip_configuration {
      ipv4_enabled = true
      authorized_networks {
        value = "0.0.0.0/0"
      }
    }
  }
  
  deletion_protection = false
}

resource "google_sql_database" "database" {
  name     = "cyberstore"
  instance = google_sql_database_instance.postgres.name
}

resource "google_sql_user" "user" {
  name     = "cyberstore_user"
  instance = google_sql_database_instance.postgres.name
  password = "secure_password_123"
}

# Redis for caching and sessions
resource "google_redis_instance" "cache" {
  name           = "cyberstore-cache"
  memory_size_gb = 1  # Tamaño mínimo económico
  tier           = "BASIC"
  region         = var.region
}

# Cloud Storage for static assets
resource "google_storage_bucket" "assets" {
  name     = "${var.project_id}-assets"
  location = "US"
  
  uniform_bucket_level_access = true
  
  cors {
    origin          = ["*"]
    method          = ["GET", "HEAD", "PUT", "POST", "DELETE"]
    response_header = ["*"]
    max_age_seconds = 3600
  }
}

# GKE Cluster (autopilot para economía)
resource "google_container_cluster" "primary" {
  name     = "cyberstore-cluster"
  location = var.region
  
  enable_autopilot = true
  
  network    = google_compute_network.vpc.name
  subnetwork = google_compute_subnetwork.subnet.name
  
  ip_allocation_policy {
    cluster_ipv4_cidr_block  = "10.1.0.0/16"
    services_ipv4_cidr_block = "10.2.0.0/16"
  }
}

# Cloud Run for serverless backend
resource "google_cloud_run_service" "api" {
  name     = "cyberstore-api"
  location = var.region
  
  template {
    spec {
      containers {
        image = "gcr.io/${var.project_id}/cyberstore-api:latest"
        
        env {
          name  = "DATABASE_URL"
          value = "postgresql://${google_sql_user.user.name}:${google_sql_user.user.password}@${google_sql_database_instance.postgres.connection_name}/${google_sql_database.database.name}"
        }
        
        env {
          name  = "REDIS_URL"
          value = "redis://${google_redis_instance.cache.host}:${google_redis_instance.cache.port}"
        }
        
        resources {
          limits = {
            cpu    = "1"
            memory = "512Mi"
          }
        }
      }
    }
  }
  
  traffic {
    percent         = 100
    latest_revision = true
  }
}

# Cloud Run IAM
resource "google_cloud_run_service_iam_member" "public" {
  service  = google_cloud_run_service.api.name
  location = google_cloud_run_service.api.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# Load Balancer
resource "google_compute_global_address" "default" {
  name = "cyberstore-ip"
}

resource "google_compute_managed_ssl_certificate" "default" {
  name = "cyberstore-ssl"
  
  managed {
    domains = ["cyberstore.example.com"]
  }
}

resource "google_compute_url_map" "default" {
  name            = "cyberstore-lb"
  default_service = google_compute_backend_service.default.id
}

resource "google_compute_backend_service" "default" {
  name        = "cyberstore-backend"
  protocol    = "HTTP"
  timeout_sec = 30
  
  backend {
    group = google_compute_region_network_endpoint_group.cloudrun_neg.id
  }
}

resource "google_compute_region_network_endpoint_group" "cloudrun_neg" {
  name                  = "cyberstore-neg"
  network_endpoint_type = "SERVERLESS"
  region                = var.region
  
  cloud_run {
    service = google_cloud_run_service.api.name
  }
}

resource "google_compute_target_https_proxy" "default" {
  name             = "cyberstore-proxy"
  url_map          = google_compute_url_map.default.id
  ssl_certificates = [google_compute_managed_ssl_certificate.default.id]
}

resource "google_compute_global_forwarding_rule" "default" {
  name       = "cyberstore-forwarding-rule"
  target     = google_compute_target_https_proxy.default.id
  port_range = "443"
  ip_address = google_compute_global_address.default.address
}

# Outputs
output "database_connection" {
  value = google_sql_database_instance.postgres.connection_name
  sensitive = true
}

output "redis_host" {
  value = google_redis_instance.cache.host
}

output "storage_bucket" {
  value = google_storage_bucket.assets.name
}

output "api_url" {
  value = google_cloud_run_service.api.status[0].url
}

output "load_balancer_ip" {
  value = google_compute_global_address.default.address
}

# Estimated monthly cost: ~$50-100 USD
# - Cloud SQL db-f1-micro: ~$7/month
# - Redis Basic 1GB: ~$27/month  
# - Cloud Storage: ~$1-5/month
# - Cloud Run: ~$0-20/month (depending on traffic)
# - Load Balancer: ~$18/month