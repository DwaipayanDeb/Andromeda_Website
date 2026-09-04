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
      const storeUri = "ms-windows-store://pdp/?productid=Andromeda";
      const webFallback = "https://apps.microsoft.com/detail/Andromeda";
      
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
});
