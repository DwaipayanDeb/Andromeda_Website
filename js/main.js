/**
 * ANDROMEDA WRITER — MAIN JAVASCRIPT LOGIC
 */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Navigation Toggle
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      mobileToggle.textContent = navLinks.classList.contains('open') ? '✕' : '☰';
    });
  }

  // Copy to Clipboard Buttons
  const copyButtons = document.querySelectorAll('.btn-copy');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const targetId = btn.getAttribute('data-target');
      const textToCopy = targetId 
        ? document.getElementById(targetId)?.textContent?.trim() 
        : btn.previousElementSibling?.textContent?.trim() || btn.getAttribute('data-clipboard');

      if (textToCopy) {
        try {
          await navigator.clipboard.writeText(textToCopy);
          const originalText = btn.innerHTML;
          btn.innerHTML = '✓ Copied!';
          btn.classList.add('copied');
          setTimeout(() => {
            btn.innerHTML = originalText;
            btn.classList.remove('copied');
          }, 2000);
        } catch (err) {
          console.error('Failed to copy text: ', err);
        }
      }
    });
  });

  // Windows Store Redirection Helper
  const winBtn = document.querySelectorAll('.btn-windows-store');
  winBtn.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      // Attempt ms-windows-store URI first, then fallback to web
      const storeUri = "ms-windows-store://pdp/?productid=9NK9D7FWJ31V";
      const webFallback = "https://apps.microsoft.com/detail/9NK9D7FWJ31V";
      
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = storeUri;
      document.body.appendChild(iframe);

      setTimeout(() => {
        document.body.removeChild(iframe);
        window.open(webFallback, "_blank");
      }, 1000);
    });
  });

  // Navbar background change on scroll
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // Auto-scrolling Gallery Showcase (Bing-Style 3s Cyclic Carousel)
  const galleryWindow = document.getElementById('galleryWindow');
  if (galleryWindow) {
    const slides = galleryWindow.querySelectorAll('.gallery-slide');
    const indicatorsContainer = document.getElementById('galleryIndicators');
    const prevBtn = document.getElementById('galleryPrevBtn');
    const nextBtn = document.getElementById('galleryNextBtn');
    const titleEl = document.getElementById('galleryTitle');
    const descEl = document.getElementById('galleryDesc');

    if (slides.length > 0) {
      let currentIndex = 0;
      let timer = null;
      const intervalMs = 3000; // 3 seconds per user specification

      // Build indicators
      if (indicatorsContainer) {
        indicatorsContainer.innerHTML = '';
        slides.forEach((slide, idx) => {
          const dash = document.createElement('button');
          dash.className = 'gallery-dash' + (idx === 0 ? ' active' : '');
          dash.setAttribute('aria-label', `Go to slide ${idx + 1}`);
          dash.setAttribute('role', 'tab');
          dash.setAttribute('aria-selected', idx === 0 ? 'true' : 'false');
          dash.addEventListener('click', (e) => {
            e.stopPropagation();
            goToSlide(idx);
            resetTimer();
          });
          indicatorsContainer.appendChild(dash);
        });
      }

      const dashes = indicatorsContainer ? indicatorsContainer.querySelectorAll('.gallery-dash') : [];

      function updateView(idx) {
        slides.forEach((s, i) => {
          if (i === idx) {
            s.classList.add('active');
            s.setAttribute('aria-hidden', 'false');
          } else {
            s.classList.remove('active');
            s.setAttribute('aria-hidden', 'true');
          }
        });

        dashes.forEach((d, i) => {
          if (i === idx) {
            d.classList.add('active');
            d.setAttribute('aria-selected', 'true');
          } else {
            d.classList.remove('active');
            d.setAttribute('aria-selected', 'false');
          }
        });

        const activeSlide = slides[idx];
        if (activeSlide) {
          if (titleEl) {
            titleEl.textContent = activeSlide.getAttribute('data-title') || '';
          }
          if (descEl) {
            descEl.textContent = activeSlide.getAttribute('data-desc') || '';
          }
        }
      }

      function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        updateView(currentIndex);
      }

      function prevSlide() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateView(currentIndex);
      }

      function goToSlide(idx) {
        currentIndex = idx;
        updateView(currentIndex);
      }

      function startTimer() {
        stopTimer();
        timer = setInterval(nextSlide, intervalMs);
      }

      function stopTimer() {
        if (timer) {
          clearInterval(timer);
          timer = null;
        }
      }

      function resetTimer() {
        stopTimer();
        startTimer();
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          nextSlide();
          resetTimer();
        });
      }

      if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          prevSlide();
          resetTimer();
        });
      }

      // Hover to pause auto-scroll
      galleryWindow.addEventListener('mouseenter', stopTimer);
      galleryWindow.addEventListener('mouseleave', startTimer);

      // Keyboard arrow navigation
      galleryWindow.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
          nextSlide();
          resetTimer();
        } else if (e.key === 'ArrowLeft') {
          prevSlide();
          resetTimer();
        }
      });

      // Touch swipe support for mobile
      let touchStartX = 0;
      galleryWindow.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopTimer();
      }, { passive: true });

      galleryWindow.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        if (touchEndX < touchStartX - 40) {
          nextSlide();
        } else if (touchEndX > touchStartX + 40) {
          prevSlide();
        }
        startTimer();
      }, { passive: true });

      // Start initial cycle
      updateView(0);
      startTimer();
    }
  }
});
