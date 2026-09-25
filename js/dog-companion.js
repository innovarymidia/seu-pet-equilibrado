/**
 * Seu Pet Equilibrado: Rastro Interativo de Patinhas (Paw Trail Engine)
 * Rastro fluido a 60fps no canvas que acompanha o cursor do mouse com pegadas alternadas
 * na cor rosa terracota da marca (#D9B6AC) com desvanecimento suave.
 */

class PawTrail {
  constructor() {
    this.pawSteps = [];
    this.lastPawX = 0;
    this.lastPawY = 0;
    this.lastAngle = 0;
    this.stepCount = 0;

    this.initDOM();
    this.initEvents();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  initDOM() {
    this.container = document.createElement('div');
    this.container.id = 'paw-trail-container';
    this.container.className = 'paw-trail-container';

    this.pawCanvas = document.createElement('canvas');
    this.pawCanvas.id = 'dog-paw-canvas';
    this.pawCanvas.className = 'dog-paw-canvas';
    this.ctx = this.pawCanvas.getContext('2d');
    this.resizeCanvas();

    this.container.appendChild(this.pawCanvas);
    document.body.appendChild(this.container);
  }

  initEvents() {
    window.addEventListener('mousemove', (e) => {
      this.recordPaw(e.clientX, e.clientY);
    });

    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        this.recordPaw(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    window.addEventListener('resize', () => {
      this.resizeCanvas();
    });
  }

  resizeCanvas() {
    this.pawCanvas.width = window.innerWidth;
    this.pawCanvas.height = window.innerHeight;
  }

  recordPaw(cx, cy) {
    const dist = Math.hypot(cx - (this.lastPawX || 0), cy - (this.lastPawY || 0));
    
    // Espaçamento confortável entre cada passo para parecer uma caminhada real
    if (dist > 38) {
      const angle = Math.atan2(cy - (this.lastRecY || cy), cx - (this.lastRecX || cx));
      this.lastRecX = cx;
      this.lastRecY = cy;
      this.lastPawX = cx;
      this.lastPawY = cy;
      this.stepCount++;

      // Alternância natural entre pata esquerda e pata direita
      const isLeft = (this.stepCount % 2 === 0);
      const sideOffset = isLeft ? -9 : 9;
      const normalAngle = angle + Math.PI / 2;

      const px = cx + Math.cos(normalAngle) * sideOffset;
      const py = cy + Math.sin(normalAngle) * sideOffset;

      this.pawSteps.push({
        x: px,
        y: py,
        angle: angle + Math.PI / 2,
        alpha: 0.62,
        life: 1.0,
        scale: 0.95 + Math.random() * 0.1
      });
    }
  }

  drawPaws() {
    this.ctx.clearRect(0, 0, this.pawCanvas.width, this.pawCanvas.height);

    for (let i = this.pawSteps.length - 1; i >= 0; i--) {
      const p = this.pawSteps[i];
      p.life -= 0.016;
      p.alpha = Math.max(0, p.life * 0.58);

      if (p.life <= 0) {
        this.pawSteps.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.angle);
      this.ctx.scale(p.scale, p.scale);
      this.ctx.globalAlpha = p.alpha;
      
      // Cor rosa pastel oficial do novo design editorial (#F5BAC9)
      this.ctx.fillStyle = '#F5BAC9';

      // Almofada central da patinha canina
      this.ctx.beginPath();
      this.ctx.ellipse(0, 3, 5.2, 4.2, 0, 0, Math.PI * 2);
      this.ctx.fill();

      // Almofadas dos dedinhos
      const toes = [-4.4, -1.5, 1.5, 4.4];
      const toeHeights = [-3.8, -5.6, -5.6, -3.8];
      const toeRadii = [1.5, 1.65, 1.65, 1.5];

      for (let j = 0; j < 4; j++) {
        this.ctx.beginPath();
        this.ctx.arc(toes[j], toeHeights[j], toeRadii[j], 0, Math.PI * 2);
        this.ctx.fill();
      }

      this.ctx.restore();
    }
  }

  animate() {
    this.drawPaws();
    requestAnimationFrame(this.animate);
  }
}

// Inicialização automática quando o DOM carregar
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.pawTrail = new PawTrail();
  });
} else {
  window.pawTrail = new PawTrail();
}
