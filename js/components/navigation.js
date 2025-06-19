// Navigation functionality - Mobile menu, active states, and scroll behavior

function initNavigation() {
    initMobileMenu();
    initActiveNavigation();
    initNavigationScroll();
    initDropdownMenus();
    initKeyboardNavigation();
    
    console.log('📱 Navigation initialized');
}

// Mobile menu functionality
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    const header = document.querySelector('.header');
    const body = document.body;
    
    if (!mobileMenuBtn || !navMenu) {
        console.warn('Mobile menu elements not found');
        return;
    }
    
    let isMenuOpen = false;
    
    // Toggle mobile menu
    function toggleMobileMenu() {
        isMenuOpen = !isMenuOpen;
        
        mobileMenuBtn.classList.toggle('active', isMenuOpen);
        navMenu.classList.toggle('active', isMenuOpen);
        header.classList.toggle('menu-open', isMenuOpen);
        body.classList.toggle('menu-open', isMenuOpen);
        
        // Update ARIA attributes for accessibility
        mobileMenuBtn.setAttribute('aria-expanded', isMenuOpen);
        navMenu.setAttribute('aria-hidden', !isMenuOpen);
        
        // Prevent body scroll when menu is open
        if (isMenuOpen) {
            body.style.overflow = 'hidden';
            mobileMenuBtn.setAttribute('aria-label', 'Close menu');
        } else {
            body.style.overflow = '';
            mobileMenuBtn.setAttribute('aria-label', 'Open menu');
        }
        
        // Focus management
        if (isMenuOpen) {
            // Focus first menu item
            const firstMenuItem = navMenu.querySelector('.nav-link');
            if (firstMenuItem) {
                firstMenuItem.focus();
            }
        } else {
            // Return focus to menu button
            mobileMenuBtn.focus();
        }
    }
    
    // Close mobile menu
    function closeMobileMenu() {
        if (isMenuOpen) {
            toggleMobileMenu();
        }
    }
    
    // Event listeners
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    
    // Close menu when clicking on nav links
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (isMenuOpen && 
            !header.contains(e.target) && 
            !e.target.closest('.nav-menu')) {
            closeMobileMenu();
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen) {
            closeMobileMenu();
        }
    });
    
    // Close menu on window resize (desktop)
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && isMenuOpen) {
            closeMobileMenu();
        }
    });
    
    // Initialize ARIA attributes
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    mobileMenuBtn.setAttribute('aria-label', 'Open menu');
    mobileMenuBtn.setAttribute('aria-controls', 'navigation-menu');
    navMenu.setAttribute('id', 'navigation-menu');
    navMenu.setAttribute('aria-hidden', 'true');
}

// Active navigation highlighting
function initActiveNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id], .hero[id]');
    
    if (navLinks.length === 0 || sections.length === 0) return;
    
    // Set initial active state based on current URL
    const currentHash = window.location.hash;
    if (currentHash) {
        updateActiveLink(currentHash.substring(1));
    } else {
        // Default to first section or home
        const firstSection = document.querySelector('.hero') || sections[0];
        if (firstSection) {
            updateActiveLink(firstSection.id || 'home');
        }
    }
    
    // Update active link
    function updateActiveLink(sectionId) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            
            const href = link.getAttribute('href');
            if (href === `#${sectionId}`) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    }
    
    // Intersection Observer for automatic highlighting
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -20% 0px',
            threshold: [0.3, 0.5, 0.7]
        };
        
        const navigationObserver = new IntersectionObserver((entries) => {
            let mostVisibleEntry = null;
            let maxRatio = 0;
            
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
                    maxRatio = entry.intersectionRatio;
                    mostVisibleEntry = entry;
                }
            });
            
            if (mostVisibleEntry) {
                updateActiveLink(mostVisibleEntry.target.id);
                
                // Update URL without scrolling
                const newUrl = `${window.location.pathname}#${mostVisibleEntry.target.id}`;
                history.replaceState(null, null, newUrl);
            }
        }, observerOptions);
        
        sections.forEach(section => {
            if (section.id) {
                navigationObserver.observe(section);
            }
        });
    }
    
    // Manual click handling
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                const sectionId = href.substring(1);
                updateActiveLink(sectionId);
                
                // Track navigation event
                if (typeof trackEvent === 'function') {
                    trackEvent('Navigation', 'Click', link.textContent.trim());
                }
            }
        });
    });
}

// Navigation scroll behavior
function initNavigationScroll() {
    const header = document.querySelector('.header');
    const nav = document.querySelector('.navbar');
    
    if (!header) return;
    
    let lastScrollY = window.scrollY;
    let isScrollingDown = false;
    let scrollTimeout;
    
    const handleScroll = throttle(() => {
        const currentScrollY = window.scrollY;
        isScrollingDown = currentScrollY > lastScrollY;
        
        // Add scrolled class for styling
        if (currentScrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show navigation on scroll (only on mobile)
        if (window.innerWidth <= 768) {
            if (isScrollingDown && currentScrollY > 200) {
                header.classList.add('nav-hidden');
            } else if (!isScrollingDown) {
                header.classList.remove('nav-hidden');
            }
        }
        
        lastScrollY = currentScrollY;
        
        // Clear scroll timeout
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            header.classList.remove('nav-hidden');
        }, 150);
        
    }, 10);
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Reset navigation state on resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            header.classList.remove('nav-hidden');
        }
    });
}

