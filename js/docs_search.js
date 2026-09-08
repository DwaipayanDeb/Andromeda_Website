/**
 * ANDROMEDA WRITER — GLOBAL LATEX REFERENCE INSTANT SEARCH & DROPDOWN
 */

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('docsSearchInput');
  const dropdown = document.getElementById('searchDropdown');
  const toast = document.getElementById('refToast');
  const toastMsg = document.getElementById('refToastMsg');

  // Highlight anchor card if URL has hash
  function highlightAnchor() {
    if (window.location.hash) {
      const target = document.querySelector(window.location.hash);
      if (target && target.classList.contains('ref-command-item')) {
        target.classList.add('highlighted');
        setTimeout(() => target.classList.remove('highlighted'), 2500);
      }
    }
  }
  highlightAnchor();
  window.addEventListener('hashchange', highlightAnchor);

  // Toast Helper
  let toastTimer = null;
  function showToast(message) {
    if (!toast) return;
    if (toastMsg) toastMsg.textContent = message || 'Code copied to clipboard!';
    toast.classList.remove('hidden');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.add('hidden');
    }, 2000);
  }

  // Copy Snippet Listener
  document.addEventListener('click', async (e) => {
    const copyBtn = e.target.closest('.btn-copy-snippet');
    if (!copyBtn) return;

    const codeBox = copyBtn.closest('.code-box');
    if (!codeBox) return;

    const codeEl = codeBox.querySelector('pre code');
    if (!codeEl) return;

    const text = codeEl.textContent || '';
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

      copyBtn.classList.add('copied');
      const textSpan = copyBtn.querySelector('span');
      const originalText = textSpan ? textSpan.textContent : 'Copy';
      if (textSpan) textSpan.textContent = 'Copied!';
      showToast('LaTeX code copied to clipboard!');

      setTimeout(() => {
        copyBtn.classList.remove('copied');
        if (textSpan) textSpan.textContent = originalText;
      }, 1800);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  });

  // Global Search Engine
  if (searchInput && dropdown && window.LATEX_SEARCH_INDEX) {
    let selectedIndex = -1;

    function renderResults(query) {
      const q = query.toLowerCase().trim();
      if (!q) {
        dropdown.classList.add('hidden');
        dropdown.innerHTML = '';
        selectedIndex = -1;
        return;
      }

      const results = [];
      const index = window.LATEX_SEARCH_INDEX || [];

      for (let i = 0; i < index.length; i++) {
        const item = index[i];
        let score = 0;

        const nameLower = item.name.toLowerCase();
        const descLower = item.desc.toLowerCase();
        const kwLower = (item.keywords || '').toLowerCase();

        if (nameLower === q || nameLower === '\\' + q) score += 100;
        else if (nameLower.startsWith(q) || nameLower.startsWith('\\' + q)) score += 50;
        else if (nameLower.includes(q)) score += 30;

        if (descLower.includes(q)) score += 20;
        if (kwLower.includes(q)) score += 15;

        if (score > 0) {
          results.push({ item, score });
        }
      }

      results.sort((a, b) => b.score - a.score);
      const topResults = results.slice(0, 15);

      if (topResults.length === 0) {
        dropdown.innerHTML = `
          <div style="padding: 14px; text-align: center; color: var(--text-muted); font-size: 0.85rem;">
            No commands found for "<strong>${escapeHtml(query)}</strong>"
          </div>
        `;
        dropdown.classList.remove('hidden');
        selectedIndex = -1;
        return;
      }

      const html = topResults.map(({ item }, idx) => `
        <a href="${item.page}#${item.anchor}" class="search-result-item" data-index="${idx}">
          <div style="display: flex; justify-content: space-between; align-items: baseline;">
            <span class="s-item-cmd">${escapeHtml(item.name)}</span>
            <span class="s-item-cat">${escapeHtml(item.category)}</span>
          </div>
          <div class="s-item-desc">${escapeHtml(item.desc)}</div>
        </a>
      `).join('');

      dropdown.innerHTML = html;
      dropdown.classList.remove('hidden');
      selectedIndex = -1;
    }

    function escapeHtml(str) {
      return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }

    searchInput.addEventListener('input', (e) => {
      renderResults(e.target.value);
    });

    searchInput.addEventListener('keydown', (e) => {
      const items = dropdown.querySelectorAll('.search-result-item');
      if (dropdown.classList.contains('hidden') || items.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIndex = (selectedIndex + 1) % items.length;
        updateSelection(items);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIndex = (selectedIndex - 1 + items.length) % items.length;
        updateSelection(items);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedIndex >= 0 && items[selectedIndex]) {
          items[selectedIndex].click();
        } else if (items[0]) {
          items[0].click();
        }
      } else if (e.key === 'Escape') {
        dropdown.classList.add('hidden');
      }
    });

    function updateSelection(items) {
      items.forEach((item, idx) => {
        if (idx === selectedIndex) {
          item.classList.add('selected');
          item.scrollIntoView({ block: 'nearest' });
        } else {
          item.classList.remove('selected');
        }
      });
    }

    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.add('hidden');
      }
    });

    // Keyboard shortcut '/' to focus search
    document.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement !== searchInput && !['input', 'textarea'].includes((document.activeElement && document.activeElement.tagName || '').toLowerCase())) {
        e.preventDefault();
        searchInput.focus();
        searchInput.select();
      }
    });
  }
});
