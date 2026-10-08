/* Arena Animation Geeta Bhawan — Main JavaScript */

document.addEventListener('DOMContentLoaded', () => {

  // ── 1. HERO CAROUSEL ──────────────────────────────────────────────────────
  const track     = document.getElementById('hero-track');
  const dots      = document.querySelectorAll('.hero-dot');
  const prevBtn   = document.getElementById('hero-prev');
  const nextBtn   = document.getElementById('hero-next');
  const slides    = document.querySelectorAll('.hero-slide');
  let current     = 0;
  let autoTimer   = null;

  function goToSlide(idx) {
    current = (idx + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => {
      d.classList.toggle('bg-[#E8450A]', i === current);
      d.classList.toggle('w-7', i === current);
      d.classList.toggle('bg-white/60', i !== current);
      d.classList.toggle('w-2', i !== current);
      // Tailwind orange via inline style since arbitrary value in class may not compile at runtime
      d.style.backgroundColor = i === current ? '#E8450A' : 'rgba(255,255,255,0.6)';
      d.style.width = i === current ? '28px' : '8px';
    });
  }

  function startAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goToSlide(current + 1), 4500);
  }

  if (track && slides.length) {
    prevBtn && prevBtn.addEventListener('click', () => { goToSlide(current - 1); startAuto(); });
    nextBtn && nextBtn.addEventListener('click', () => { goToSlide(current + 1); startAuto(); });
    dots.forEach(d => d.addEventListener('click', () => { goToSlide(+d.dataset.index); startAuto(); }));

    // Touch/swipe support
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 50) { goToSlide(current + (dx < 0 ? 1 : -1)); startAuto(); }
    });

    goToSlide(0);
    startAuto();
  }

  // ── 2. MOBILE NAV ─────────────────────────────────────────────────────────
  const hamburgerBtn      = document.getElementById('hamburger-btn');
  const mobileMenu        = document.getElementById('mobile-menu');
  const hamIcon           = document.getElementById('ham-icon');
  const closeIcon         = document.getElementById('close-icon');
  const mobileServicesBtn = document.getElementById('mobile-services-btn');
  const mobileServicesSub = document.getElementById('mobile-services-sub');

  if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = !mobileMenu.classList.contains('hidden');
      mobileMenu.classList.toggle('hidden', isOpen);
      hamIcon   && hamIcon.classList.toggle('hidden', !isOpen);
      closeIcon && closeIcon.classList.toggle('hidden', isOpen);
      hamburgerBtn.setAttribute('aria-expanded', String(!isOpen));
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (!hamburgerBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.add('hidden');
        hamIcon   && hamIcon.classList.remove('hidden');
        closeIcon && closeIcon.classList.add('hidden');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  if (mobileServicesBtn && mobileServicesSub) {
    mobileServicesBtn.addEventListener('click', () => {
      mobileServicesSub.classList.toggle('hidden');
    });
  }

  // ── 3. STICKY NAVBAR SHADOW ───────────────────────────────────────────────
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });
  }

  // ── 4. FAQ ACCORDION ──────────────────────────────────────────────────────
  document.querySelectorAll('.faq-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const item   = btn.closest('.faq-item');
      const body   = item.querySelector('.faq-body');
      const icon   = btn.querySelector('.faq-icon');
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      // Close all
      document.querySelectorAll('.faq-item').forEach(i => {
        i.querySelector('.faq-btn').setAttribute('aria-expanded', 'false');
        i.querySelector('.faq-body').style.maxHeight = '0';
        i.querySelector('.faq-icon').style.transform = '';
      });

      // Open clicked if it was closed
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        body.style.maxHeight = body.scrollHeight + 'px';
        icon.style.transform = 'rotate(180deg)';
      }
    });
  });

  // ── 5. COUNTER ANIMATION ──────────────────────────────────────────────────
  function animateCounters() {
    document.querySelectorAll('.counter-val').forEach(el => {
      const target = +el.dataset.target;
      const suffix = el.dataset.suffix || '';
      const duration = 1800;
      const startTime = performance.now();

      function tick(now) {
        const elapsed  = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out cubic
        const ease = 1 - Math.pow(1 - progress, 3);
        const val  = Math.round(ease * target);
        el.textContent = val + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }

  // Trigger counters when milestones section enters viewport
  const milestonesSection = document.getElementById('milestones');
  if (milestonesSection) {
    let countersRun = false;
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !countersRun) {
        countersRun = true;
        animateCounters();
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    obs.observe(milestonesSection);
  }

  // ── 6. SCROLL FADE-IN ─────────────────────────────────────────────────────
  const fadeEls = document.querySelectorAll('.fade-in');
  if (fadeEls.length) {
    const fadeObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    fadeEls.forEach(el => fadeObs.observe(el));
  }

  // ── 7. SMOOTH SCROLL for anchor links ────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── 8. EMAIL SUBSCRIBE (placeholder handler) ─────────────────────────────
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (input && input.value) {
        const btn = form.querySelector('button[type="submit"]');
        if (btn) {
          btn.innerHTML = '<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>';
          btn.style.background = '#22c55e';
        }
        input.value = '';
        setTimeout(() => {
          if (btn) { btn.innerHTML = '<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>'; btn.style.background = ''; }
        }, 2500);
      }
    });
  });

});


// Emerge Animation Observer
document.addEventListener('DOMContentLoaded', () => {
  const emergeElements = document.querySelectorAll('.emerge-element');
  
  const emergeObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('opacity-0', 'translate-y-16');
        entry.target.classList.add('opacity-100', 'translate-y-0');
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  });

  emergeElements.forEach(el => {
    emergeObserver.observe(el);
  });
});