// Dropdown menus (if needed for future expansion)
function initDropdownMenus() {
    const dropdownTriggers = document.querySelectorAll('.dropdown-trigger');
    
    dropdownTriggers.forEach(trigger => {
        const dropdown = trigger.nextElementSibling;
        if (!dropdown || !dropdown.classList.contains('dropdown-menu')) return;
        
        let isOpen = false;
        
        function openDropdown() {
            isOpen = true;
            trigger.classList.add('active');
            dropdown.classList.add('active');
            trigger.setAttribute('aria-expanded', 'true');
            dropdown.setAttribute('aria-hidden', 'false');
            
            // Focus first item
            const firstItem = dropdown.querySelector('a, button');
            if (firstItem) firstItem.focus();
        }
        
        function closeDropdown() {
            isOpen = false;
            trigger.classList.remove('active');
            dropdown.classList.remove('active');
            trigger.setAttribute('aria-expanded', 'false');
            dropdown.setAttribute('aria-hidden', 'true');
        }
        
        // Toggle on click
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            isOpen ? closeDropdown() : openDropdown();
        });
        
        // Open on hover (desktop only)
        if (!('ontouchstart' in window)) {
            trigger.addEventListener('mouseenter', openDropdown);
            trigger.parentElement.addEventListener('mouseleave', closeDropdown);
        }
        
        // Close on escape
        dropdown.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeDropdown();
                trigger.focus();
            }
        });
        
        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!trigger.parentElement.contains(e.target)) {
                closeDropdown();
            }
        });
        
        // Initialize ARIA attributes
        trigger.setAttribute('aria-expanded', 'false');
        trigger.setAttribute('aria-haspopup', 'true');
        dropdown.setAttribute('aria-hidden', 'true');
    });
}

// Keyboard navigation
function initKeyboardNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const focusableElements = document.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    
    // Trap focus in mobile menu when open
    document.addEventListener('keydown', (e) => {
        const mobileMenu = document.querySelector('.nav-menu.active');
        
        if (mobileMenu && e.key === 'Tab') {
            const focusableMenuElements = mobileMenu.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
            const firstElement = focusableMenuElements[0];
            const lastElement = focusableMenuElements[focusableMenuElements.length - 1];
            
            if (e.shiftKey) {
                // Shift + Tab
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                // Tab
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }
    });
    
    // Arrow key navigation for menu items
    navLinks.forEach((link, index) => {
        link.addEventListener('keydown', (e) => {
            let targetIndex;
            
            switch (e.key) {
                case 'ArrowRight':
                case 'ArrowDown':
                    e.preventDefault();
                    targetIndex = index === navLinks.length - 1 ? 0 : index + 1;
                    navLinks[targetIndex].focus();
                    break;
                    
                case 'ArrowLeft':
                case 'ArrowUp':
                    e.preventDefault();
                    targetIndex = index === 0 ? navLinks.length - 1 : index - 1;
                    navLinks[targetIndex].focus();
                    break;
                    
                case 'Home':
                    e.preventDefault();
                    navLinks[0].focus();
                    break;
                    
                case 'End':
                    e.preventDefault();
                    navLinks[navLinks.length - 1].focus();
                    break;
            }
        });
    });
    
    // Skip to content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link sr-only';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--primary-blue);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1000;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
        skipLink.classList.remove('sr-only');
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
        skipLink.classList.add('sr-only');
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main content id if it doesn't exist
    if (!document.getElementById('main-content')) {
        const main = document.querySelector('main') || document.querySelector('.hero');
        if (main) {
            main.id = 'main-content';
        }
    }
}

// Smooth scroll to section with offset for fixed header
function scrollToSection(sectionId, offset = 0) {
    const section = document.getElementById(sectionId);
    if (!section) return;
    
    const header = document.querySelector('.header');
    const headerHeight = header ? header.offsetHeight : 0;
    const sectionTop = section.offsetTop - headerHeight - offset;
    
    window.scrollTo({
        top: sectionTop,
        behavior: 'smooth'
    });
    
    // Update URL
    history.pushState(null, null, `#${sectionId}`);
    
    // Focus management for accessibility
    section.setAttribute('tabindex', '-1');
    section.focus();
    section.addEventListener('blur', () => {
        section.removeAttribute('tabindex');
    }, { once: true });
}

// Breadcrumb navigation (for future use)
function initBreadcrumb() {
    const breadcrumb = document.querySelector('.breadcrumb');
    if (!breadcrumb) return;
    
    const currentPage = document.title;
    const breadcrumbItems = breadcrumb.querySelectorAll('.breadcrumb-item');
    
    // Add current page to breadcrumb
    if (breadcrumbItems.length > 0) {
        const lastItem = breadcrumbItems[breadcrumbItems.length - 1];
        lastItem.textContent = currentPage;
        lastItem.setAttribute('aria-current', 'page');
    }
}

// Search functionality (placeholder for future implementation)
function initNavigationSearch() {
    const searchToggle = document.querySelector('.search-toggle');
    const searchForm = document.querySelector('.search-form');
    const searchInput = document.querySelector('.search-input');
    
    if (!searchToggle || !searchForm) return;
    
    searchToggle.addEventListener('click', () => {
        searchForm.classList.toggle('active');
        if (searchForm.classList.contains('active')) {
            searchInput.focus();
        }
    });
    
    // Close search on escape
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            searchForm.classList.remove('active');
            searchToggle.focus();
        }
    });
}

// Utility function for throttling
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

// Export navigation functions
window.Navigation = {
    init: initNavigation,
    scrollToSection: scrollToSection,
    closeMobileMenu: () => {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navMenu = document.querySelector('.nav-menu');
        if (mobileMenuBtn && navMenu && navMenu.classList.contains('active')) {
            mobileMenuBtn.click();
        }
    }
};

// Auto-initialize if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavigation);
} else {
    initNavigation();
}