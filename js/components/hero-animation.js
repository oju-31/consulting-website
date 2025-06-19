// Hero section animations and interactive effects

function initHeroAnimations() {
    initHeroSequence();
    initGradientShapes();
    initHeroParallax();
    initHeroPauseButton();
    initHeroInteractions();
    initHeroResizeHandler();
    
    console.log('🎨 Hero animations initialized');
}

// Main hero animation sequence
function initHeroSequence() {
    const hero = document.querySelector('.hero');
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroText = document.querySelector('.hero-text');
    const heroButton = document.querySelector('.hero .btn-primary');
    const heroDescription = document.querySelector('.hero-description');
    
    if (!hero) return;
    
    // Check if reduced motion is preferred
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        // Show all elements immediately without animation
        showHeroElementsImmediately();
        return;
    }
    
    // Reset initial states
    if (heroTitle) {
        heroTitle.style.opacity = '0';
        heroTitle.style.transform = 'translateY(50px)';
    }
    if (heroSubtitle) {
        heroSubtitle.style.opacity = '0';
        heroSubtitle.style.transform = 'translateY(30px)';
    }
    if (heroText) {
        heroText.style.opacity = '0';
        heroText.style.transform = 'translateY(30px)';
    }
    if (heroButton) {
        heroButton.style.opacity = '0';
        heroButton.style.transform = 'translateY(20px) scale(0.9)';
    }
    
    // Animation sequence with staggered timing
    const animationSequence = [
        { element: heroTitle, delay: 300, duration: 800 },
        { element: heroSubtitle, delay: 600, duration: 600 },
        { element: heroText, delay: 900, duration: 600 },
        { element: heroButton, delay: 1200, duration: 500 }
    ];
    
    animationSequence.forEach(({ element, delay, duration }) => {
        if (!element) return;
        
        setTimeout(() => {
            animateHeroElement(element, duration);
        }, delay);
    });
    
    // Add entrance animation class to hero
    setTimeout(() => {
        hero.classList.add('hero-animated');
    }, 100);
}

// Animate individual hero elements
function animateHeroElement(element, duration = 600) {
    if (!element) return;
    
    element.style.transition = `all ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
    element.style.opacity = '1';
    element.style.transform = 'translateY(0) scale(1)';
    
    // Add animated class for CSS animations
    element.classList.add('hero-element-animated');
    
    // Special handling for button
    if (element.classList.contains('btn-primary')) {
        setTimeout(() => {
            element.style.transform = 'translateY(-2px) scale(1)';
            setTimeout(() => {
                element.style.transform = 'translateY(0) scale(1)';
            }, 200);
        }, duration / 2);
    }
}

// Show elements immediately for reduced motion
function showHeroElementsImmediately() {
    const heroElements = [
        '.hero-title',
        '.hero-subtitle', 
        '.hero-text',
        '.hero .btn-primary'
    ];
    
    heroElements.forEach(selector => {
        const element = document.querySelector(selector);
        if (element) {
            element.style.opacity = '1';
            element.style.transform = 'none';
            element.classList.add('hero-element-animated');
        }
    });
}

// Gradient shapes animation
function initGradientShapes() {
    const shapes = document.querySelectorAll('.gradient-shape');
    
    if (shapes.length === 0) return;
    
    let animationId;
    let isAnimating = true;
    
    // Enhanced floating animation with mouse interaction
    function animateShapes() {
        shapes.forEach((shape, index) => {
            const time = Date.now() * 0.001;
            const speedMultiplier = 0.5 + (index * 0.2);
            const amplitude = 20 + (index * 10);
            
            const x = Math.sin(time * speedMultiplier) * amplitude;
            const y = Math.cos(time * speedMultiplier * 0.8) * amplitude;
            const rotation = Math.sin(time * speedMultiplier * 0.5) * 5;
            
            shape.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg)`;
        });
        
        if (isAnimating) {
            animationId = requestAnimationFrame(animateShapes);
        }
    }
    
    // Start animation
    animationId = requestAnimationFrame(animateShapes);
    
    // Mouse interaction with shapes
    const hero = document.querySelector('.hero');
    if (hero) {
        let mouseX = 0;
        let mouseY = 0;
        
        hero.addEventListener('mousemove', (e) => {
            const rect = hero.getBoundingClientRect();
            mouseX = (e.clientX - rect.left) / rect.width - 0.5;
            mouseY = (e.clientY - rect.top) / rect.height - 0.5;
            
            shapes.forEach((shape, index) => {
                const intensity = 30 + (index * 10);
                const offsetX = mouseX * intensity;
                const offsetY = mouseY * intensity;
                
                shape.style.setProperty('--mouse-x', `${offsetX}px`);
                shape.style.setProperty('--mouse-y', `${offsetY}px`);
                shape.classList.add('mouse-active');
            });
        });
        
        hero.addEventListener('mouseleave', () => {
            shapes.forEach(shape => {
                shape.classList.remove('mouse-active');
                shape.style.removeProperty('--mouse-x');
                shape.style.removeProperty('--mouse-y');
            });
        });
    }
    
    // Pause/resume animation
    window.pauseHeroShapes = () => {
        isAnimating = false;
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    };
    
    window.resumeHeroShapes = () => {
        if (!isAnimating) {
            isAnimating = true;
            animationId = requestAnimationFrame(animateShapes);
        }
    };
}

