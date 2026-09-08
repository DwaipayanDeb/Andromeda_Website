/**
 * ANDROMEDA WRITER — LATEX REFERENCE SEARCH, TABS & INTERACTION
 */

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('refMainSearchInput');
  const clearBtn = document.getElementById('clearSearchBtn');
  const resetBtn = document.getElementById('resetSearchBtn');
  const countDisplay = document.getElementById('searchResultCount');
  const noResultsState = document.getElementById('noResultsState');
  const filterChips = document.querySelectorAll('.filter-chip');
  const commandCards = document.querySelectorAll('.command-card');
  const categorySections = document.querySelectorAll('.ref-category-section');
  const showcaseSection = document.getElementById('style-showcase');
  const navLinks = document.querySelectorAll('.ref-sidebar .docs-nav-link');
  const toast = document.getElementById('refToast');
  const toastMsg = document.getElementById('refToastMsg');

  let activeCategoryFilter = 'all';
  const totalCommandsCount = commandCards.length;

  // Toast Trigger Helper
  let toastTimer = null;
  function showToast(message) {
    if (!toast) return;
    if (toastMsg) toastMsg.textContent = message || 'Code copied to clipboard!';
    toast.classList.remove('hidden');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.add('hidden');
    }, 2200);
  }

  // Copy Snippet Handler
  document.addEventListener('click', async (e) => {
    const copyBtn = e.target.closest('.btn-copy-snippet');
    if (!copyBtn) return;

    const codeBox = copyBtn.closest('.code-box');
    if (!codeBox) return;

    const codeElement = codeBox.querySelector('pre code');
    if (!codeElement) return;

    const text = codeElement.textContent || '';
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      // Visual feedback on button
      copyBtn.classList.add('copied');
      const textSpan = copyBtn.querySelector('span');
      const originalText = textSpan ? textSpan.textContent : 'Copy';
      if (textSpan) textSpan.textContent = 'Copied!';
      showToast('LaTeX snippet copied to clipboard!');

      setTimeout(() => {
        copyBtn.classList.remove('copied');
        if (textSpan) textSpan.textContent = originalText;
      }, 1800);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  });

  // Showcase Tabs Switcher
  const showcaseTabs = document.querySelectorAll('.showcase-tab-btn');
  const showcaseTabContents = document.querySelectorAll('.showcase-tab-content');

  showcaseTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-tab');
      showcaseTabs.forEach(t => t.classList.remove('active'));
      showcaseTabContents.forEach(c => c.classList.remove('active'));

      tab.classList.add('active');
      const targetContent = document.getElementById(targetId);
      if (targetContent) targetContent.classList.add('active');
    });
  });

  // Core Search & Filter Function
  function filterReference() {
    const query = (searchInput ? searchInput.value : '').toLowerCase().trim();
    
    if (clearBtn) {
      if (query.length > 0) {
        clearBtn.classList.remove('hidden');
      } else {
        clearBtn.classList.add('hidden');
      }
    }

    let visibleCount = 0;

    // Handle showcase section visibility
    if (showcaseSection) {
      if (activeCategoryFilter === 'showcase' || activeCategoryFilter === 'all' || activeCategoryFilter === 'tables_and_figures' || activeCategoryFilter === 'math_mode') {
        if (query === '' || 'table'.includes(query) || 'figure'.includes(query) || 'equation'.includes(query) || 'showcase'.includes(query) || 'matrix'.includes(query) || 'align'.includes(query) || 'booktabs'.includes(query) || 'subcaption'.includes(query)) {
          showcaseSection.classList.remove('hidden');
        } else {
          showcaseSection.classList.add('hidden');
        }
      } else {
        showcaseSection.classList.add('hidden');
      }
    }

    // Filter command cards
    categorySections.forEach(section => {
      if (section.id === 'style-showcase') return;

      const catId = section.getAttribute('data-category');
      const cards = section.querySelectorAll('.command-card');
      let visibleInThisCategory = 0;

      const matchesCatFilter = (activeCategoryFilter === 'all' || activeCategoryFilter === catId);

      cards.forEach(card => {
        if (!matchesCatFilter) {
          card.classList.add('hidden');
          return;
        }

        const name = (card.getAttribute('data-cmd-name') || '').toLowerCase();
        const desc = (card.getAttribute('data-desc') || '').toLowerCase();
        const cardCat = (card.getAttribute('data-category') || '').toLowerCase();

        const matchesQuery = (query === '' || name.includes(query) || desc.includes(query) || cardCat.includes(query));

        if (matchesQuery) {
          card.classList.remove('hidden');
          visibleInThisCategory++;
          visibleCount++;
        } else {
          card.classList.add('hidden');
        }
      });

      if (visibleInThisCategory > 0 && matchesCatFilter) {
        section.classList.remove('hidden');
      } else {
        section.classList.add('hidden');
      }
    });

    // Update Status Count & Empty State
    if (countDisplay) {
      if (query === '' && activeCategoryFilter === 'all') {
        countDisplay.textContent = `Showing all ${totalCommandsCount} commands`;
      } else if (activeCategoryFilter !== 'all' && query === '') {
        countDisplay.textContent = `Showing ${visibleCount} commands in selected category`;
      } else {
        countDisplay.textContent = `Found ${visibleCount} matching command${visibleCount === 1 ? '' : 's'}`;
      }
    }

    if (noResultsState) {
      if (visibleCount === 0 && (showcaseSection ? showcaseSection.classList.contains('hidden') : true)) {
        noResultsState.classList.remove('hidden');
      } else {
        noResultsState.classList.add('hidden');
      }
    }
  }

  // Search Input Listener
  if (searchInput) {
    searchInput.addEventListener('input', filterReference);
  }

  // Clear Search Button
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
      }
      filterReference();
    });
  }

  // Reset Search Button in No Results State
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      activeCategoryFilter = 'all';
      filterChips.forEach(chip => {
        if (chip.getAttribute('data-filter') === 'all') {
          chip.classList.add('active');
        } else {
          chip.classList.remove('active');
        }
      });
      filterReference();
      if (searchInput) searchInput.focus();
    });
  }

  // Filter Chips Listener
  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeCategoryFilter = chip.getAttribute('data-filter') || 'all';
      filterReference();

      // If clicking a specific category, smooth scroll to it if not "all"
      if (activeCategoryFilter !== 'all') {
        const targetSec = document.getElementById(activeCategoryFilter === 'showcase' ? 'style-showcase' : activeCategoryFilter);
        if (targetSec && !targetSec.classList.contains('hidden')) {
          targetSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // Keyboard shortcut '/' to focus search
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== searchInput && !['input', 'textarea'].includes(document.activeElement.tagName.toLowerCase())) {
      e.preventDefault();
      if (searchInput) {
        searchInput.focus();
        searchInput.select();
      }
    }
    if (e.key === 'Escape' && document.activeElement === searchInput) {
      if (searchInput.value.length > 0) {
        searchInput.value = '';
        filterReference();
      } else {
        searchInput.blur();
      }
    }
  });

  // ScrollSpy for Sidebar Navigation Links
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
    rootMargin: '-15% 0px -70% 0px'
  });

  categorySections.forEach(sec => observer.observe(sec));
});
