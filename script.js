// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = hamburger.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        }
    });
}

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (navLinks) {
            navLinks.classList.remove('active');
        }
        if (hamburger) {
            const icon = hamburger.querySelector('i');
            if (icon) {
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }
        }
    });
});

// Scroll Animation using Intersection Observer
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.10
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(section => {
    observer.observe(section);
});

// Publication Stat Counter Roll-up Animation
let statsAnimated = false;

function animateStats() {
    if (statsAnimated) return;
    const statCounters = document.querySelectorAll('.stat-count');
    if (!statCounters.length) return;

    statCounters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'), 10);
        if (isNaN(target)) return;

        const duration = 1500; // ms
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out quad
            const easeOutProgress = progress * (2 - progress);
            const currentVal = Math.floor(easeOutProgress * target);

            counter.textContent = currentVal;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        }

        requestAnimationFrame(updateCounter);
    });

    statsAnimated = true;
}

const pubSection = document.getElementById('publications');
if (pubSection) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05, rootMargin: '0px 0px -50px 0px' });

    statsObserver.observe(pubSection);
}

// ScrollSpy Active Link Tracker
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

function highlightNav() {
    let scrollY = window.pageYOffset || document.documentElement.scrollTop;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 120;
        const sectionId = current.getAttribute('id');

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            navAnchors.forEach(a => {
                a.classList.remove('active');
                if (a.getAttribute('href') === '#' + sectionId) {
                    a.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', highlightNav);
window.addEventListener('load', highlightNav);

// Theme toggle logic
(function() {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;

    function setTheme(theme) {
        try {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            const isDark = theme === 'dark';
            toggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
            toggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        } catch (e) {
            // ignore storage errors
        }
    }

    // initialize button state from current document attribute or localStorage
    const current = document.documentElement.getAttribute('data-theme') ||
        (localStorage.getItem('theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));

    // reflect current state on the button
    toggle.setAttribute('aria-pressed', current === 'dark' ? 'true' : 'false');
    toggle.innerHTML = current === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';

    // click handler
    toggle.addEventListener('click', () => {
        const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        setTheme(next);
    });
})();

/* ==========================================================================
   Google Anti-Gravity Hover Physics (3D Magnetic Tilt & Floating Levitation)
   ========================================================================== */
(function() {
    const hoverTargets = document.querySelectorAll(
        '.publication-item, .interest-card, .skill-card, .award-card, .about-card, .contact-card, .btn'
    );

    hoverTargets.forEach(card => {
        card.classList.add('antigravity-hover-card');

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const cardWidth = rect.width;
            const cardHeight = rect.height;

            // Calculate cursor position relative to card center (-1 to 1)
            const centerX = rect.left + cardWidth / 2;
            const centerY = rect.top + cardHeight / 2;
            const mouseX = (e.clientX - centerX) / (cardWidth / 2);
            const mouseY = (e.clientY - centerY) / (cardHeight / 2);

            // Anti-gravity tilt angles and levitation lift
            const tiltX = -mouseY * 12; // rotate around X axis
            const tiltY = mouseX * 12;  // rotate around Y axis
            const liftZ = 16;           // translateZ levitation in pixels

            card.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateZ(${liftZ}px) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale3d(1, 1, 1)';
        });
    });
})();

