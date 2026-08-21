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
   Google Anti-Gravity Physics Engine (https://antigravity.google/)
   ========================================================================== */
(function() {
    const physicsToggleBtn = document.getElementById('physics-toggle-btn');
    let isAntiGravityActive = false;
    let bodies = [];
    let animationFrameId = null;
    let draggedBody = null;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    let lastMouseX = 0, lastMouseY = 0;
    let mouseVx = 0, mouseVy = 0;
    let lastMouseTime = 0;
    let hasDragged = false;

    const gravity = 0.5; // Downward acceleration
    const bounce = 0.65; // Elasticity coefficient
    const friction = 0.98; // Air resistance

    function initAntiGravity() {
        const heroSection = document.getElementById('hero');
        if (!heroSection) return;

        // Elements to break into falling physics bodies
        const targets = heroSection.querySelectorAll('.hero-badge, h1, h2, .hero-lead, .cta-buttons .btn');
        bodies = [];

        const floorY = heroSection.clientHeight - 60;

        targets.forEach((el) => {
            const rect = el.getBoundingClientRect();
            const parentRect = heroSection.getBoundingClientRect();

            // Store initial CSS state
            const initialTransform = el.style.transform;
            const initialPosition = el.style.position;

            const body = {
                el: el,
                x: rect.left - parentRect.left,
                y: rect.top - parentRect.top,
                w: rect.width,
                h: rect.height,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 4,
                rot: 0,
                vRot: (Math.random() - 0.5) * 4,
                isPinned: false,
                origTransform: initialTransform,
                origPosition: initialPosition,
                origLeft: el.style.left,
                origTop: el.style.top
            };

            // Set inline absolute coordinates relative to container
            el.style.position = 'absolute';
            el.style.left = body.x + 'px';
            el.style.top = body.y + 'px';
            el.style.margin = '0';
            el.style.animation = 'none';
            el.style.transition = 'none';
            el.style.zIndex = '50';
            el.style.cursor = 'grab';

            bodies.push(body);

            // Add Mouse Drag & Throw listeners per body
            el.addEventListener('mousedown', (e) => onMouseDown(e, body));
            el.addEventListener('touchstart', (e) => onTouchStart(e, body), { passive: false });
        });

        // Global mouse move and up
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
        window.addEventListener('touchmove', onTouchMove, { passive: false });
        window.addEventListener('touchend', onTouchEnd);

        // Physics step loop
        function physicsStep() {
            if (!isAntiGravityActive) return;

            const container = heroSection;
            const containerWidth = container.clientWidth;
            const containerHeight = container.clientHeight;

            bodies.forEach(b => {
                if (b === draggedBody) return;

                // Apply gravity & velocity
                b.vy += gravity;
                b.vx *= friction;
                b.vy *= friction;
                b.vRot *= 0.97;

                b.x += b.vx;
                b.y += b.vy;
                b.rot += b.vRot;

                // Floor collision
                if (b.y + b.h >= containerHeight - 10) {
                    b.y = containerHeight - 10 - b.h;
                    b.vy *= -bounce;
                    b.vx *= 0.8; // ground friction
                    b.vRot *= 0.8;
                }

                // Ceiling collision
                if (b.y <= 0) {
                    b.y = 0;
                    b.vy *= -bounce;
                }

                // Left wall collision
                if (b.x <= 0) {
                    b.x = 0;
                    b.vx *= -bounce;
                }

                // Right wall collision
                if (b.x + b.w >= containerWidth) {
                    b.x = containerWidth - b.w;
                    b.vx *= -bounce;
                }

                b.el.style.transform = `translate3d(${b.x - parseFloat(b.el.style.left)}px, ${b.y - parseFloat(b.el.style.top)}px, 0px) rotate(${b.rot}deg)`;
            });

            animationFrameId = requestAnimationFrame(physicsStep);
        }

        physicsStep();
    }

    function onMouseDown(e, body) {
        if (e.target.tagName === 'A' && !isAntiGravityActive) return;

        draggedBody = body;
        hasDragged = false;
        const rect = body.el.getBoundingClientRect();
        dragOffsetX = e.clientX - rect.left;
        dragOffsetY = e.clientY - rect.top;

        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        lastMouseTime = performance.now();

        body.el.style.zIndex = '1000';
        body.el.style.cursor = 'grabbing';
    }

    function onMouseMove(e) {
        if (!draggedBody) return;
        hasDragged = true;

        const now = performance.now();
        const dt = Math.max(now - lastMouseTime, 1);

        mouseVx = (e.clientX - lastMouseX) / dt * 16;
        mouseVy = (e.clientY - lastMouseY) / dt * 16;

        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        lastMouseTime = now;

        const heroSection = document.getElementById('hero');
        const parentRect = heroSection.getBoundingClientRect();

        draggedBody.x = e.clientX - parentRect.left - dragOffsetX;
        draggedBody.y = e.clientY - parentRect.top - dragOffsetY;
        draggedBody.rot += mouseVx * 0.3;

        draggedBody.el.style.transform = `translate3d(${draggedBody.x - parseFloat(draggedBody.el.style.left)}px, ${draggedBody.y - parseFloat(draggedBody.el.style.top)}px, 0px) rotate(${draggedBody.rot}deg)`;
    }

    function onMouseUp(e) {
        if (!draggedBody) return;

        // Apply throw impulse
        draggedBody.vx = mouseVx * 1.2;
        draggedBody.vy = mouseVy * 1.2;
        draggedBody.vRot = mouseVx * 0.5;

        draggedBody.el.style.cursor = 'grab';
        draggedBody.el.style.zIndex = '50';
        draggedBody = null;
    }

    function onTouchStart(e, body) {
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            onMouseDown({ clientX: touch.clientX, clientY: touch.clientY, target: e.target }, body);
        }
    }

    function onTouchMove(e) {
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            onMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
        }
    }

    function onTouchEnd() {
        onMouseUp();
    }

    function stopAntiGravity() {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);

        bodies.forEach(b => {
            b.el.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
            b.el.style.transform = b.origTransform || 'none';
            b.el.style.position = b.origPosition || '';
            b.el.style.left = b.origLeft || '';
            b.el.style.top = b.origTop || '';
            b.el.style.margin = '';
            b.el.style.cursor = '';

            setTimeout(() => {
                b.el.style.transition = '';
            }, 800);
        });
        bodies = [];
    }

    // Toggle button handler
    if (physicsToggleBtn) {
        physicsToggleBtn.addEventListener('click', () => {
            isAntiGravityActive = !isAntiGravityActive;
            const btnText = physicsToggleBtn.querySelector('.physics-btn-text');

            if (isAntiGravityActive) {
                physicsToggleBtn.classList.add('active');
                if (btnText) btnText.textContent = 'Restore Layout';
                initAntiGravity();
            } else {
                physicsToggleBtn.classList.remove('active');
                if (btnText) btnText.textContent = 'Anti-Gravity Mode';
                stopAntiGravity();
            }
        });
    }
})();
