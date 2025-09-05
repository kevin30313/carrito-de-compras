# Microsoft Azure - Terraform Configuration
# Implementación económica y escalable para CYBERSTORE

terraform {
  required_version = ">= 1.0"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
}

# Variables
variable "location" {
  description = "Azure Region"
  type        = string
  default     = "East US"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "prod"
}

# Provider
provider "azurerm" {
  features {}
}

# Resource Group
resource "azurerm_resource_group" "main" {
  name     = "rg-cyberstore-${var.environment}"
  location = var.location
}

# Virtual Network
resource "azurerm_virtual_network" "main" {
  name                = "vnet-cyberstore"
  address_space       = ["10.0.0.0/16"]
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
}

# Subnets
resource "azurerm_subnet" "app" {
  name                 = "subnet-app"
  resource_group_name  = azurerm_resource_group.main.name
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes     = ["10.0.1.0/24"]
  
  delegation {
    name = "containerinstance"
    service_delegation {
      name    = "Microsoft.ContainerInstance/containerGroups"
      actions = ["Microsoft.Network/virtualNetworks/subnets/action"]
    }
  }
}

resource "azurerm_subnet" "db" {
  name                 = "subnet-db"
  resource_group_name  = azurerm_resource_group.main.name
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes     = ["10.0.2.0/24"]
  
  service_endpoints = ["Microsoft.Sql"]
}

# Network Security Group
resource "azurerm_network_security_group" "app" {
  name                = "nsg-cyberstore-app"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  
  security_rule {
    name                       = "HTTP"
    priority                   = 1001
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "80"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }
  
  security_rule {
    name                       = "HTTPS"
    priority                   = 1002
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "443"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }
}

# Associate NSG to subnet
resource "azurerm_subnet_network_security_group_association" "app" {
  subnet_id                 = azurerm_subnet.app.id
  network_security_group_id = azurerm_network_security_group.app.id
}

# PostgreSQL Server (económico)
resource "azurerm_postgresql_flexible_server" "main" {
  name                   = "psql-cyberstore-${random_id.server.hex}"
  resource_group_name    = azurerm_resource_group.main.name
  location               = azurerm_resource_group.main.location
  version                = "15"
  
  administrator_login    = "cyberstore_admin"
  administrator_password = "SecurePassword123!"
  
  sku_name               = "B_Standard_B1ms"  # Económico
  storage_mb             = 32768
  
  backup_retention_days  = 7
  geo_redundant_backup_enabled = false
  
  high_availability {
    mode = "Disabled"  # Para economía
  }
}

resource "random_id" "server" {
  byte_length = 4
}

# PostgreSQL Database
resource "azurerm_postgresql_flexible_server_database" "main" {
  name      = "cyberstore"
  server_id = azurerm_postgresql_flexible_server.main.id
  collation = "en_US.utf8"
  charset   = "utf8"
}

# PostgreSQL Firewall Rule
resource "azurerm_postgresql_flexible_server_firewall_rule" "allow_azure" {
  name             = "AllowAzureServices"
  server_id        = azurerm_postgresql_flexible_server.main.id
  start_ip_address = "0.0.0.0"
  end_ip_address   = "0.0.0.0"
}

# Redis Cache (económico)
resource "azurerm_redis_cache" "main" {
  name                = "redis-cyberstore-${random_id.server.hex}"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  capacity            = 0  # 250MB - económico
  family              = "C"
  sku_name            = "Basic"
  enable_non_ssl_port = false
  minimum_tls_version = "1.2"
}

# Storage Account
resource "azurerm_storage_account" "main" {
  name                     = "stcyberstore${random_id.server.hex}"
  resource_group_name      = azurerm_resource_group.main.name
  location                 = azurerm_resource_group.main.location
  account_tier             = "Standard"
  account_replication_type = "LRS"  # Económico
  
  blob_properties {
    cors_rule {
      allowed_headers    = ["*"]
      allowed_methods    = ["GET", "HEAD", "POST", "PUT", "DELETE"]
      allowed_origins    = ["*"]
      exposed_headers    = ["*"]
      max_age_in_seconds = 3600
    }
  }
}

# Storage Container for assets
resource "azurerm_storage_container" "assets" {
  name                  = "assets"
  storage_account_name  = azurerm_storage_account.main.name
  container_access_type = "blob"
}

# Container Registry
resource "azurerm_container_registry" "main" {
  name                = "acrcyberstore${random_id.server.hex}"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  sku                 = "Basic"  # Económico
  admin_enabled       = true
}

# Container App Environment
resource "azurerm_container_app_environment" "main" {
  name                       = "cae-cyberstore"
  location                   = azurerm_resource_group.main.location
  resource_group_name        = azurerm_resource_group.main.name
  log_analytics_workspace_id = azurerm_log_analytics_workspace.main.id
}

# Log Analytics Workspace
resource "azurerm_log_analytics_workspace" "main" {
  name                = "law-cyberstore"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  sku                 = "PerGB2018"
  retention_in_days   = 7  # Económico
}

