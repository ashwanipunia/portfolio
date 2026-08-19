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

// ==========================================================================
// Advanced Motion Engineering & Interactive Section-Specific Animations
// ==========================================================================

// 1. Hero SVG Vector Path Reveal & Ambient Motion Loop
(function initHeroMotion() {
    const heroPaths = document.querySelectorAll('.hero-path');
    heroPaths.forEach((path) => {
        const length = path.getTotalLength ? path.getTotalLength() : 1000;
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length;
    });

    if (window.gsap) {
        gsap.to('.hero-path', {
            strokeDashoffset: 0,
            duration: 2.2,
            ease: 'power2.out',
            stagger: 0.3
        });

        gsap.to('.hero-ambient-node', {
            y: -12,
            x: 8,
            duration: 3.5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            stagger: 0.5
        });
    }
})();

// 2. Research GSAP ScrollTrigger Scrollytelling Timeline
(function initResearchScrollytelling() {
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    const cards = document.querySelectorAll('#research .interest-card');
    cards.forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            y: 45,
            opacity: 0,
            duration: 0.8,
            delay: index * 0.15,
            ease: 'power3.out'
        });
    });
})();

// 3. Skills 3D Three.js Spatial Visualizer
(function initSkills3DVisualizer() {
    const container = document.getElementById('skills-3d-visualizer');
    if (!container || !window.THREE) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 18;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const skillsList = ['Mass Spec', 'Metabolomics', 'Proteomics', 'UHPLC-QTOF', 'MALDI-TOF', 'FPLC', 'Bioinformatics', 'Molecular Docking'];
    const nodes = [];

    const isDark = () => document.documentElement.getAttribute('data-theme') === 'dark';

    skillsList.forEach((skill, i) => {
        const phi = Math.acos(-1 + (2 * i) / skillsList.length);
        const theta = Math.sqrt(skillsList.length * Math.PI) * phi;
        const radius = 7.5;

        const x = radius * Math.cos(theta) * Math.sin(phi);
        const y = radius * Math.sin(theta) * Math.sin(phi);
        const z = radius * Math.cos(phi);

        const geometry = new THREE.SphereGeometry(0.65, 16, 16);
        const material = new THREE.MeshBasicMaterial({
            color: i % 2 === 0 ? 0x7ab3e8 : 0x4bd3be,
            wireframe: true
        });

        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(x, y, z);
        group.add(sphere);
        nodes.push(sphere);
    });

    let mouseX = 0, mouseY = 0;
    let targetRotationX = 0, targetRotationY = 0;

    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        mouseX = (e.clientX - rect.left - rect.width / 2) * 0.001;
        mouseY = (e.clientY - rect.top - rect.height / 2) * 0.001;
    });

    function animate() {
        requestAnimationFrame(animate);
        targetRotationY += 0.004 + mouseX * 0.05;
        targetRotationX += mouseY * 0.05;

        group.rotation.y = targetRotationY;
        group.rotation.x = targetRotationX;

        nodes.forEach((node, idx) => {
            node.position.y += Math.sin(Date.now() * 0.002 + idx) * 0.005;
        });

        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
        if (!container) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
})();

// 4. Experience Multi-User Cursor Collaboration Animation
(function initCollaborativeCursors() {
    const container = document.getElementById('collaborative-cursors-container');
    if (!container) return;

    const cursorsData = [
        { name: 'Dr. Rajiv (Principal Investigator)', color: '#4bd3be', avatar: '👨‍🔬' },
        { name: 'Dr. Ashwani (Lead Researcher)', color: '#dfb142', avatar: '🔬' }
    ];

    cursorsData.forEach((c, idx) => {
        const cursorEl = document.createElement('div');
        cursorEl.className = 'collab-cursor';
        cursorEl.id = `collab-cursor-${idx}`;
        cursorEl.style.color = c.color;
        cursorEl.innerHTML = `
            <svg class="cursor-pointer" width="18" height="18" viewBox="0 0 24 24" fill="${c.color}">
                <path d="M3 3l7 18 3-7 7-3L3 3z"/>
            </svg>
            <span class="cursor-label" style="background:${c.color}">${c.avatar} ${c.name}</span>
        `;
        container.appendChild(cursorEl);
    });

    if (window.gsap) {
        gsap.to('#collab-cursor-0', {
            x: '60vw',
            y: '40px',
            duration: 7,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });

        gsap.to('#collab-cursor-1', {
            x: '25vw',
            y: '90px',
            duration: 5.5,
            repeat: -1,
            yoyo: true,
            ease: 'power1.inOut',
            delay: 1
        });
    }
})();

