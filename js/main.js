// Main JavaScript - Core functionality and initialization

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeApp();
});

// Main initialization function
function initializeApp() {
    // Initialize scroll animations
    if (typeof initScrollAnimations === 'function') {
        initScrollAnimations();
    }
    
    // Initialize navigation
    if (typeof initNavigation === 'function') {
        initNavigation();
    }
    
    // Initialize hero animations
    if (typeof initHeroAnimations === 'function') {
        initHeroAnimations();
    }
    
    // Initialize carousel
    if (typeof initCarousel === 'function') {
        initCarousel();
    }
    
    // Initialize contact form
    if (typeof initContactForm === 'function') {
        initContactForm();
    }
    
    // Initialize smooth scrolling
    initSmoothScrolling();
    
    // Initialize header scroll effect
    initHeaderScrollEffect();
    
    // Initialize lazy loading
    initLazyLoading();
    
    // Initialize performance optimizations
    initPerformanceOptimizations();
    
    console.log('🚀 Website initialized successfully');
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without jumping
                history.pushState(null, null, targetId);
            }
        });
    });
}

// Header scroll effect
function initHeaderScrollEffect() {
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    function updateHeader() {
        const scrollY = window.scrollY;
        
        if (scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show header on scroll
        if (scrollY > lastScrollY && scrollY > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollY = scrollY;
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick, { passive: true });
    
    // Add CSS for header transition
    header.style.transition = 'transform 0.3s ease, background-color 0.3s ease';
}

// Lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    }
}

// Performance optimizations
function initPerformanceOptimizations() {
    // Preload critical resources
    preloadCriticalResources();
    
    // Initialize resize handler with debouncing
    initResizeHandler();
    
    // Initialize scroll performance
    initScrollPerformance();
}

function preloadCriticalResources() {
    // Preload hero background images
    const heroImages = [
        'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop'
    ];
    
    heroImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

function initResizeHandler() {
    let resizeTimer;
    
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            // Handle resize events
            handleResize();
        }, 150);
    });
}

function handleResize() {
    // Update any size-dependent calculations
    updateViewportHeight();
    
    // Refresh animations if needed
    if (typeof refreshAnimations === 'function') {
        refreshAnimations();
    }
}

function updateViewportHeight() {
    // Fix for mobile viewport height issues
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

function initScrollPerformance() {
    // Use passive event listeners for better scroll performance
    let scrollTimer;
    
    window.addEventListener('scroll', function() {
        // Throttle scroll events
        if (!scrollTimer) {
            scrollTimer = setTimeout(function() {
                handleScroll();
                scrollTimer = null;
            }, 16); // ~60fps
        }
    }, { passive: true });
}

function handleScroll() {
    // Update scroll-dependent elements
    updateScrollProgress();
}

function updateScrollProgress() {
    const scrolled = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrolled / maxScroll) * 100;
    
    // Update scroll progress indicator if it exists
    const progressBar = document.querySelector('.scroll-progress');
    if (progressBar) {
        progressBar.style.transform = `scaleX(${progress / 100})`;
    }
}

// Utility functions
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        
        if (callNow) func.apply(context, args);
    };
}

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

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // You could send errors to an analytics service here
});

// Page visibility API for performance
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Page is hidden, pause animations/timers
        pauseAnimations();
    } else {
        // Page is visible, resume animations/timers
        resumeAnimations();
    }
});

function pauseAnimations() {
    // Pause CSS animations and transitions for performance
    document.body.style.animationPlayState = 'paused';
}

function resumeAnimations() {
    // Resume CSS animations and transitions
    document.body.style.animationPlayState = 'running';
}

// Keyboard navigation improvements
document.addEventListener('keydown', function(e) {
    // Add outline for keyboard navigation
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', function() {
    // Remove outline for mouse navigation
    document.body.classList.remove('keyboard-navigation');
});

// Touch device detection
function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

// Add touch class to body for touch-specific styles
if (isTouchDevice()) {
    document.body.classList.add('touch-device');
} else {
    document.body.classList.add('no-touch');
}

// Reduced motion detection
if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.body.classList.add('reduced-motion');
}

// Dark mode detection (for future implementation)
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add('dark-mode');
}

// Loading state management
function showLoading() {
    document.body.classList.add('loading');
}

function hideLoading() {
    document.body.classList.remove('loading');
}

// Initialize viewport height fix
updateViewportHeight();

// Analytics and tracking (placeholder)
function trackEvent(category, action, label) {
    // Placeholder for analytics tracking
    console.log('Track event:', { category, action, label });
    
    // Example: Google Analytics 4
    // gtag('event', action, {
    //     event_category: category,
    //     event_label: label
    // });
}

// Form submission tracking
document.addEventListener('submit', function(e) {
    const form = e.target;
    if (form.id === 'contactForm') {
        trackEvent('Form', 'Submit', 'Contact Form');
    }
});

// Button click tracking
document.addEventListener('click', function(e) {
    if (e.target.matches('.btn')) {
        const buttonText = e.target.textContent.trim();
        trackEvent('Button', 'Click', buttonText);
    }
});

// Navigation tracking
document.addEventListener('click', function(e) {
    if (e.target.matches('.nav-link')) {
        const linkText = e.target.textContent.trim();
        trackEvent('Navigation', 'Click', linkText);
    }
});

// Scroll depth tracking
let maxScrollDepth = 0;
const scrollMilestones = [25, 50, 75, 100];

function trackScrollDepth() {
    const scrolled = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const currentDepth = Math.floor((scrolled / maxScroll) * 100);
    
    if (currentDepth > maxScrollDepth) {
        maxScrollDepth = currentDepth;
        
        // Check if we've hit a milestone
        scrollMilestones.forEach(milestone => {
            if (currentDepth >= milestone && maxScrollDepth < milestone) {
                trackEvent('Scroll Depth', `${milestone}%`, window.location.pathname);
            }
        });
    }
}

// Add scroll depth tracking to scroll handler
const originalHandleScroll = handleScroll;
handleScroll = function() {
    originalHandleScroll();
    trackScrollDepth();
};

// Service Worker registration (for future PWA implementation)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Uncomment when you have a service worker
        // navigator.serviceWorker.register('/sw.js')
        //     .then(function(registration) {
        //         console.log('SW registered: ', registration);
        //     })
        //     .catch(function(registrationError) {
        //         console.log('SW registration failed: ', registrationError);
        //     });
    });
}

// Export functions for use in other modules
window.AppUtils = {
    debounce,
    throttle,
    trackEvent,
    showLoading,
    hideLoading,
    isTouchDevice
};