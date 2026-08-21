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
   Google Anti-Gravity & Interactive Drag/Toss Physics Engine
   ========================================================================== */
(function() {
    const heroFloatingCards = document.querySelectorAll('.floating-card');
    const pubCards = document.querySelectorAll('.publication-item');
    const physicsToggleBtn = document.getElementById('physics-toggle-btn');

    let isPhysicsActive = false;
    let physicsElements = [];
    let animationFrameId = null;

    // Helper to make an element draggable with throw inertia
    function enableDragAndToss(el, isZeroGMode = false) {
        let isDragging = false;
        let startX = 0, startY = 0;
        let currentX = 0, currentY = 0;
        let vx = 0, vy = 0;
        let lastMouseX = 0, lastMouseY = 0;
        let lastTime = 0;

        el.addEventListener('mousedown', (e) => {
            // Don't drag if clicking directly on interactive links
            if (e.target.tagName === 'A' || e.target.closest('a')) return;

            isDragging = true;
            el.style.animation = 'none'; // pause CSS floating keyframes during drag
            startX = e.clientX - currentX;
            startY = e.clientY - currentY;
            lastMouseX = e.clientX;
            lastMouseY = e.clientY;
            lastTime = performance.now();
            el.style.zIndex = '999';
            el.style.cursor = 'grabbing';
            e.preventDefault();
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const now = performance.now();
            const dt = Math.max(now - lastTime, 1);

            currentX = e.clientX - startX;
            currentY = e.clientY - startY;

            vx = (e.clientX - lastMouseX) / dt * 16;
            vy = (e.clientY - lastMouseY) / dt * 16;

            lastMouseX = e.clientX;
            lastMouseY = e.clientY;
            lastTime = now;

            el.style.transform = `translate3d(${currentX}px, ${currentY}px, 0px) rotate(${vx * 0.5}deg)`;
        });

        window.addEventListener('mouseup', () => {
            if (!isDragging) return;
            isDragging = false;
            el.style.cursor = 'grab';

            // Throw inertia loop
            if (Math.abs(vx) > 0.5 || Math.abs(vy) > 0.5) {
                let inertiaX = currentX;
                let inertiaY = currentY;
                let rot = vx * 0.5;

                function stepInertia() {
                    if (isDragging) return;
                    vx *= 0.92; // friction
                    vy *= 0.92;
                    rot *= 0.92;

                    inertiaX += vx;
                    inertiaY += vy;
                    currentX = inertiaX;
                    currentY = inertiaY;

                    el.style.transform = `translate3d(${inertiaX}px, ${inertiaY}px, 0px) rotate(${rot}deg)`;

                    if (Math.abs(vx) > 0.1 || Math.abs(vy) > 0.1) {
                        requestAnimationFrame(stepInertia);
                    }
                }
                requestAnimationFrame(stepInertia);
            }
        });
    }

    // Attach basic drag and throw to hero floating cards
    heroFloatingCards.forEach(card => enableDragAndToss(card));

    // Zero-G Physics Mode Toggle Functionality
    if (physicsToggleBtn) {
        physicsToggleBtn.addEventListener('click', () => {
            isPhysicsActive = !isPhysicsActive;

            const btnText = physicsToggleBtn.querySelector('.physics-btn-text');
            if (isPhysicsActive) {
                physicsToggleBtn.classList.add('active');
                if (btnText) btnText.textContent = 'Restore Gravity';
                activateZeroG();
            } else {
                physicsToggleBtn.classList.remove('active');
                if (btnText) btnText.textContent = 'Zero-G Mode';
                deactivateZeroG();
            }
        });
    }

    function activateZeroG() {
        const targetSection = document.getElementById('hero');
        if (!targetSection) return;

        // Gather physics targets
        const itemsToAnimate = targetSection.querySelectorAll('.hero-badge, h1, h2, .hero-lead, .floating-card');
        physicsElements = [];

        itemsToAnimate.forEach((el) => {
            const rect = el.getBoundingClientRect();
            const pObj = {
                el: el,
                x: 0,
                y: 0,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8 - 4, // initial upward lift
                rot: 0,
                vRot: (Math.random() - 0.5) * 3,
                origTransform: el.style.transform || ''
            };
            el.style.animation = 'none';
            el.style.transition = 'none';
            physicsElements.push(pObj);
        });

        function physicsLoop() {
            if (!isPhysicsActive) return;

            const boundsWidth = window.innerWidth;
            const boundsHeight = window.innerHeight;

            physicsElements.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.rot += p.vRot;

                // Wall bounces
                if (p.x > 250 || p.x < -250) p.vx *= -0.8;
                if (p.y > 200 || p.y < -200) p.vy *= -0.8;

                p.el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0px) rotate(${p.rot}deg)`;
            });

            animationFrameId = requestAnimationFrame(physicsLoop);
        }

        physicsLoop();
    }

    function deactivateZeroG() {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);

        physicsElements.forEach(p => {
            p.el.style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
            p.el.style.transform = p.origTransform || 'none';
            setTimeout(() => {
                p.el.style.transition = '';
            }, 800);
        });
        physicsElements = [];
    }
})();
