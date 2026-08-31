/**
 * Seu Pet Equilibrado: Main Application Logic
 * Quiz, Accordion, WhatsApp Deep Linking e UX Polish
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initQuiz();
  initAccordion();
  initTestimonials();
  initStatsCounter();
});

/* ====================================================
   1. NAVBAR SCROLL E MOBILE MENU
   ==================================================== */
function initNavbar() {
  const header = document.querySelector('.site-header');
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }, { passive: true });

  menuToggle?.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navMenu?.classList.toggle('active');
  });

  // Close mobile menu on link click
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle?.classList.remove('active');
      navMenu?.classList.remove('active');
    });
  });
}

/* ====================================================
   2. INTERACTIVE DOG TRAINING QUIZ (LEAD MAGNET)
   ==================================================== */
const quizState = {
  step: 1,
  answers: {
    age: '',
    challenge: '',
    format: ''
  }
};

function initQuiz() {
  const quizContainer = document.getElementById('pet-quiz-card');
  if (!quizContainer) return;

  const steps = quizContainer.querySelectorAll('.quiz-step');
  const progressBars = quizContainer.querySelectorAll('.quiz-progress-segment');

  function showStep(stepIndex) {
    quizState.step = stepIndex;
    steps.forEach((s, idx) => {
      s.classList.toggle('active', idx + 1 === stepIndex);
    });

    progressBars.forEach((p, idx) => {
      p.classList.toggle('filled', idx + 1 <= stepIndex);
    });

    if (stepIndex === 4) {
      generateRecommendation();
    }
  }

  quizContainer.addEventListener('click', (e) => {
    const optionBtn = e.target.closest('.quiz-option-btn');
    if (!optionBtn) return;

    const group = optionBtn.dataset.group;
    const value = optionBtn.dataset.value;

    quizState.answers[group] = value;

    // Highlight selected
    optionBtn.parentElement.querySelectorAll('.quiz-option-btn').forEach(btn => {
      btn.classList.remove('selected');
    });
    optionBtn.classList.add('selected');

    // Auto advance after slight delay for tactile feel
    setTimeout(() => {
      if (quizState.step < 4) {
        showStep(quizState.step + 1);
      }
    }, 280);
  });

  // Restart quiz
  document.getElementById('btn-restart-quiz')?.addEventListener('click', () => {
    quizState.step = 1;
    quizState.answers = { age: '', challenge: '', format: '' };
    quizContainer.querySelectorAll('.quiz-option-btn').forEach(btn => btn.classList.remove('selected'));
    showStep(1);
  });
}

function generateRecommendation() {
  const resultTitle = document.getElementById('quiz-result-title');
  const resultDesc = document.getElementById('quiz-result-desc');
  const resultTag = document.getElementById('quiz-result-tag');
  const resultWaBtn = document.getElementById('quiz-whatsapp-btn');

  const challenge = quizState.answers.challenge;
  const age = quizState.answers.age;
  const format = quizState.answers.format;

  let recommendation;

  if (format === 'presencial') {
    recommendation = {
      title: "Atendimento Presencial com o Adestrador João Eduardo",
      tag: "Treino Domiciliar em Cuiabá, MT",
      desc: "O Adestrador João Eduardo irá pessoalmente até sua casa para avaliar o ambiente, entender os desafios do seu cão e aplicar treinos práticos de reforço positivo com a sua família.",
      linkText: "Olá! Fiz o diagnóstico no site e gostaria de agendar atendimento presencial em Cuiabá com o Adestrador João Eduardo!"
    };
  } else if (format === 'online') {
    recommendation = {
      title: "Consultoria Online com a Adestradora Nicolle",
      tag: "Consultoria Comportamental ao Vivo",
      desc: "A Adestradora Nicolle atenderá você por chamada de vídeo para diagnosticar a rotina, alinhar o manejo do seu cão e orientar o passo a passo com suporte contínuo via WhatsApp.",
      linkText: "Olá! Fiz o diagnóstico no site e gostaria de agendar consultoria online com a Adestradora Nicolle!"
    };
  } else if (challenge === 'xixi') {
    recommendation = {
      title: "Orientação e Manejo Sanitário: Xixi e Cocô no Lugar Certo",
      tag: "Rotina e Higiene sem Estresse",
      desc: "Metodologia comprovada para orientar seu cão a fazer as necessidades no sanitário correto. Disponível presencialmente em Cuiabá com João Eduardo ou online com Nicolle.",
      linkText: "Olá! Fiz o teste no site e preciso de ajuda com xixi e cocô do meu cão no lugar errado."
    };
  } else {
    recommendation = {
      title: "Atendimento Personalizado Seu Pet Equilibrado",
      tag: "Solução Sob Medida",
      desc: "Nossa dupla de especialistas, João Eduardo e Nicolle, está pronta para criar o melhor plano de treinamento e devolver a tranquilidade para o seu lar.",
      linkText: "Olá! Fiz o teste no site e gostaria de saber mais sobre as soluções de adestramento da Seu Pet Equilibrado."
    };
  }

  if (resultTitle) resultTitle.innerText = recommendation.title;
  if (resultTag) resultTag.innerText = recommendation.tag;
  if (resultDesc) resultDesc.innerText = recommendation.desc;

  if (resultWaBtn) {
    const encoded = encodeURIComponent(recommendation.linkText);
    resultWaBtn.href = `https://wa.me/5565984298949?text=${encoded}`;
  }
}

/* ====================================================
   3. ACCORDION (FAQ)
   ==================================================== */
function initAccordion() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach(item => {
    const trigger = item.querySelector('.faq-question');
    trigger?.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');
      items.forEach(i => i.classList.remove('active'));
      if (!isOpen) {
        item.classList.add('active');
      }
    });
  });
}

/* ====================================================
   4. TESTIMONIALS SLIDER
   ==================================================== */
function initTestimonials() {
  const cards = document.querySelectorAll('.testimonial-card');
  const dots = document.querySelectorAll('.testimonial-dot');
  let current = 0;

  function setIndex(index) {
    current = index;
    cards.forEach((c, idx) => {
      c.classList.toggle('active', idx === current);
    });
    dots.forEach((d, idx) => {
      d.classList.toggle('active', idx === current);
    });
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => setIndex(idx));
  });

  // Auto rotate every 6 seconds
  setInterval(() => {
    if (cards.length > 1) {
      let next = (current + 1) % cards.length;
      setIndex(next);
    }
  }, 6000);
}

/* ====================================================
   5. STATS ANIMATED COUNTER
   ==================================================== */
function initStatsCounter() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  let started = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !started) {
        started = true;
        counters.forEach(counter => {
          const target = +counter.dataset.target;
          let current = 0;
          const increment = Math.ceil(target / 45);
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              counter.innerText = target + (counter.dataset.suffix || '');
              clearInterval(timer);
            } else {
              counter.innerText = current + (counter.dataset.suffix || '');
            }
          }, 35);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.stats-strip');
  if (statsSection) observer.observe(statsSection);
}
