// Intersection Observer utility for scroll animations and lazy loading

// Initialize scroll animations using Intersection Observer
function initScrollAnimations() {
    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
        // Fallback for browsers without IntersectionObserver support
        fallbackAnimations();
        return;
    }

    // Configuration for the observer
    const observerOptions = {
        root: null, // Use the viewport as the root
        rootMargin: '0px 0px -10% 0px', // Trigger when element is 10% from bottom of viewport
        threshold: [0, 0.1, 0.3, 0.5, 0.7, 1] // Multiple thresholds for different animation triggers
    };

    // Create the main animation observer
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const element = entry.target;
            const animationClass = element.dataset.animation || 'fade-in';
            const delay = element.dataset.delay || '0';
            
            if (entry.isIntersecting && entry.intersectionRatio >= 0.1) {
                // Add delay if specified
                if (delay !== '0') {
                    element.style.animationDelay = delay + 'ms';
                    element.style.transitionDelay = delay + 'ms';
                }
                
                // Trigger the animation
                setTimeout(() => {
                    element.classList.add('animate');
                    element.classList.add('in-view');
                }, parseInt(delay));
                
                // Stop observing this element after animation
                animationObserver.unobserve(element);
            }
        });
    }, observerOptions);

    // Observe all elements with animation classes
    const animatedElements = document.querySelectorAll([
        '.fade-in',
        '.slide-in-left',
        '.slide-in-right',
        '.scale-in',
        '.rotate-in',
        '[data-animation]'
    ].join(', '));

    animatedElements.forEach(element => {
        animationObserver.observe(element);
    });

    // Special observer for hero elements with different threshold
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('hero-visible');
                triggerHeroAnimations();
                heroObserver.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.3
    });

    // Observe hero section
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroObserver.observe(heroSection);
    }

    // Parallax observer for performance optimization
    const parallaxObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const element = entry.target;
            if (entry.isIntersecting) {
                element.classList.add('parallax-active');
                startParallaxEffect(element);
            } else {
                element.classList.remove('parallax-active');
                stopParallaxEffect(element);
            }
        });
    }, {
        root: null,
        rootMargin: '100px 0px 100px 0px',
        threshold: 0
    });

    // Observe parallax elements
    const parallaxElements = document.querySelectorAll('.parallax, .gradient-shape');
    parallaxElements.forEach(element => {
        parallaxObserver.observe(element);
    });

    // Section change observer for navigation highlighting
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                updateActiveNavigation(entry.target.id);
            }
        });
    }, {
        root: null,
        rootMargin: '-20% 0px -20% 0px',
        threshold: [0.5]
    });

    // Observe main sections
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    console.log('✨ Scroll animations initialized');
}

// Trigger hero section animations
function triggerHeroAnimations() {
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroText = document.querySelector('.hero-text');
    const heroButton = document.querySelector('.hero .btn-primary');

    // Stagger the animations
    setTimeout(() => {
        if (heroTitle) heroTitle.classList.add('animate');
    }, 200);

    setTimeout(() => {
        if (heroSubtitle) heroSubtitle.classList.add('animate');
    }, 500);

    setTimeout(() => {
        if (heroText) heroText.classList.add('animate');
    }, 800);

    setTimeout(() => {
        if (heroButton) heroButton.classList.add('animate');
    }, 1100);
}