# Container App
resource "azurerm_container_app" "main" {
  name                         = "ca-cyberstore"
  container_app_environment_id = azurerm_container_app_environment.main.id
  resource_group_name          = azurerm_resource_group.main.name
  revision_mode                = "Single"
  
  template {
    min_replicas = 1
    max_replicas = 2  # Límite para economía
    
    container {
      name   = "cyberstore-app"
      image  = "nginx:latest"  # Placeholder - reemplazar con imagen real
      cpu    = 0.25           # Económico
      memory = "0.5Gi"        # Económico
      
      env {
        name  = "DATABASE_URL"
        value = "postgresql://${azurerm_postgresql_flexible_server.main.administrator_login}:${azurerm_postgresql_flexible_server.main.administrator_password}@${azurerm_postgresql_flexible_server.main.fqdn}:5432/${azurerm_postgresql_flexible_server_database.main.name}"
      }
      
      env {
        name  = "REDIS_URL"
        value = "rediss://:${azurerm_redis_cache.main.primary_access_key}@${azurerm_redis_cache.main.hostname}:${azurerm_redis_cache.main.ssl_port}"
      }
    }
  }
  
  ingress {
    allow_insecure_connections = false
    external_enabled          = true
    target_port               = 80
    
    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }
}

# Application Gateway (económico)
resource "azurerm_public_ip" "gateway" {
  name                = "pip-cyberstore-gateway"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  allocation_method   = "Static"
  sku                 = "Standard"
}

resource "azurerm_application_gateway" "main" {
  name                = "agw-cyberstore"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  
  sku {
    name     = "Standard_v2"
    tier     = "Standard_v2"
    capacity = 1  # Mínimo para economía
  }
  
  gateway_ip_configuration {
    name      = "gateway-ip-config"
    subnet_id = azurerm_subnet.app.id
  }
  
  frontend_port {
    name = "frontend-port-80"
    port = 80
  }
  
  frontend_port {
    name = "frontend-port-443"
    port = 443
  }
  
  frontend_ip_configuration {
    name                 = "frontend-ip-config"
    public_ip_address_id = azurerm_public_ip.gateway.id
  }
  
  backend_address_pool {
    name = "backend-pool"
  }
  
  backend_http_settings {
    name                  = "backend-http-settings"
    cookie_based_affinity = "Disabled"
    path                  = ""
    port                  = 80
    protocol              = "Http"
    request_timeout       = 60
  }
  
  http_listener {
    name                           = "http-listener"
    frontend_ip_configuration_name = "frontend-ip-config"
    frontend_port_name             = "frontend-port-80"
    protocol                       = "Http"
  }
  
  request_routing_rule {
    name                       = "routing-rule"
    rule_type                  = "Basic"
    http_listener_name         = "http-listener"
    backend_address_pool_name  = "backend-pool"
    backend_http_settings_name = "backend-http-settings"
  }
}

# CDN Profile (económico)
resource "azurerm_cdn_profile" "main" {
  name                = "cdn-cyberstore"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  sku                 = "Standard_Microsoft"  # Económico
}

resource "azurerm_cdn_endpoint" "main" {
  name                = "cdne-cyberstore-${random_id.server.hex}"
  profile_name        = azurerm_cdn_profile.main.name
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  
  origin {
    name      = "origin"
    host_name = azurerm_storage_account.main.primary_blob_host
  }
  
  origin_host_header = azurerm_storage_account.main.primary_blob_host
  
  global_delivery_rule {
    cache_expiration_action {
      behavior = "Override"
      duration = "1.00:00:00"
    }
  }
}

# Outputs
output "database_connection_string" {
  value = "postgresql://${azurerm_postgresql_flexible_server.main.administrator_login}:${azurerm_postgresql_flexible_server.main.administrator_password}@${azurerm_postgresql_flexible_server.main.fqdn}:5432/${azurerm_postgresql_flexible_server_database.main.name}"
  sensitive = true
}

output "redis_connection_string" {
  value = "rediss://:${azurerm_redis_cache.main.primary_access_key}@${azurerm_redis_cache.main.hostname}:${azurerm_redis_cache.main.ssl_port}"
  sensitive = true
}

output "storage_account_name" {
  value = azurerm_storage_account.main.name
}

output "container_registry_url" {
  value = azurerm_container_registry.main.login_server
}

output "application_gateway_ip" {
  value = azurerm_public_ip.gateway.ip_address
}

output "container_app_url" {
  value = "https://${azurerm_container_app.main.latest_revision_fqdn}"
}

output "cdn_endpoint_url" {
  value = "https://${azurerm_cdn_endpoint.main.fqdn}"
}

# Estimated monthly cost: ~$60-120 USD
# - PostgreSQL Flexible B1ms: ~$15/month
# - Redis Cache Basic 250MB: ~$16/month
# - Container Apps (0.25 vCPU, 0.5GB): ~$5-15/month
# - Application Gateway Standard_v2: ~$25/month
# - Storage Account: ~$1-5/month
# - CDN: ~$1-10/month