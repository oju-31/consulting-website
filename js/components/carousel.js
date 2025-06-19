// Product carousel functionality for the Focus On section

function initCarousel() {
    const carousel = document.querySelector('.product-carousel');
    if (!carousel) {
        console.warn('Product carousel not found');
        return;
    }
    
    initProductCarousel();
    initCarouselNavigation();
    initCarouselKeyboard();
    initCarouselTouch();
    initCarouselAutoplay();
    
    console.log('🎠 Carousel initialized');
}

// Product data
const products = [
    {
        id: 'automate',
        category: 'APPLIED AI',
        name: 'Automate',
        description: 'The AI Intelligent Document Processing (IDP) solution that automates the management and extraction of information from any kind of document.',
        logo: 'AI',
        color: '#4F46E5',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop'
    },
    {
        id: 'declaro',
        category: 'APPLIED AI',
        name: 'Declaro',
        description: 'The AI configurator that turns managing complex products into a powerful planning and sales tool.',
        logo: 'DC',
        color: '#7C3AED',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop'
    },
    {
        id: 'optimize',
        category: 'DIGITAL ENABLEMENT',
        name: 'Optimize',
        description: 'Advanced analytics platform that transforms your data into actionable business insights through AI-powered recommendations.',
        logo: 'OP',
        color: '#06B6D4',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop'
    },
    {
        id: 'connect',
        category: 'DIGITAL ENABLEMENT',
        name: 'Connect',
        description: 'Seamless integration platform that connects all your business systems and creates a unified digital ecosystem.',
        logo: 'CN',
        color: '#10B981',
        image: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400&h=300&fit=crop'
    }
];

let currentIndex = 0;
let isAutoPlaying = true;
let autoplayTimer = null;
let isAnimating = false;

// Initialize product carousel
function initProductCarousel() {
    const productLogo = document.getElementById('current-logo');
    const productName = document.getElementById('current-product');
    const productDescription = document.getElementById('current-description');
    const productCategory = document.querySelector('.product-category');
    
    if (!productLogo || !productName || !productDescription) {
        console.warn('Carousel elements not found');
        return;
    }
    
    // Display first product
    updateCarouselContent(0);
    
    // Add product indicators
    // createProductIndicators();
    
    // Add loading states
    addLoadingStates();
}

// Update carousel content
function updateCarouselContent(index, direction = 'next') {
    if (isAnimating || index === currentIndex) return;
    
    isAnimating = true;
    const product = products[index];
    
    const productLogo = document.getElementById('current-logo');
    const productName = document.getElementById('current-product');
    const productDescription = document.getElementById('current-description');
    const productCategory = document.querySelector('.product-category');
    const iconCircle = document.querySelector('.icon-circle');
    const productContent = document.querySelector('.product-content');
    
    // Animation direction classes
    const exitClass = direction === 'next' ? 'slide-out-left' : 'slide-out-right';
    const enterClass = direction === 'next' ? 'slide-in-right' : 'slide-in-left';
    
    // Exit animation
    productContent.classList.add(exitClass);
    iconCircle.classList.add('scaling');
    
    setTimeout(() => {
        // Update content
        if (productLogo) productLogo.textContent = product.logo;
        if (productName) productName.textContent = product.name;
        if (productDescription) productDescription.textContent = product.description;
        if (productCategory) productCategory.textContent = product.category;
        
        // Update colors
        if (iconCircle) {
            iconCircle.style.background = `rgba(${hexToRgb(product.color)}, 0.1)`;
            iconCircle.style.setProperty('--accent-color', product.color);
        }
        if (productLogo) {
            productLogo.style.color = product.color;
        }
        if (productName) {
            productName.style.color = product.color;
        }
        if (productCategory) {
            productCategory.style.color = product.color;
        }
        
        // Enter animation
        productContent.classList.remove(exitClass);
        productContent.classList.add(enterClass);
        iconCircle.classList.remove('scaling');
        
        setTimeout(() => {
            productContent.classList.remove(enterClass);
            isAnimating = false;
        }, 500);
        
    }, 250);
    
    // Update indicators
    updateProductIndicators(index);
    
    // Update current index
    currentIndex = index;
    
    // Track carousel interaction
    if (typeof trackEvent === 'function') {
        trackEvent('Carousel', 'Product View', product.name);
    }
}

