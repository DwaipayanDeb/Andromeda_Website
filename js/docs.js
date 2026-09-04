/**
 * ANDROMEDA WRITER — DOCUMENTATION SEARCH & SCROLL-SPY
 */

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('docsSearchInput');
  const navLinks = document.querySelectorAll('.docs-nav-link');
  const sections = document.querySelectorAll('.doc-section');

  // Search Filter
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      
      navLinks.forEach(link => {
        const text = link.textContent.toLowerCase();
        const listItem = link.parentElement;
        if (text.includes(query) || query === '') {
          listItem.style.display = 'block';
        } else {
          listItem.style.display = 'none';
        }
      });
    });
  }

  // ScrollSpy for Active Section
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, {
    rootMargin: '-20% 0px -70% 0px'
  });

  sections.forEach(section => observer.observe(section));
});
