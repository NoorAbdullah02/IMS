import * as THREE from 'three';
import gsap from 'gsap';

// --- Three.js Background ---
const initThree = () => {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Particles
    const particlesCount = 1500;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 10;
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.005,
        color: '#6366f1',
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    camera.position.z = 3;

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) - 0.5;
        mouseY = (event.clientY / window.innerHeight) - 0.5;
    });

    // Animate
    const clock = new THREE.Clock();

    const animate = () => {
        const elapsedTime = clock.getElapsedTime();

        particlesMesh.rotation.y = elapsedTime * 0.05;

        // Follow mouse smoothly
        particlesMesh.rotation.x += (mouseY * 0.1 - particlesMesh.rotation.x) * 0.05;
        particlesMesh.rotation.y += (mouseX * 0.1 - particlesMesh.rotation.y) * 0.05;

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    };

    animate();

    // Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
};

// --- GSAP Entrance Animations ---
const initGSAP = () => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.6 } });

    if (document.querySelector('.relative.z-10')) {
        tl.fromTo('.relative.z-10',
            { y: 60, opacity: 0, scale: 0.95 },
            { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'power4.out', delay: 0.2 }
        );
    }

    // Landing Hero Specific
    if (document.querySelector('.max-w-5xl h1')) {
        gsap.from('.max-w-5xl h1', {
            y: 40,
            opacity: 0,
            duration: 1,
            ease: 'power4.out',
            delay: 0.2
        });
    }

    if (document.querySelector('form > div')) {
        tl.from('form > div', {
            y: 20,
            opacity: 0,
            stagger: 0.08,
        }, '-=0.3');
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initGSAP();
    initThree();
});
