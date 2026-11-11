// =============================================
// Puertas Antonio García — Main JavaScript
// =============================================
document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // Mobile Navigation Toggle
  // ==========================================
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navbar = document.querySelector('.navbar');

  navToggle?.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    navToggle.classList.toggle('active');
  });

  // Close mobile menu when clicking a link
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      navToggle.classList.remove('active');
    });
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
      navLinks.classList.remove('active');
      navToggle.classList.remove('active');
    }
  });

  // ==========================================
  // Sticky Navbar with Background on Scroll
  // ==========================================
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // ==========================================
  // Smooth Scrolling for Anchor Links
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const navHeight = navbar.offsetHeight;
        const targetPos = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    });
  });

  // ==========================================
  // Active Nav Link Highlighting
  // ==========================================
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-links a');

  function highlightNav() {
    const scrollPos = window.pageYOffset + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navItems.forEach(item => {
          item.classList.remove('active');
          if (item.getAttribute('href') === '#' + id) {
            item.classList.add('active');
          }
        });
      }
    });
  }
  window.addEventListener('scroll', highlightNav);
  highlightNav();

  // ==========================================
  // Intersection Observer — Fade In on Scroll
  // ==========================================
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));

  // ==========================================
  // Stats Counter Animation
  // ==========================================
  const statsGrid = document.querySelector('.stats-grid');

  if (statsGrid) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.stat-number').forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const suffix = counter.getAttribute('data-suffix') || '';
            const duration = 2000;
            const startTime = performance.now();

            function easeOutQuart(t) {
              return 1 - Math.pow(1 - t, 4);
            }

            function updateCounter(currentTime) {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const easedProgress = easeOutQuart(progress);
              const current = Math.floor(easedProgress * target);

              counter.textContent = current.toLocaleString('es-ES') + suffix;

              if (progress < 1) {
                requestAnimationFrame(updateCounter);
              } else {
                counter.textContent = target.toLocaleString('es-ES') + suffix;
              }
            }

            requestAnimationFrame(updateCounter);
          });
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    statsObserver.observe(statsGrid);
  }

  // ==========================================
  // Cookie Banner
  // ==========================================
  const cookieBanner = document.querySelector('.cookie-banner');
  const cookieAccept = document.querySelector('.cookie-accept');
  const cookieReject = document.querySelector('.cookie-reject');

  if (!localStorage.getItem('cookiesAccepted') && cookieBanner) {
    setTimeout(() => cookieBanner.classList.add('visible'), 1500);
  }

  cookieAccept?.addEventListener('click', () => {
    localStorage.setItem('cookiesAccepted', 'true');
    cookieBanner.classList.remove('visible');
  });

  cookieReject?.addEventListener('click', () => {
    localStorage.setItem('cookiesAccepted', 'false');
    cookieBanner.classList.remove('visible');
  });

  // ==========================================
  // Contact Form — Validation & Submit
  // ==========================================
  const contactForm = document.getElementById('contact-form');

  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const fields = {
      name: contactForm.querySelector('#name'),
      email: contactForm.querySelector('#email'),
      phone: contactForm.querySelector('#phone'),
      message: contactForm.querySelector('#message')
    };

    let isValid = true;

    // Required field validation
    Object.values(fields).forEach(field => {
      if (!field.value.trim()) {
        field.closest('.form-group').classList.add('error');
        isValid = false;
      } else {
        field.closest('.form-group').classList.remove('error');
      }
    });

    // Email format validation
    if (fields.email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.value)) {
      fields.email.closest('.form-group').classList.add('error');
      isValid = false;
    }

    if (isValid) {
      const btn = contactForm.querySelector('button[type="submit"]');
      const originalHTML = btn.innerHTML;
      btn.innerHTML = '✓ ¡Mensaje enviado con éxito!';
      btn.classList.add('success');
      btn.disabled = true;

      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.classList.remove('success');
        btn.disabled = false;
        contactForm.reset();
      }, 4000);
    }
  });

  // Remove error state on input
  document.querySelectorAll('.form-group input, .form-group textarea, .form-group select').forEach(field => {
    field.addEventListener('input', () => {
      field.closest('.form-group').classList.remove('error');
    });
  });

  // ==========================================
  // Testimonial Slider
  // ==========================================
  const track = document.querySelector('.testimonials-track');
  const cards = document.querySelectorAll('.testimonial-card');
  const prevBtn = document.querySelector('.testimonial-prev');
  const nextBtn = document.querySelector('.testimonial-next');
  const dotsContainer = document.querySelector('.testimonial-dots');

  if (track && cards.length > 0) {
    let currentIndex = 0;
    let autoSlideInterval;

    function getCardsPerView() {
      if (window.innerWidth < 640) return 1;
      if (window.innerWidth < 1024) return 2;
      return 3;
    }

    function getMaxIndex() {
      return Math.max(0, Math.ceil(cards.length / getCardsPerView()) - 1);
    }

    function createDots() {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      const total = getMaxIndex() + 1;
      for (let i = 0; i < total; i++) {
        const dot = document.createElement('button');
        dot.classList.add('testimonial-dot');
        dot.setAttribute('aria-label', `Ir al grupo de testimonios ${i + 1}`);
        if (i === currentIndex) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
      }
    }

    function goToSlide(index) {
      const cpv = getCardsPerView();
      currentIndex = Math.min(index, getMaxIndex());
      // Calculate card width percentage based on cards per view
      const cardWidthPercent = 100 / cpv;
      const gapCompensation = currentIndex * 24; // gap in px
      track.style.transform = `translateX(calc(-${currentIndex * cpv * cardWidthPercent}% - ${gapCompensation}px))`;
      updateDots();
    }

    function updateDots() {
      if (!dotsContainer) return;
      dotsContainer.querySelectorAll('.testimonial-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    }

    function nextSlide() {
      currentIndex = currentIndex < getMaxIndex() ? currentIndex + 1 : 0;
      goToSlide(currentIndex);
    }

    function prevSlide() {
      currentIndex = currentIndex > 0 ? currentIndex - 1 : getMaxIndex();
      goToSlide(currentIndex);
    }

    function startAutoSlide() {
      stopAutoSlide();
      autoSlideInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoSlide() {
      clearInterval(autoSlideInterval);
    }

    prevBtn?.addEventListener('click', () => { prevSlide(); startAutoSlide(); });
    nextBtn?.addEventListener('click', () => { nextSlide(); startAutoSlide(); });

    track.addEventListener('mouseenter', stopAutoSlide);
    track.addEventListener('mouseleave', startAutoSlide);

    // Touch support
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoSlide();
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) nextSlide();
        else prevSlide();
      }
      startAutoSlide();
    }, { passive: true });

    window.addEventListener('resize', () => {
      createDots();
      goToSlide(Math.min(currentIndex, getMaxIndex()));
    });

    createDots();
    startAutoSlide();
  }
});