// Hero parallax effect
function initHeroParallax() {
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    const shapes = document.querySelectorAll('.gradient-shape');
    
    if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        const rateShapes = scrolled * -0.3;
        
        if (heroContent) {
            heroContent.style.transform = `translate3d(0, ${rate}px, 0)`;
        }
        
        shapes.forEach((shape, index) => {
            const shapeRate = rateShapes * (0.5 + index * 0.2);
            shape.style.transform += ` translateY(${shapeRate}px)`;
        });
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick, { passive: true });
}

// Pause button functionality
function initHeroPauseButton() {
    const pauseBtn = document.querySelector('.hero-pause-btn');
    
    if (!pauseBtn) return;
    
    let isPaused = false;
    
    function toggleAnimations() {
        isPaused = !isPaused;
        
        if (isPaused) {
            pauseBtn.innerHTML = '▶';
            pauseBtn.setAttribute('aria-label', 'Resume animations');
            pauseAllAnimations();
        } else {
            pauseBtn.innerHTML = '⏸';
            pauseBtn.setAttribute('aria-label', 'Pause animations');
            resumeAllAnimations();
        }
        
        pauseBtn.classList.toggle('paused', isPaused);
    }
    
    pauseBtn.addEventListener('click', toggleAnimations);
    
    // Keyboard support
    pauseBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleAnimations();
        }
    });
    
    // Initialize button state
    pauseBtn.innerHTML = '⏸';
    pauseBtn.setAttribute('aria-label', 'Pause animations');
    pauseBtn.setAttribute('role', 'button');
    pauseBtn.setAttribute('tabindex', '0');
}

// Pause/resume all animations
function pauseAllAnimations() {
    const hero = document.querySelector('.hero');
    
    if (hero) {
        hero.style.animationPlayState = 'paused';
        hero.classList.add('animations-paused');
    }
    
    // Pause gradient shapes
    if (typeof window.pauseHeroShapes === 'function') {
        window.pauseHeroShapes();
    }
    
    // Pause CSS animations
    document.documentElement.style.setProperty('--animation-play-state', 'paused');
}

function resumeAllAnimations() {
    const hero = document.querySelector('.hero');
    
    if (hero) {
        hero.style.animationPlayState = 'running';
        hero.classList.remove('animations-paused');
    }
    
    // Resume gradient shapes
    if (typeof window.resumeHeroShapes === 'function') {
        window.resumeHeroShapes();
    }
    
    // Resume CSS animations
    document.documentElement.style.setProperty('--animation-play-state', 'running');
}