// Create product indicators
function createProductIndicators() {
    const carousel = document.querySelector('.product-carousel');
    const indicatorsContainer = document.createElement('div');
    indicatorsContainer.className = 'carousel-indicators';
    
    products.forEach((product, index) => {
        const indicator = document.createElement('button');
        indicator.className = 'carousel-indicator';
        indicator.setAttribute('aria-label', `View ${product.name}`);
        indicator.dataset.index = index;
        
        if (index === 0) {
            indicator.classList.add('active');
        }
        
        indicator.addEventListener('click', () => {
            if (index !== currentIndex) {
                const direction = index > currentIndex ? 'next' : 'prev';
                updateCarouselContent(index, direction);
                restartAutoplay();
            }
        });
        
        indicatorsContainer.appendChild(indicator);
    });
    
    // carousel.appendChild(indicatorsContainer);
}

// Update product indicators
function updateProductIndicators(activeIndex) {
    const indicators = document.querySelectorAll('.carousel-indicator');
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === activeIndex);
        indicator.setAttribute('aria-selected', index === activeIndex);
    });
}

// Initialize carousel navigation
function initCarouselNavigation() {
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    
    if (!prevBtn || !nextBtn) {
        console.warn('Carousel navigation buttons not found');
        return;
    }
    
    // Previous button
    prevBtn.addEventListener('click', () => {
        navigateCarousel('prev');
    });
    
    // Next button
    nextBtn.addEventListener('click', () => {
        navigateCarousel('next');
    });
    
    // Add loading states
    prevBtn.addEventListener('click', () => addButtonLoadingState(prevBtn));
    nextBtn.addEventListener('click', () => addButtonLoadingState(nextBtn));
    
    // Initialize button states
    updateNavigationButtons();
}

// Navigate carousel
function navigateCarousel(direction) {
    if (isAnimating) return;
    
    let newIndex;
    
    if (direction === 'next') {
        newIndex = currentIndex >= products.length - 1 ? 0 : currentIndex + 1;
    } else {
        newIndex = currentIndex <= 0 ? products.length - 1 : currentIndex - 1;
    }
    
    updateCarouselContent(newIndex, direction);
    restartAutoplay();
}

// Update navigation button states
function updateNavigationButtons() {
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    
    if (!prevBtn || !nextBtn) return;
    
    // Update ARIA labels with current product info
    const currentProduct = products[currentIndex];
    const nextIndex = currentIndex >= products.length - 1 ? 0 : currentIndex + 1;
    const prevIndex = currentIndex <= 0 ? products.length - 1 : currentIndex - 1;
    
    prevBtn.setAttribute('aria-label', `Previous: ${products[prevIndex].name}`);
    nextBtn.setAttribute('aria-label', `Next: ${products[nextIndex].name}`);
}

// Add button loading state
function addButtonLoadingState(button) {
    button.classList.add('loading');
    setTimeout(() => {
        button.classList.remove('loading');
    }, 300);
}

// Initialize keyboard navigation
function initCarouselKeyboard() {
    const carousel = document.querySelector('.product-carousel');
    
    carousel.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                navigateCarousel('prev');
                break;
            case 'ArrowRight':
                e.preventDefault();
                navigateCarousel('next');
                break;
            case 'Home':
                e.preventDefault();
                updateCarouselContent(0, 'prev');
                restartAutoplay();
                break;
            case 'End':
                e.preventDefault();
                updateCarouselContent(products.length - 1, 'next');
                restartAutoplay();
                break;
            case ' ':
            case 'Enter':
                e.preventDefault();
                toggleAutoplay();
                break;
        }
    });
    
    // Make carousel focusable
    carousel.setAttribute('tabindex', '0');
    carousel.setAttribute('role', 'region');
    carousel.setAttribute('aria-label', 'Product showcase carousel');
}

