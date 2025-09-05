import React, { useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
  vx: number;
  vy: number;
  trail: { x: number; y: number; alpha: number }[];
}

const NetworkAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const pointsRef = useRef<Point[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createPoints = () => {
      pointsRef.current = Array.from({ length: 50 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        trail: []
      }));
    };

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      pointsRef.current.forEach(point => {
        // Update position
        point.x += point.vx;
        point.y += point.vy;

        // Bounce off edges
        if (point.x <= 0 || point.x >= canvas.width) point.vx *= -1;
        if (point.y <= 0 || point.y >= canvas.height) point.vy *= -1;

        // Add to trail
        point.trail.push({ x: point.x, y: point.y, alpha: 1 });
        if (point.trail.length > 20) point.trail.shift();

        // Update trail alpha
        point.trail.forEach((trailPoint, index) => {
          trailPoint.alpha = index / point.trail.length;
        });

        // Draw trail
        point.trail.forEach((trailPoint, index) => {
          const hue = (Date.now() * 0.001 + index * 0.1) % 360;
          ctx.fillStyle = `hsla(${hue}, 100%, 50%, ${trailPoint.alpha * 0.3})`;
          ctx.beginPath();
          ctx.arc(trailPoint.x, trailPoint.y, 2, 0, Math.PI * 2);
          ctx.fill();
        });

        // Draw point
        const hue = Date.now() * 0.001 % 360;
        ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
        ctx.beginPath();
        ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw connections
      pointsRef.current.forEach((point1, i) => {
        pointsRef.current.slice(i + 1).forEach(point2 => {
          const distance = Math.sqrt(
            Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2)
          );

          if (distance < 150) {
            const opacity = 1 - distance / 150;
            const hue = (Date.now() * 0.001) % 360;
            ctx.strokeStyle = `hsla(${hue}, 100%, 50%, ${opacity * 0.3})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(point1.x, point1.y);
            ctx.lineTo(point2.x, point2.y);
            ctx.stroke();
          }
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    createPoints();
    animate();

    const handleResize = () => {
      resizeCanvas();
      createPoints();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      style={{ background: 'radial-gradient(circle, #0a0a0a 0%, #000000 100%)' }}
    />
  );
};

export default NetworkAnimation;