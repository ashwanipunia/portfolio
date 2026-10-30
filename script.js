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
   Google Antigravity Ambient & Dynamic Background Blobs Logic
   ========================================================================== */
(function() {
    const blobs = [
        { element: document.querySelector('.blob-blue'), speedX: 0.0007, speedY: 0.0009, ampX: 120, ampY: 100, phase: 0 },
        { element: document.querySelector('.blob-red'), speedX: 0.0008, speedY: 0.0006, ampX: 100, ampY: 120, phase: 1.5 },
        { element: document.querySelector('.blob-yellow'), speedX: 0.0006, speedY: 0.0010, ampX: 140, ampY: 90, phase: 3.0 },
        { element: document.querySelector('.blob-green'), speedX: 0.0009, speedY: 0.0007, ampX: 110, ampY: 130, phase: 4.5 }
    ];

    if (!blobs[0].element) return;

    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    window.addEventListener('mousemove', (e) => {
        // Normalize mouse coordinates from center (-1 to 1)
        targetMouseX = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
        targetMouseY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
    });

    function animateBlobs(time) {
        // Smoothly interpolate mouse reaction
        mouseX += (targetMouseX - mouseX) * 0.05;
        mouseY += (targetMouseY - mouseY) * 0.05;

        blobs.forEach((blob, idx) => {
            if (!blob.element) return;

            // Ambient organic drifting using sine and cosine waves
            const driftX = Math.sin(time * blob.speedX + blob.phase) * blob.ampX;
            const driftY = Math.cos(time * blob.speedY + blob.phase) * blob.ampY;

            // Soft interactive magnetic repulsion / dynamic shift based on mouse
            const mouseShiftFactor = (idx + 1) * 35;
            const interactiveX = mouseX * mouseShiftFactor;
            const interactiveY = mouseY * mouseShiftFactor;

            // Gentle scaling/morphing
            const scale = 1 + Math.sin(time * 0.0008 + blob.phase) * 0.08;

            blob.element.style.transform = `translate3d(${driftX + interactiveX}px, ${driftY + interactiveY}px, 0) scale(${scale})`;
        });

        requestAnimationFrame(animateBlobs);
    }

    requestAnimationFrame(animateBlobs);
})();

/* ==========================================================================
   Google Anti-Gravity Hover Physics (3D Magnetic Tilt & Floating Levitation)
   ========================================================================== */
(function() {
    const hoverTargets = document.querySelectorAll('.btn');

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

/* ==========================================================================
   About Me Section - Interactive Particle Constellation Background (METLIN style)
   ========================================================================== */
(function() {
    const section = document.getElementById('about');
    const canvas = document.getElementById('about-particle-canvas');
    if (!section || !canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId = null;
    let isSectionVisible = false;
    let particlesArray = [];

    const mouse = {
        x: null,
        y: null,
        radius: 120
    };

    function resizeCanvas() {
        const rect = section.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        mouse.radius = Math.min(canvas.width, canvas.height) / 5;
        createParticles();
    }

    window.addEventListener('resize', resizeCanvas);

    window.addEventListener('mousemove', (e) => {
        const rect = section.getBoundingClientRect();
        if (e.clientX >= rect.left && e.clientX <= rect.right &&
            e.clientY >= rect.top && e.clientY <= rect.bottom) {
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        } else {
            mouse.x = null;
            mouse.y = null;
        }
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    function getThemeColors() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark' ||
            (!document.documentElement.getAttribute('data-theme') && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);

        if (isDark) {
            return {
                particleColor: 'rgba(223, 177, 66, 0.85)', // Amber/Gold
                lineColorRgb: '75, 211, 190'                // Teal / Cyan
            };
        } else {
            return {
                particleColor: 'rgba(15, 43, 70, 0.75)',   // Academic Navy
                lineColorRgb: '158, 122, 40'               // Muted Gold
            };
        }
    }

    class Particle {
        constructor(x, y, velX, velY, size) {
            this.x = x;
            this.y = y;
            this.velX = velX;
            this.velY = velY;
            this.size = size;
        }

        draw(particleColor) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = particleColor;
            ctx.fill();
        }

        update(colors) {
            if (this.x > canvas.width || this.x < 0) {
                this.velX = -this.velX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.velY = -this.velY;
            }

            if (mouse.x !== null && mouse.y !== null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius + this.size) {
                    const buffer = this.size * 5;
                    if (mouse.x < this.x && this.x < canvas.width - buffer) {
                        this.x += 3;
                    }
                    if (mouse.x > this.x && this.x > buffer) {
                        this.x -= 3;
                    }
                    if (mouse.y < this.y && this.y < canvas.height - buffer) {
                        this.y += 3;
                    }
                    if (mouse.y > this.y && this.y > buffer) {
                        this.y -= 3;
                    }
                }
            }

            this.x += this.velX;
            this.y += this.velY;
            this.draw(colors.particleColor);
        }
    }

    function createParticles() {
        particlesArray = [];
        const noOfParticles = Math.floor((canvas.width * canvas.height) / 7000);

        for (let i = 0; i < noOfParticles; i++) {
            let size = (Math.random() * 3) + 1.5;
            let x = Math.random() * (canvas.width - size * 4) + size * 2;
            let y = Math.random() * (canvas.height - size * 4) + size * 2;
            let velX = (Math.random() * 1.6) - 0.8;
            let velY = (Math.random() * 1.6) - 0.8;

            particlesArray.push(new Particle(x, y, velX, velY, size));
        }
    }

    function connect(colors) {
        const vicinityDistSq = (canvas.width * canvas.height) / 70;
        const maxDist = Math.sqrt(vicinityDistSq);

        for (let i = 0; i < particlesArray.length; i++) {
            for (let j = i + 1; j < particlesArray.length; j++) {
                let dx = particlesArray[i].x - particlesArray[j].x;
                let dy = particlesArray[i].y - particlesArray[j].y;
                let distSq = dx * dx + dy * dy;

                if (distSq < vicinityDistSq) {
                    let dist = Math.sqrt(distSq);
                    let opacity = (1 - dist / maxDist) * 0.45;
                    ctx.strokeStyle = `rgba(${colors.lineColorRgb}, ${opacity.toFixed(3)})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                    ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        if (!isSectionVisible) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const colors = getThemeColors();

        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update(colors);
        }
        connect(colors);

        animationFrameId = requestAnimationFrame(animate);
    }

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!isSectionVisible) {
                    isSectionVisible = true;
                    resizeCanvas();
                    animate();
                }
            } else {
                isSectionVisible = false;
                if (animationFrameId) {
                    cancelAnimationFrame(animationFrameId);
                    animationFrameId = null;
                }
            }
        });
    }, { threshold: 0.05 });

    sectionObserver.observe(section);
})();
