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
    location: ''
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
    quizState.answers = { age: '', challenge: '', location: '' };
    quizContainer.querySelectorAll('.quiz-option-btn').forEach(btn => btn.classList.remove('selected'));
    showStep(1);
  });
}

function generateRecommendation() {
  const resultTitle = document.getElementById('quiz-result-title');
  const resultDesc = document.getElementById('quiz-result-desc');
  const resultTag = document.getElementById('quiz-result-tag');
  const resultWaBtn = document.getElementById('quiz-whatsapp-btn');

  const age = quizState.answers.age || 'cão';
  const challenge = quizState.answers.challenge || 'comportamento';
  const location = quizState.answers.location || 'cuiaba';

  const ageLabels = {
    puppy: 'filhote',
    young: 'jovem',
    adult: 'adulto',
    senior: 'idoso'
  };

  const challengeLabels = {
    xixi: 'xixi e cocô fora do lugar',
    mordidas: 'mordidas em mãos ou objetos',
    passeio: 'puxões ou agitação no passeio',
    latidos: 'latidos em determinadas situações',
    destruicao: 'destruição de objetos quando sozinho',
    ansiedade: 'ansiedade ou dificuldade em ficar sozinho',
    obediencia: 'orientação e obediência básica',
    medo: 'medos e inseguranças',
    outro: 'comportamento geral'
  };

  const locationLabels = {
    cuiaba: 'Cuiabá',
    varzeagrande: 'Várzea Grande',
    outra: 'outra cidade'
  };

  const ageText = ageLabels[age] || 'cão';
  const challengeText = challengeLabels[challenge] || 'comportamento';
  const locationText = locationLabels[location] || 'Cuiabá';

  let recommendation;

  if (location === 'cuiaba' || location === 'varzeagrande') {
    recommendation = {
      title: "Atendimento Presencial com o Adestrador João Eduardo",
      tag: "Recomendado para quem está em Cuiabá e Várzea Grande",
      desc: "Como você está na região metropolitana, o acompanhamento presencial diretamente na sua casa e nos locais de passeio permite avaliar o ambiente real e orientar você sobre como conduzir o treinamento no dia a dia.",
      linkText: `Olá João Eduardo! Fiz o formulário no site. Tenho um cão ${ageText}, nossa maior questão é ${challengeText} e moro em ${locationText}. Gostaria de conversar para entender o caso do meu cão!`
    };
  } else {
    recommendation = {
      title: "Consultoria Comportamental Online com a Adestradora Nicolle",
      tag: "Orientação Online para Você Aplicar na Rotina da Sua Casa",
      desc: "Para quem mora em outras cidades, a consultoria online com a Nicolle é o formato ideal para analisar o histórico, entender a rotina da casa e estruturar o plano de manejo que a família aplicará com suporte contínuo.",
      linkText: `Olá Nicolle! Fiz o formulário no site. Tenho um cão ${ageText}, nossa maior questão é ${challengeText} e moro em ${locationText}. Gostaria de conversar para entender a consultoria online!`
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
      items.forEach(i => {
        i.classList.remove('active');
        i.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
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
