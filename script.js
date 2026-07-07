/* =========================================================
   ADITHYA S — PORTFOLIO SCRIPT
   Sections: Loader, Scroll Progress, Trace Nav, Top Nav,
   Typing Animation, Particle BG, Oscilloscope Canvas,
   Counters, Skill/Metric Bars, Scroll Reveal, Scroll-to-top
========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- FOOTER YEAR ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- LOADER ---------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => { loader.classList.add('hidden'); }, 500);
  });
  // fallback in case 'load' already fired
  setTimeout(() => { loader && loader.classList.add('hidden'); }, 2500);

  /* ---------- MOBILE NAV TOGGLE ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

  /* ---------- SCROLL PROGRESS BAR ---------- */
  const scrollProgress = document.getElementById('scrollProgress');
  function updateScrollProgress(){
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    scrollProgress.style.width = scrolled + '%';
  }

  /* ---------- SCROLL TO TOP ---------- */
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  function toggleScrollTopBtn(){
    if (window.scrollY > 500) scrollTopBtn.classList.add('show');
    else scrollTopBtn.classList.remove('show');
  }
  scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- ACTIVE SECTION TRACKING (Top nav + Trace nav) ---------- */
  const sections = document.querySelectorAll('main section, header ~ section');
  const allSections = document.querySelectorAll('section[id]');
  const vias = document.querySelectorAll('.via');
  const topNavLinks = document.querySelectorAll('#navLinks a[href^="#"]');

  vias.forEach(v => v.addEventListener('click', () => {
    const target = document.getElementById(v.dataset.target);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  }));

  function setActiveSection(){
    let currentId = allSections[0] ? allSections[0].id : null;
    const scrollPos = window.scrollY + window.innerHeight * 0.35;
    allSections.forEach(sec => {
      if (sec.offsetTop <= scrollPos) currentId = sec.id;
    });
    vias.forEach(v => v.classList.toggle('active', v.dataset.target === currentId));
    topNavLinks.forEach(a => {
      const href = a.getAttribute('href').replace('#','');
      a.classList.toggle('active-link', href === currentId);
    });
  }

  /* ---------- SCROLL REVEAL (Intersection Observer) ---------- */
  const revealEls = document.querySelectorAll('.fade-up');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- ANIMATED BARS (skills + timeline metrics) ---------- */
  const bars = document.querySelectorAll('.bar-fill, .metric-fill');
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        const el = entry.target;
        const fill = el.dataset.fill || 0;
        requestAnimationFrame(() => { el.style.width = fill + '%'; });
        barObserver.unobserve(el);
      }
    });
  }, { threshold: 0.4 });
  bars.forEach(b => barObserver.observe(b));

  /* ---------- ANIMATED COUNTERS ---------- */
  const counters = document.querySelectorAll('.stat-num');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });
  counters.forEach(c => counterObserver.observe(c));

  function animateCounter(el){
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const duration = 1400;
    const start = performance.now();
    function tick(now){
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = decimals > 0 ? value.toFixed(decimals) : Math.round(value);
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = decimals > 0 ? target.toFixed(decimals) : target;
    }
    requestAnimationFrame(tick);
  }

  /* ---------- TYPING ANIMATION (Hero) ---------- */
  const typedEl = document.getElementById('typedRole');
  const roles = ['Embedded Systems', 'VLSI-ready Circuits', 'PCB Layouts', 'FPGA Prototypes', 'Sensor-driven Automation'];
  let roleIndex = 0, charIndex = 0, deleting = false;

  function typeLoop(){
    const current = roles[roleIndex];
    if (!deleting){
      charIndex++;
      typedEl.textContent = current.slice(0, charIndex);
      if (charIndex === current.length){
        deleting = true;
        setTimeout(typeLoop, 1400);
        return;
      }
    } else {
      charIndex--;
      typedEl.textContent = current.slice(0, charIndex);
      if (charIndex === 0){
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }
    setTimeout(typeLoop, deleting ? 40 : 65);
  }
  if (typedEl) typeLoop();

  /* ---------- PARTICLE BACKGROUND (Hero) ---------- */
  const pCanvas = document.getElementById('particleCanvas');
  if (pCanvas){
    const pctx = pCanvas.getContext('2d');
    let particles = [];
    const heroSection = document.getElementById('hero');

    function resizeParticleCanvas(){
      pCanvas.width = heroSection.clientWidth;
      pCanvas.height = heroSection.clientHeight;
    }
    function initParticles(){
      const count = Math.min(60, Math.floor(pCanvas.width / 22));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * pCanvas.width,
        y: Math.random() * pCanvas.height,
        r: Math.random() * 1.6 + 0.6,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        hue: Math.random() > 0.5 ? 'copper' : 'signal'
      }));
    }
    function drawParticles(){
      pctx.clearRect(0, 0, pCanvas.width, pCanvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > pCanvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > pCanvas.height) p.vy *= -1;
        pctx.beginPath();
        pctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        pctx.fillStyle = p.hue === 'copper' ? 'rgba(200,127,74,0.55)' : 'rgba(124,255,178,0.5)';
        pctx.fill();
      });
      // connecting lines for a circuit-trace feel
      for (let i = 0; i < particles.length; i++){
        for (let j = i + 1; j < particles.length; j++){
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120){
            pctx.beginPath();
            pctx.moveTo(particles[i].x, particles[i].y);
            pctx.lineTo(particles[j].x, particles[j].y);
            pctx.strokeStyle = `rgba(200,127,74,${0.12 * (1 - dist / 120)})`;
            pctx.lineWidth = 1;
            pctx.stroke();
          }
        }
      }
      requestAnimationFrame(drawParticles);
    }
    resizeParticleCanvas();
    initParticles();
    drawParticles();
    window.addEventListener('resize', () => { resizeParticleCanvas(); initParticles(); });
  }

  /* ---------- OSCILLOSCOPE CANVAS (Hero signal monitor) ---------- */
  const scopeCanvas = document.getElementById('scopeCanvas');
  if (scopeCanvas){
    const sctx = scopeCanvas.getContext('2d');
    let t = 0;
    function resizeScope(){
      scopeCanvas.width = scopeCanvas.clientWidth * devicePixelRatio;
      scopeCanvas.height = scopeCanvas.clientHeight * devicePixelRatio;
    }
    function drawGrid(){
      const w = scopeCanvas.width, h = scopeCanvas.height;
      sctx.strokeStyle = 'rgba(124,255,178,0.08)';
      sctx.lineWidth = 1;
      for (let x = 0; x < w; x += w / 10){
        sctx.beginPath(); sctx.moveTo(x, 0); sctx.lineTo(x, h); sctx.stroke();
      }
      for (let y = 0; y < h; y += h / 6){
        sctx.beginPath(); sctx.moveTo(0, y); sctx.lineTo(w, y); sctx.stroke();
      }
    }
    function drawWave(){
      const w = scopeCanvas.width, h = scopeCanvas.height;
      sctx.clearRect(0, 0, w, h);
      drawGrid();
      sctx.beginPath();
      sctx.lineWidth = 2 * devicePixelRatio;
      sctx.strokeStyle = '#7CFFB2';
      sctx.shadowColor = 'rgba(124,255,178,0.6)';
      sctx.shadowBlur = 6;
      for (let x = 0; x <= w; x++){
        const freq = 0.02;
        const y = h / 2
          + Math.sin(x * freq + t) * (h * 0.18)
          + Math.sin(x * freq * 2.3 + t * 1.6) * (h * 0.07);
        if (x === 0) sctx.moveTo(x, y); else sctx.lineTo(x, y);
      }
      sctx.stroke();
      t += 0.045;
      requestAnimationFrame(drawWave);
    }
    resizeScope();
    drawWave();
    window.addEventListener('resize', resizeScope);
  }

  /* ---------- RESUME DOWNLOAD BUTTON ---------- */
  // Points to the uploaded resume filename if hosted alongside; otherwise opens contact.
  const resumeBtn = document.getElementById('resumeBtn');
  if (resumeBtn){
    resumeBtn.addEventListener('click', (e) => {
      // If a resume.pdf isn't present alongside this file, gracefully fall back.
      fetch('resume.pdf', { method: 'HEAD' }).then(res => {
        if (!res.ok) throw new Error('missing');
        resumeBtn.setAttribute('href', 'resume.pdf');
      }).catch(() => {
        e.preventDefault();
        window.location.href = 'mailto:adithyasnec@gmail.com?subject=Resume Request&body=Hi Adithya, could you share your latest resume?';
      });
    });
  }

  /* ---------- MASTER SCROLL HANDLER ---------- */
  function onScroll(){
    updateScrollProgress();
    toggleScrollTopBtn();
    setActiveSection();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

});
