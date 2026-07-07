/* =========================================================
   ADITHYA S — PORTFOLIO SCRIPT (light/professional version)
========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- FOOTER YEAR ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

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

  /* ---------- SCROLL REVEAL ---------- */
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

  /* ---------- ANIMATED BARS (timeline metrics) ---------- */
  const bars = document.querySelectorAll('.metric-fill');
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
    const duration = 1200;
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

  /* ---------- SIMPLE TYPING TEXT (Hero) ---------- */
  const typedEl = document.getElementById('typedRole');
  const roles = ['PCB Design', 'Embedded Systems', 'Sensor-Based Automation', 'Digital Circuits'];
  let roleIndex = 0, charIndex = 0, deleting = false;

  function typeLoop(){
    const current = roles[roleIndex];
    if (!deleting){
      charIndex++;
      typedEl.textContent = current.slice(0, charIndex);
      if (charIndex === current.length){
        deleting = true;
        setTimeout(typeLoop, 1500);
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
    setTimeout(typeLoop, deleting ? 35 : 70);
  }
  if (typedEl) typeLoop();

  /* ---------- MASTER SCROLL HANDLER ---------- */
  function onScroll(){
    updateScrollProgress();
    toggleScrollTopBtn();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

});
