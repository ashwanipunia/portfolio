/**
 * Academic Portfolio Web Application
 * Dr. Ashwani Punia, PhD | Biochemist & Mass Spectrometry Specialist
 * 
 * Features:
 *  1. 4-Theme Visual Switcher (Editorial, Swiss, Technical, Cosmic) — synced across all pages
 *  2. Interactive Hero Canvas (Mode 3 Coordinate Grid & Mode 4 Nebula/Starfield on Home page)
 *  3. Mobile Navigation Drawer & Multi-Page Active State Support
 *  4. Publications Interactive Explorer (Search, Type Filters, Year Select, Accordions on Publications page)
 *  5. Citation / BibTeX Copy & Email Copy with Toast Notifications
 */

document.addEventListener('DOMContentLoaded', () => {
  /* =========================================================================
     1. THEME SWITCHER (SYNCED VIA LOCALSTORAGE) & DARK/LIGHT TOGGLE
     ========================================================================= */
  const themeButtons = document.querySelectorAll('.theme-btn');
  const themeToggleBtn = document.getElementById('theme-toggle');
  const root = document.documentElement;

  function updateThemeToggleIcon(themeName) {
    if (!themeToggleBtn) return;
    const isDark = themeName === 'cosmic';
    themeToggleBtn.innerHTML = isDark 
      ? '<i class="fa-solid fa-sun" aria-hidden="true"></i>' 
      : '<i class="fa-solid fa-moon" aria-hidden="true"></i>';
    themeToggleBtn.setAttribute('title', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    themeToggleBtn.setAttribute('aria-label', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
  }

  function applyTheme(themeName) {
    if (!['editorial', 'swiss', 'technical', 'cosmic'].includes(themeName)) {
      themeName = 'editorial';
    }

    root.setAttribute('data-theme', themeName);
    try {
      localStorage.setItem('theme', themeName);
    } catch (e) {
      console.warn('LocalStorage unavailable:', e);
    }

    // Update active button state in 4-theme switcher
    themeButtons.forEach(btn => {
      const isTarget = btn.getAttribute('data-theme') === themeName;
      btn.classList.toggle('active', isTarget);
      btn.setAttribute('aria-pressed', isTarget ? 'true' : 'false');
    });

    // Update Dark / Light toggle button icon
    updateThemeToggleIcon(themeName);

    // Notify canvas renderer of theme switch if present
    if (window.HeroCanvas) {
      window.HeroCanvas.setTheme(themeName);
    }
  }

  // Bind theme button events
  themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.getAttribute('data-theme');
      applyTheme(theme);
    });
  });

  // Dedicated Dark / Light Mode Toggle Button
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') || 'editorial';
      const nextTheme = current === 'cosmic' ? 'editorial' : 'cosmic';
      applyTheme(nextTheme);
      showToast(nextTheme === 'cosmic' ? 'Dark mode enabled' : 'Light mode enabled', nextTheme === 'cosmic' ? 'fa-moon' : 'fa-sun');
    });
  }

  // Initialize with stored or default theme
  const initialTheme = root.getAttribute('data-theme') || localStorage.getItem('theme') || 'editorial';
  applyTheme(initialTheme);

  /* =========================================================================
     2. MOBILE NAVIGATION DRAWER
     ========================================================================= */
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.getElementById('primary-navigation');
  const navItems = document.querySelectorAll('.nav-links .nav-link');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      hamburger.innerHTML = isOpen 
        ? '<i class="fa-solid fa-xmark" aria-hidden="true"></i>' 
        : '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
    });

    // Close mobile nav on link click
    navItems.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.innerHTML = '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
      });
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('active') && 
          !navLinks.contains(e.target) && 
          !hamburger.contains(e.target)) {
        navLinks.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.innerHTML = '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
      }
    });
  }

  // Smooth Back to Top
  const backToTopBtn = document.querySelector('.back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* =========================================================================
     3. TOAST NOTIFICATION ENGINE
     ========================================================================= */
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'toast-container';
    toastContainer.setAttribute('aria-live', 'polite');
    document.body.appendChild(toastContainer);
  }

  function showToast(message, icon = 'fa-check') {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    toast.innerHTML = `<i class="fa-solid ${icon}" aria-hidden="true"></i><span>${message}</span>`;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'toastFadeOut 0.3s ease forwards';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 2700);
  }

  /* =========================================================================
     4. PRIMARY PROFILE CONTROLLER (LEFT DOCKED PERSONA LENS)
     ========================================================================= */
  const profileController = document.getElementById('profile-controller');
  const profileToggleBtn = document.getElementById('profile-controller-toggle');
  const profileCloseBtn = document.getElementById('profile-controller-close');
  const profileRadioInputs = document.querySelectorAll('input[name="profile_lens"]');
  const profileOptCards = document.querySelectorAll('.profile-opt-card');
  const activeLensText = document.getElementById('active-lens-text');

  const profileLabels = {
    all: 'Comprehensive Profile',
    metabolomics: 'Plant Metabolomics Specialist',
    proteomics: 'Proteomics & Systems Biology',
    discovery: 'Bioactive Peptides & Drug Discovery'
  };

  function setProfileLens(lens, notify = false) {
    if (!profileLabels[lens]) lens = 'all';
    root.setAttribute('data-profile-active', lens);
    try {
      localStorage.setItem('active_profile_lens', lens);
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }

    // Update radio buttons & card active states
    profileRadioInputs.forEach(input => {
      input.checked = input.value === lens;
    });
    profileOptCards.forEach(card => {
      const isTarget = card.getAttribute('data-profile') === lens;
      card.classList.toggle('active', isTarget);
    });

    if (activeLensText) {
      activeLensText.textContent = `Showing: ${profileLabels[lens]}`;
    }

    if (notify) {
      showToast(`Profile focused: ${profileLabels[lens]}`, 'fa-user-gear');
    }
  }

  if (profileController && profileToggleBtn) {
    profileToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = profileController.classList.toggle('open');
      profileToggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    if (profileCloseBtn) {
      profileCloseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        profileController.classList.remove('open');
        profileToggleBtn.setAttribute('aria-expanded', 'false');
      });
    }

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (profileController.classList.contains('open') && !profileController.contains(e.target)) {
        profileController.classList.remove('open');
        profileToggleBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && profileController.classList.contains('open')) {
        profileController.classList.remove('open');
        profileToggleBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // Handle radio changes
    profileRadioInputs.forEach(radio => {
      radio.addEventListener('change', () => {
        if (radio.checked) {
          setProfileLens(radio.value, true);
        }
      });
    });

    // Also handle direct click on options
    profileOptCards.forEach(card => {
      card.addEventListener('click', () => {
        const val = card.getAttribute('data-profile');
        if (val) {
          setProfileLens(val, true);
        }
      });
    });

    // Initialize from storage or default
    const storedLens = localStorage.getItem('active_profile_lens') || 'all';
    setProfileLens(storedLens, false);
  }

  /* =========================================================================
     5. CLIPBOARD ACTIONS (EMAIL & CITATION)
     ========================================================================= */
  // Email Copy Buttons
  const emailButtons = document.querySelectorAll('.copy-email-btn');
  emailButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const email = btn.getAttribute('data-email');
      if (email && navigator.clipboard) {
        navigator.clipboard.writeText(email).then(() => {
          showToast(`Copied ${email} to clipboard!`, 'fa-envelope');
        }).catch(() => {
          fallbackCopy(email);
          showToast(`Copied ${email} to clipboard!`, 'fa-envelope');
        });
      }
    });
  });

  // Citation Copy Buttons
  const citeButtons = document.querySelectorAll('.copy-cite-btn');
  citeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const citation = btn.getAttribute('data-citation');
      if (citation && navigator.clipboard) {
        navigator.clipboard.writeText(citation).then(() => {
          showToast('Citation copied in APA format!', 'fa-quote-left');
        }).catch(() => {
          fallbackCopy(citation);
          showToast('Citation copied in APA format!', 'fa-quote-left');
        });
      }
    });
  });

  function fallbackCopy(text) {
    const tempInput = document.createElement('textarea');
    tempInput.value = text;
    tempInput.style.position = 'fixed';
    tempInput.style.left = '-9999px';
    document.body.appendChild(tempInput);
    tempInput.focus();
    tempInput.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      console.warn('Fallback copy failed', err);
    }
    document.body.removeChild(tempInput);
  }

  /* =========================================================================
     5. PUBLICATIONS EXPLORER (SEARCH, FILTERS, ACCORDIONS)
     ========================================================================= */
  const pubSearchInput = document.getElementById('pub-search');
  const pubFilterBtns = document.querySelectorAll('.pub-filter-btn');
  const pubYearSelect = document.getElementById('pub-year-select') || document.getElementById('pub-year-filter');
  const pubResetBtn = document.getElementById('pub-clear-btn') || document.getElementById('pub-reset-btn');
  const pubCards = document.querySelectorAll('.pub-card');
  const pubCountDisplay = document.getElementById('pub-count-display') || document.getElementById('pub-count');
  const pubContainer = document.getElementById('publications-container');

  if (pubCards.length > 0 && pubSearchInput) {
    // Create empty state element if not exists
    let emptyState = document.getElementById('pub-empty-state');
    if (!emptyState && pubContainer) {
      emptyState = document.createElement('div');
      emptyState.id = 'pub-empty-state';
      emptyState.className = 'pub-empty-state';
      emptyState.hidden = true;
      emptyState.innerHTML = `
        <div class="pub-empty-icon"><i class="fa-solid fa-book-open"></i></div>
        <div class="pub-empty-title">No matching publications found</div>
        <p style="color: var(--color-text-muted); max-width: 480px; margin: 0 auto 1.25rem;">
          No published records matched your current query or filter combination.
        </p>
        <button type="button" class="btn btn-secondary btn-sm" id="pub-empty-reset">
          <i class="fa-solid fa-rotate-left" aria-hidden="true"></i> Reset Filters
        </button>
      `;
      pubContainer.parentNode.insertBefore(emptyState, pubContainer.nextSibling);
      document.getElementById('pub-empty-reset')?.addEventListener('click', resetFilters);
    }

    let activeTypeFilter = 'all';
    let activeYearFilter = 'all';
    let activeThemeFilter = 'all';
    let searchQuery = '';

    const themePills = document.querySelectorAll('.pub-theme-pill');

    function filterPublications() {
      let visibleCount = 0;

      pubCards.forEach(card => {
        const cardType = card.getAttribute('data-pub-type') || '';
        const cardYear = card.getAttribute('data-pub-year') || '';
        const cardProfile = card.getAttribute('data-profile') || '';
        const cardText = card.textContent.toLowerCase();

        const matchesType = activeTypeFilter === 'all' || cardType === activeTypeFilter;
        const matchesYear = activeYearFilter === 'all' || cardYear === activeYearFilter;
        const matchesTheme = activeThemeFilter === 'all' || 
                             cardProfile === activeThemeFilter || 
                             cardText.includes(activeThemeFilter.toLowerCase());
        const matchesSearch = !searchQuery || cardText.includes(searchQuery);

        if (matchesType && matchesYear && matchesTheme && matchesSearch) {
          card.removeAttribute('hidden');
          card.style.display = '';
          visibleCount++;
        } else {
          card.setAttribute('hidden', '');
          card.style.display = 'none';
        }
      });

      // Update Counter
      if (pubCountDisplay) {
        pubCountDisplay.textContent = visibleCount;
      }

      // Toggle Empty State
      if (emptyState) {
        emptyState.hidden = visibleCount > 0;
        emptyState.style.display = visibleCount > 0 ? 'none' : 'block';
      }
    }

    function resetFilters() {
      activeTypeFilter = 'all';
      activeYearFilter = 'all';
      activeThemeFilter = 'all';
      searchQuery = '';

      if (pubSearchInput) pubSearchInput.value = '';
      if (pubYearSelect) pubYearSelect.value = 'all';

      pubFilterBtns.forEach(btn => {
        const isAll = btn.getAttribute('data-filter') === 'all';
        btn.classList.toggle('active', isAll);
        btn.setAttribute('aria-selected', isAll ? 'true' : 'false');
      });

      themePills.forEach(pill => {
        const isAll = pill.getAttribute('data-theme-filter') === 'all';
        pill.classList.toggle('active', isAll);
      });

      filterPublications();
    }

    // Keyword Theme Filter Pills
    themePills.forEach(pill => {
      pill.addEventListener('click', () => {
        themePills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        activeThemeFilter = pill.getAttribute('data-theme-filter') || 'all';
        filterPublications();
        if (activeThemeFilter !== 'all') {
          showToast(`Filtered by topic: ${pill.textContent.trim()}`, 'fa-filter');
        }
      });
    });

    // Download Complete Bibliography (.bib)
    const downloadBibtexBtn = document.getElementById('download-all-bibtex');
    if (downloadBibtexBtn) {
      downloadBibtexBtn.addEventListener('click', (e) => {
        e.preventDefault();
        let allBibtex = `% Academic Bibliography of Dr. Ashwani Punia, PhD\n% Generated from https://ashwanipunia.github.io/portfolio/\n\n`;
        const citeButtons = document.querySelectorAll('.copy-cite-btn');
        citeButtons.forEach((btn) => {
          const bib = btn.getAttribute('data-bibtex');
          if (bib) {
            allBibtex += bib + '\n\n';
          }
        });

        const blob = new Blob([allBibtex], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'Ashwani_Punia_Publications.bib';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        showToast('Downloaded Ashwani_Punia_Publications.bib', 'fa-file-arrow-down');
      });
    }

    // Search Input Event (Debounced)
    let debounceTimer;
    pubSearchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        searchQuery = e.target.value.trim().toLowerCase();
        filterPublications();
      }, 150);
    });

    // Type Filter Buttons
    pubFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        pubFilterBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        activeTypeFilter = btn.getAttribute('data-filter') || 'all';
        filterPublications();
      });
    });

    // Year Select
    if (pubYearSelect) {
      pubYearSelect.addEventListener('change', (e) => {
        activeYearFilter = e.target.value;
        filterPublications();
      });
    }

    // Reset Button
    if (pubResetBtn) {
      pubResetBtn.addEventListener('click', resetFilters);
    }
  }

  // Publication Abstract Accordions
  const accordionToggles = document.querySelectorAll('.pub-accordion-toggle');
  accordionToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const contentId = toggle.getAttribute('aria-controls');
      const content = document.getElementById(contentId);
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';

      if (content) {
        if (isExpanded) {
          toggle.setAttribute('aria-expanded', 'false');
          content.hidden = true;
          content.style.display = 'none';
          toggle.innerHTML = '<i class="fa-solid fa-angle-down" aria-hidden="true"></i><span>View Abstract</span>';
        } else {
          toggle.setAttribute('aria-expanded', 'true');
          content.hidden = false;
          content.style.display = 'block';
          toggle.innerHTML = '<i class="fa-solid fa-angle-up" aria-hidden="true"></i><span>Hide Abstract</span>';
        }
      }
    });
  });

  /* =========================================================================
     6. HERO CANVAS INTERACTIVE ENGINE (Mode 3 & 4 on Home page)
     ========================================================================= */
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let animationFrameId = null;
    let currentTheme = root.getAttribute('data-theme') || 'editorial';
    let mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000 };

    const STAR_COUNT = 65;
    const stars = [];

    function initStars() {
      stars.length = 0;
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.8 + 0.5,
          alpha: Math.random() * 0.7 + 0.3,
          speed: Math.random() * 0.02 + 0.005,
          driftX: (Math.random() - 0.5) * 0.25,
          driftY: (Math.random() - 0.5) * 0.25,
          color: Math.random() > 0.4 ? '#A78BFA' : '#F472B6'
        });
      }
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      width = canvas.width = rect.width;
      height = canvas.height = rect.height;
      if (currentTheme === 'cosmic') {
        initStars();
      }
    }

    window.addEventListener('resize', resize, { passive: true });
    resize();

    window.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
    }, { passive: true });

    function render() {
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      ctx.clearRect(0, 0, width, height);

      if (currentTheme === 'technical') {
        renderTechnicalGrid();
      } else if (currentTheme === 'cosmic') {
        renderCosmicNebula();
      }

      animationFrameId = requestAnimationFrame(render);
    }

    function renderTechnicalGrid() {
      const gridSize = 40;
      ctx.lineWidth = 0.5;

      ctx.strokeStyle = 'rgba(15, 76, 117, 0.07)';
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      if (mouse.x > 0 && mouse.x < width && mouse.y > 0 && mouse.y < height) {
        ctx.strokeStyle = 'rgba(15, 76, 117, 0.22)';
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.moveTo(mouse.x, 0);
        ctx.lineTo(mouse.x, height);
        ctx.moveTo(0, mouse.y);
        ctx.lineTo(width, mouse.y);
        ctx.stroke();

        ctx.font = '10px monospace';
        ctx.fillStyle = 'rgba(15, 76, 117, 0.45)';
        const coordText = `[X: ${Math.round(mouse.x)} | Y: ${Math.round(mouse.y)} | m/z precision]`;
        ctx.fillText(coordText, mouse.x + 8, mouse.y - 8);

        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 24, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(2, 132, 199, 0.3)';
        ctx.stroke();
      }
    }

    function renderCosmicNebula() {
      if (mouse.x > 0 && mouse.x < width && mouse.y > 0 && mouse.y < height) {
        const glow = ctx.createRadialGradient(mouse.x, mouse.y, 0.1, mouse.x, mouse.y, 0.1);
        glow.addColorStop(0, 'rgba(167, 139, 250, 0.12)');
        glow.addColorStop(1, 'rgba(19, 9, 36, 0)');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, width, height);
      }

      stars.forEach(star => {
        star.x += star.driftX;
        star.y += star.driftY;

        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;
        if (star.y < 0) star.y = height;
        if (star.y > height) star.y = 0;

        star.alpha += (Math.random() - 0.5) * star.speed;
        if (star.alpha > 0.85) star.alpha = 0.85;
        if (star.alpha < 0.2) star.alpha = 0.2;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = star.alpha;
        ctx.fill();
      });

      ctx.globalAlpha = 1.0;
    }

    window.HeroCanvas = {
      setTheme: (theme) => {
        currentTheme = theme;
        if (theme === 'cosmic') {
          initStars();
        }
        ctx.clearRect(0, 0, width, height);
      }
    };

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
      render();
    }
  }
});