// Update active navigation based on current section
function updateActiveNavigation(sectionId) {
    // Remove active class from all nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });

    // Add active class to corresponding nav link
    const activeLink = document.querySelector(`[href="#${sectionId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// Parallax effect functions
const parallaxElements = new Map();

function startParallaxEffect(element) {
    if (!parallaxElements.has(element)) {
        parallaxElements.set(element, {
            element: element,
            speed: parseFloat(element.dataset.speed) || 0.5,
            offset: 0
        });
    }
}

function stopParallaxEffect(element) {
    parallaxElements.delete(element);
}

// Parallax scroll handler (throttled)
const handleParallaxScroll = throttle(() => {
    if (parallaxElements.size === 0) return;

    const scrollTop = window.pageYOffset;

    parallaxElements.forEach(({ element, speed }) => {
        const elementTop = element.offsetTop;
        const elementHeight = element.offsetHeight;
        const windowHeight = window.innerHeight;

        // Check if element is in viewport
        if (scrollTop + windowHeight > elementTop && scrollTop < elementTop + elementHeight) {
            const yPos = -(scrollTop - elementTop) * speed;
            element.style.transform = `translate3d(0, ${yPos}px, 0)`;
        }
    });
}, 16); // ~60fps

// Add parallax scroll listener
window.addEventListener('scroll', handleParallaxScroll, { passive: true });

// Fallback animations for browsers without IntersectionObserver
function fallbackAnimations() {
    console.log('🔄 Using fallback animations');
    
    // Immediately show all animated elements
    const animatedElements = document.querySelectorAll([
        '.fade-in',
        '.slide-in-left',
        '.slide-in-right',
        '.scale-in',
        '.rotate-in'
    ].join(', '));

    animatedElements.forEach((element, index) => {
        setTimeout(() => {
            element.classList.add('animate');
        }, index * 100); // Stagger the animations
    });

    // Trigger hero animations immediately
    setTimeout(triggerHeroAnimations, 500);
}

// Lazy loading observer for images
function initLazyImageLoading() {
    if (!('IntersectionObserver' in window)) {
        // Fallback: load all images immediately
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
        return;
    }

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                
                // Create a new image to preload
                const newImg = new Image();
                newImg.onload = () => {
                    // Once loaded, update the src and add fade-in effect
                    img.src = newImg.src;
                    img.classList.add('loaded');
                    img.removeAttribute('data-src');
                };
                newImg.src = img.dataset.src;
                
                imageObserver.unobserve(img);
            }
        });
    }, {
        root: null,
        rootMargin: '50px 0px 50px 0px',
        threshold: 0.01
    });

    // Observe all lazy images
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => {
        img.classList.add('lazy');
        imageObserver.observe(img);
    });
}

// Background image lazy loading
function initLazyBackgroundLoading() {
    if (!('IntersectionObserver' in window)) return;

    const backgroundObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const backgroundImage = element.dataset.backgroundImage;
                
                if (backgroundImage) {
                    const img = new Image();
                    img.onload = () => {
                        element.style.backgroundImage = `url(${backgroundImage})`;
                        element.classList.add('background-loaded');
                    };
                    img.src = backgroundImage;
                }
                
                backgroundObserver.unobserve(element);
            }
        });
    }, {
        root: null,
        rootMargin: '100px 0px 100px 0px',
        threshold: 0.01
    });

    // Observe elements with data-background-image
    const lazyBackgrounds = document.querySelectorAll('[data-background-image]');
    lazyBackgrounds.forEach(element => {
        backgroundObserver.observe(element);
    });
}

// Performance monitoring for animations
function monitorAnimationPerformance() {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
            if (entry.entryType === 'measure' && entry.name.includes('animation')) {
                if (entry.duration > 16) { // More than one frame at 60fps
                    console.warn(`Slow animation detected: ${entry.name} took ${entry.duration}ms`);
                }
            }
        });
    });

    observer.observe({ entryTypes: ['measure'] });
}

// Refresh animations (useful for dynamic content)
function refreshAnimations() {
    // Re-initialize observers for new content
    initScrollAnimations();
    initLazyImageLoading();
    initLazyBackgroundLoading();
}

// Utility function to manually trigger animation on element
function triggerAnimation(element, animationType = 'fade-in', delay = 0) {
    if (!(element instanceof Element)) {
        console.error('triggerAnimation: Invalid element provided');
        return;
    }

    element.classList.add(animationType);
    
    setTimeout(() => {
        element.classList.add('animate');
    }, delay);
}

// Initialize all lazy loading when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initLazyImageLoading();
    initLazyBackgroundLoading();
    monitorAnimationPerformance();
});

// Export functions for external use
window.ScrollAnimations = {
    init: initScrollAnimations,
    refresh: refreshAnimations,
    trigger: triggerAnimation,
    startParallax: startParallaxEffect,
    stopParallax: stopParallaxEffect
};

// Throttle utility function (if not available globally)
if (typeof throttle === 'undefined') {
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}