// ---------- header scroll state ----------
  const header = document.getElementById('siteHeader');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });

  // ---------- mobile nav ----------
  const navToggle = document.getElementById('navToggle');
  navToggle.addEventListener('click', () => {
    const open = document.body.classList.toggle('nav-open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
  document.querySelectorAll('.mobile-nav a').forEach(a => {
    a.addEventListener('click', () => document.body.classList.remove('nav-open'));
  });

  // ---------- reduced motion check ----------
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- typewriter ----------
  const roles = ['Electronics & Communication Engineer','AI&ML', 'Embedded Systems Enthusiast', 'Frontend Developer', 'PCB Designer'];
  const twEl = document.getElementById('typewriter');
  if (prefersReduced) {
    twEl.textContent = roles.join(' · ');
  } else {
    let ri = 0, ci = 0, deleting = false;
    function tick() {
      const word = roles[ri];
      if (!deleting) {
        ci++;
        twEl.textContent = word.slice(0, ci);
        if (ci === word.length) { deleting = true; setTimeout(tick, 1500); return; }
      } else {
        ci--;
        twEl.textContent = word.slice(0, ci);
        if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
      }
      setTimeout(tick, deleting ? 35 : 65);
    }
    tick();
  }

  // ---------- circuit rail ----------
  const railPads = document.getElementById('railPads');
  const railPulse = document.getElementById('railPulse');
  const padSections = Array.from(document.querySelectorAll('.section[data-pad]'));
  let padEls = [];

  function layoutRail() {
    railPads.innerHTML = '';
    padEls = [];
    const docH = document.documentElement.scrollHeight;
    const winH = window.innerHeight;
    const scrollable = Math.max(docH - winH, 1);
    padSections.forEach(sec => {
      const top = sec.getBoundingClientRect().top + window.scrollY;
      const pct = Math.min(100, Math.max(0, (top / scrollable) * 100));
      const dot = document.createElement('div');
      dot.className = 'rail-pad';
      dot.style.top = pct + '%';
      dot.dataset.target = sec.id;
      railPads.appendChild(dot);
      padEls.push(dot);
    });
  }

  function updatePulse() {
    const docH = document.documentElement.scrollHeight;
    const winH = window.innerHeight;
    const scrollable = Math.max(docH - winH, 1);
    const pct = Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100));
    railPulse.style.top = pct + '%';
  }

  let resizeT;
  window.addEventListener('resize', () => {
    clearTimeout(resizeT);
    resizeT = setTimeout(layoutRail, 150);
  });
  window.addEventListener('load', () => { layoutRail(); updatePulse(); });
  window.addEventListener('scroll', updatePulse, { passive: true });

  // ---------- scrollspy + reveal via IntersectionObserver ----------
  const navLinks = document.querySelectorAll('.site-nav a[href^="#"]');
  const allTracked = [...padSections, document.getElementById('top')];

  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.id;
      if (entry.isIntersecting) {
        navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
        padEls.forEach(p => p.classList.toggle('active', p.dataset.target === id));
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });

  allTracked.forEach(sec => sec && spyObserver.observe(sec));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => revealObserver.observe(el));