// 5. Education SVG Path Morphing Animation
(function initEducationMorph() {
    const path = document.getElementById('education-morph-path');
    if (!path || !window.anime) return;

    const shapes = [
        'M38.8,-53.2C50.2,-43.8,59.3,-32.1,63.1,-18.8C66.8,-5.5,65.3,9.4,59.7,22.7C54.1,36,44.5,47.8,32.2,55.5C19.9,63.2,5,66.8,-9.5,65.1C-24,63.4,-38,56.4,-48.9,45.8C-59.8,35.2,-67.5,21,-68.8,6.2C-70.1,-8.6,-65,-24,-55.8,-35.1C-46.6,-46.2,-33.3,-53.1,-20.2,-55.7C-7.1,-58.3,5.8,-56.6,18.8,-55.2Z',
        'M44.7,-58.4C56.1,-48.3,62.5,-32.7,64.8,-17.1C67.1,-1.5,65.3,14.1,58.3,27.5C51.3,40.9,39.1,52.1,24.8,58.3C10.5,64.5,-5.9,65.7,-21.5,61.4C-37.1,57.1,-51.9,47.3,-60.1,33.5C-68.3,19.7,-69.9,1.9,-65.4,-13.8C-60.9,-29.5,-50.3,-43.1,-37.4,-52.8C-24.5,-62.5,-9.3,-68.3,4.4,-73.6C18.1,-78.9,33.3,-68.5,44.7,-58.4Z',
        'M35.6,-48.8C46.8,-40.5,57.2,-30.7,62.1,-18.2C67,-5.7,66.4,9.5,60.8,22.8C55.2,36.1,44.6,47.5,31.7,55.1C18.8,62.7,3.6,66.5,-11.1,64.3C-25.8,62.1,-40,53.9,-50.8,42.2C-61.6,30.5,-69,15.3,-68.6,0.2C-68.2,-14.9,-60,-29.8,-49.2,-38.3C-38.4,-46.8,-25,-48.9,-12.3,-50.1C0.4,-51.3,24.4,-57.1,35.6,-48.8Z'
    ];

    let currentShape = 0;

    function morph() {
        currentShape = (currentShape + 1) % shapes.length;
        anime({
            targets: path,
            d: shapes[currentShape],
            duration: 4000,
            easing: 'easeInOutQuad',
            complete: morph
        });
    }

    morph();
})();

// 6. Publications UI Microinteractions & Copy Citation
(function initPublicationsFeedback() {
    document.querySelectorAll('.copy-citation-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const pubItem = btn.closest('.publication-item');
            const citation = pubItem ? pubItem.getAttribute('data-citation') : '';

            if (citation) {
                navigator.clipboard.writeText(citation).then(() => {
                    const originalText = btn.innerHTML;
                    btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                    btn.classList.add('copied');
                    setTimeout(() => {
                        btn.innerHTML = originalText;
                        btn.classList.remove('copied');
                    }, 2000);
                });
            }
        });
    });
})();

// 7. Contact Fluid Liquid Motion Background Canvas
(function initLiquidCanvas() {
    const canvas = document.getElementById('liquid-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = canvas.parentElement.clientWidth);
    let height = (canvas.height = canvas.parentElement.clientHeight);

    window.addEventListener('resize', () => {
        if (!canvas.parentElement) return;
        width = canvas.width = canvas.parentElement.clientWidth;
        height = canvas.height = canvas.parentElement.clientHeight;
    });

    let step = 0;

    function drawLiquidWaves() {
        ctx.clearRect(0, 0, width, height);
        step += 0.02;

        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        ctx.fillStyle = isDark ? 'rgba(75, 211, 190, 0.05)' : 'rgba(15, 43, 70, 0.04)';

        ctx.beginPath();
        ctx.moveTo(0, height / 2);

        for (let x = 0; x <= width; x += 20) {
            const y = Math.sin(x * 0.008 + step) * 20 + Math.cos(x * 0.005 + step) * 15 + height / 2;
            ctx.lineTo(x, y);
        }

        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fill();

        requestAnimationFrame(drawLiquidWaves);
    }

    drawLiquidWaves();
})();

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
