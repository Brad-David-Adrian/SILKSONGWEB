// Amber particle animation for background
class AmberParticle {
    constructor(canvas) {
        this.canvas = canvas;
        this.reset();
    }

    reset() {
        // Start from bottom of screen
        this.x = Math.random() * this.canvas.width;
        this.y = this.canvas.height + Math.random() * 50;

        // Random upward velocity with some horizontal drift
        this.vx = (Math.random() - 0.5) * 0.5; // Horizontal drift
        this.vy = -(Math.random() * 2 + 1); // Upward movement

        // Particle properties
        this.size = Math.random() * 3 + 1;
        this.opacity = Math.random() * 0.8 + 0.2;
        this.life = Math.random() * 100 + 50; // Lifespan
        this.maxLife = this.life;

        // Amber color variations
        this.color = this.getAmberColor();
    }

    getAmberColor() {
        const colors = [
            '#ffb443', // Main amber
            '#ff8c00', // Dark orange
            '#ffa500', // Orange
            '#ffd700', // Gold
            '#ff6347'  // Tomato (reddish amber)
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life--;

        // Fade out as life decreases
        this.opacity = (this.life / this.maxLife) * 0.8;

        // Reset particle when it goes off screen or dies
        if (this.y < -10 || this.life <= 0) {
            this.reset();
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;

        // Draw particle as a small circle with glow
        ctx.shadowColor = this.color;
        ctx.shadowBlur = this.size * 2;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

class AmberAnimation {
    constructor() {
        this.canvas = document.getElementById('amberCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 50; // Adjust for performance

        this.resize();
        this.init();
        this.animate();

        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push(new AmberParticle(this.canvas));
        }
    }

    animate() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw particles
        this.particles.forEach(particle => {
            particle.update();
            particle.draw(this.ctx);
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize animation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AmberAnimation();
});