// Hero interactive elements
function initHeroInteractions() {
    const heroButton = document.querySelector('.hero .btn-primary');
    const heroTitle = document.querySelector('.hero-title');
    
    // Enhanced button interactions
    if (heroButton) {
        heroButton.addEventListener('mouseenter', () => {
            heroButton.style.transform = 'translateY(-4px) scale(1.05)';
            heroButton.style.boxShadow = '0 20px 40px rgba(79, 70, 229, 0.3)';
        });
        
        heroButton.addEventListener('mouseleave', () => {
            heroButton.style.transform = 'translateY(0) scale(1)';
            heroButton.style.boxShadow = '';
        });
        
        heroButton.addEventListener('mousedown', () => {
            heroButton.style.transform = 'translateY(0) scale(0.98)';
        });
        
        heroButton.addEventListener('mouseup', () => {
            heroButton.style.transform = 'translateY(-4px) scale(1.05)';
        });
        
        // Click analytics
        heroButton.addEventListener('click', () => {
            if (typeof trackEvent === 'function') {
                trackEvent('Hero', 'CTA Click', 'Contact Us');
            }
        });
    }
    
    // Title text effects
    if (heroTitle) {
        // Split text into spans for individual letter animation
        const text = heroTitle.textContent;
        heroTitle.innerHTML = text
            .split('')
            .map(char => char === ' ' ? ' ' : `<span class="char">${char}</span>`)
            .join('');
        
        const chars = heroTitle.querySelectorAll('.char');
        
        // Hover effect on title
        heroTitle.addEventListener('mouseenter', () => {
            chars.forEach((char, index) => {
                setTimeout(() => {
                    char.style.transform = 'translateY(-10px) rotate(5deg)';
                    char.style.color = '#7C3AED';
                    
                    setTimeout(() => {
                        char.style.transform = 'translateY(0) rotate(0deg)';
                        char.style.color = '';
                    }, 200);
                }, index * 50);
            });
        });
    }
}

// Handle hero resize
function initHeroResizeHandler() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    let resizeTimeout;
    
    function handleHeroResize() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Recalculate hero dimensions
            updateHeroDimensions();
            
            // Refresh shape positions
            refreshShapePositions();
            
        }, 250);
    }
    
    window.addEventListener('resize', handleHeroResize);
}

function updateHeroDimensions() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    // Update CSS custom properties for responsive calculations
    const heroHeight = hero.offsetHeight;
    const heroWidth = hero.offsetWidth;
    
    document.documentElement.style.setProperty('--hero-height', `${heroHeight}px`);
    document.documentElement.style.setProperty('--hero-width', `${heroWidth}px`);
}

function refreshShapePositions() {
    const shapes = document.querySelectorAll('.gradient-shape');
    
    shapes.forEach((shape, index) => {
        // Reset and recalculate positions based on viewport
        const hero = document.querySelector('.hero');
        if (!hero) return;
        
        const heroRect = hero.getBoundingClientRect();
        const positions = [
            { top: '10%', left: '20%' },
            { top: '30%', right: '10%' },
            { bottom: '20%', left: '10%' }
        ];
        
        if (positions[index]) {
            const pos = positions[index];
            Object.keys(pos).forEach(key => {
                shape.style[key] = pos[key];
            });
        }
    });
}

// Performance monitoring for hero animations
function monitorHeroPerformance() {
    if (!('PerformanceObserver' in window)) return;
    
    const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
            if (entry.name.includes('hero') && entry.duration > 16) {
                console.warn(`Hero animation performance issue: ${entry.name} took ${entry.duration}ms`);
            }
        });
    });
    
    observer.observe({ entryTypes: ['measure'] });
}

// Initialize performance monitoring
monitorHeroPerformance();

// Export hero animation functions
window.HeroAnimations = {
    init: initHeroAnimations,
    pause: pauseAllAnimations,
    resume: resumeAllAnimations,
    refreshShapes: refreshShapePositions,
    updateDimensions: updateHeroDimensions
};

// Auto-initialize if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroAnimations);
} else {
    initHeroAnimations();
}

// Visibility API to pause animations when tab is not visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        pauseAllAnimations();
    } else {
        resumeAllAnimations();
    }
});