// Initialize touch/swipe support
function initCarouselTouch() {
    const carousel = document.querySelector('.product-showcase');
    if (!carousel) return;
    
    let startX = 0;
    let startY = 0;
    let isDragging = false;
    let startTime = 0;
    
    // Touch events
    carousel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        startTime = Date.now();
        isDragging = true;
        carousel.classList.add('dragging');
    }, { passive: true });
    
    carousel.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        
        const currentX = e.touches[0].clientX;
        const diffX = startX - currentX;
        
        // Prevent vertical scrolling if horizontal swipe is detected
        if (Math.abs(diffX) > Math.abs(startY - e.touches[0].clientY)) {
            e.preventDefault();
        }
    }, { passive: false });
    
    carousel.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const diffX = startX - endX;
        const diffY = startY - endY;
        const timeDiff = Date.now() - startTime;
        
        isDragging = false;
        carousel.classList.remove('dragging');
        
        // Swipe detection
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50 && timeDiff < 300) {
            if (diffX > 0) {
                navigateCarousel('next');
            } else {
                navigateCarousel('prev');
            }
        }
    }, { passive: true });
    
    // Mouse events for desktop
    carousel.addEventListener('mousedown', (e) => {
        startX = e.clientX;
        startTime = Date.now();
        isDragging = true;
        carousel.classList.add('dragging');
        e.preventDefault();
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        const currentX = e.clientX;
        const diffX = startX - currentX;
        
        // Visual feedback for drag
        const carousel = document.querySelector('.product-showcase');
        if (Math.abs(diffX) > 10) {
            carousel.style.transform = `translateX(${-diffX * 0.1}px)`;
        }
    });
    
    document.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        
        const endX = e.clientX;
        const diffX = startX - endX;
        const timeDiff = Date.now() - startTime;
        
        isDragging = false;
        const carousel = document.querySelector('.product-showcase');
        carousel.classList.remove('dragging');
        carousel.style.transform = '';
        
        // Swipe detection
        if (Math.abs(diffX) > 100 && timeDiff < 300) {
            if (diffX > 0) {
                navigateCarousel('next');
            } else {
                navigateCarousel('prev');
            }
        }
    });
}

// Initialize autoplay
function initCarouselAutoplay() {
    startAutoplay();
    
    // Pause on hover
    const carousel = document.querySelector('.product-carousel');
    carousel.addEventListener('mouseenter', pauseAutoplay);
    carousel.addEventListener('mouseleave', resumeAutoplay);
    
    // Pause on focus
    carousel.addEventListener('focusin', pauseAutoplay);
    carousel.addEventListener('focusout', resumeAutoplay);
    
    // Add autoplay controls
    addAutoplayControls();
}

function startAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
    
    autoplayTimer = setInterval(() => {
        if (isAutoPlaying && !document.hidden) {
            navigateCarousel('next');
        }
    }, 5000); // 5 seconds
}

function pauseAutoplay() {
    if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
    }
}

function resumeAutoplay() {
    if (isAutoPlaying && !autoplayTimer) {
        startAutoplay();
    }
}

function restartAutoplay() {
    if (isAutoPlaying) {
        pauseAutoplay();
        startAutoplay();
    }
}

function toggleAutoplay() {
    isAutoPlaying = !isAutoPlaying;
    
    if (isAutoPlaying) {
        startAutoplay();
    } else {
        pauseAutoplay();
    }
    
    updateAutoplayButton();
}

// Add autoplay controls
function addAutoplayControls() {
    const carousel = document.querySelector('.product-carousel');
    const autoplayBtn = document.createElement('button');
    autoplayBtn.className = 'autoplay-toggle';
    autoplayBtn.innerHTML = '⏸';
    autoplayBtn.setAttribute('aria-label', 'Pause autoplay');
    autoplayBtn.setAttribute('title', 'Pause autoplay');
    
    autoplayBtn.addEventListener('click', toggleAutoplay);
    
    carousel.appendChild(autoplayBtn);
}

function updateAutoplayButton() {
    const autoplayBtn = document.querySelector('.autoplay-toggle');
    if (!autoplayBtn) return;
    
    if (isAutoPlaying) {
        autoplayBtn.innerHTML = '⏸';
        autoplayBtn.setAttribute('aria-label', 'Pause autoplay');
        autoplayBtn.setAttribute('title', 'Pause autoplay');
    } else {
        autoplayBtn.innerHTML = '▶';
        autoplayBtn.setAttribute('aria-label', 'Start autoplay');
        autoplayBtn.setAttribute('title', 'Start autoplay');
    }
}

// Add loading states
function addLoadingStates() {
    const productContent = document.querySelector('.product-content');
    if (!productContent) return;
    
    // Add skeleton loading animation
    productContent.classList.add('loading-ready');
}

// Utility function to convert hex to rgb
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result 
        ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
        : '79, 70, 229'; // fallback color
}

// Handle visibility change (pause when tab is hidden)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        pauseAutoplay();
    } else if (isAutoPlaying) {
        resumeAutoplay();
    }
});

// Handle reduced motion preferences
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    isAutoPlaying = false;
    pauseAutoplay();
}

// Export carousel functions
window.Carousel = {
    init: initCarousel,
    navigate: navigateCarousel,
    goTo: (index) => updateCarouselContent(index),
    toggleAutoplay: toggleAutoplay,
    getCurrentIndex: () => currentIndex,
    getProducts: () => products
};

// Auto-initialize if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCarousel);
} else {
    initCarousel();
}