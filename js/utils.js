/*!
 * Rawtracks Blogspot Theme - Utility Functions
 * Helper functions untuk Blogspot theme operations
 * GitHub: https://github.com/amatechx/themeprojblograw
 */

class RawtracksUtils {
    constructor() {
        this.initialized = false;
        this.init();
    }

    init() {
        if (this.initialized) return;
        
        this.setupEventDelegation();
        this.setupLazyLoading();
        this.setupImageOptimization();
        this.setupFormValidation();
        this.setupSocialSharing();
        this.setupPerformanceMonitoring();
        
        this.initialized = true;
        console.log('Rawtracks Utils initialized');
    }

    // ==================== DOM UTILITIES ====================
    
    $(selector, context = document) {
        return context.querySelector(selector);
    }

    $$(selector, context = document) {
        return Array.from(context.querySelectorAll(selector));
    }

    createElement(tag, attributes = {}, innerHTML = '') {
        const element = document.createElement(tag);
        Object.entries(attributes).forEach(([key, value]) => {
            element.setAttribute(key, value);
        });
        if (innerHTML) {
            element.innerHTML = innerHTML;
        }
        return element;
    }

    // ==================== EVENT DELEGATION ====================
    
    setupEventDelegation() {
        // Delegate click events for better performance
        document.addEventListener('click', (e) => {
            // Handle play buttons
            if (e.target.closest('.qodef-play-btn')) {
                e.preventDefault();
                if (window.rawtracksPlayer) {
                    window.rawtracksPlayer.togglePlay();
                }
            }

            // Handle navigation links
            if (e.target.closest('.qodef-nav a')) {
                const link = e.target.closest('a');
                if (link.getAttribute('href').startsWith('#')) {
                    e.preventDefault();
                    this.smoothScrollTo(link.getAttribute('href'));
                }
            }

            // Handle album items
            if (e.target.closest('.qodef-album-item')) {
                const albumItem = e.target.closest('.qodef-album-item');
                this.handleAlbumClick(albumItem);
            }
        });
    }

    // ==================== SMOOTH SCROLLING ====================
    
    smoothScrollTo(target, duration = 800) {
        const targetElement = typeof target === 'string' ? this.$(target) : target;
        
        if (!targetElement) return;

        const targetPosition = targetElement.offsetTop - 80; // Account for header
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        const animation = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = this.easeInOutQuart(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        };

        requestAnimationFrame(animation);
    }

    easeInOutQuart(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t * t * t + b;
        t -= 2;
        return -c / 2 * (t * t * t * t - 2) + b;
    }

    // ==================== LAZY LOADING ====================
    
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadImage(entry.target);
                        imageObserver.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: '50px'
            });

            this.$$('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        } else {
            // Fallback for older browsers
            this.$$('img[data-src]').forEach(img => {
                this.loadImage(img);
            });
        }
    }

    loadImage(img) {
        img.src = img.getAttribute('data-src');
        img.removeAttribute('data-src');
        img.classList.add('loaded');
    }

    // ==================== IMAGE OPTIMIZATION ====================
    
    setupImageOptimization() {
        // Add WebP support detection
        this.supportsWebP = this.detectWebP();
        
        // Optimize images based on device capabilities
        this.optimizeImages();
        
        // Setup responsive images
        this.setupResponsiveImages();
    }

    detectWebP() {
        const webP = new Image();
        webP.onload = webP.onerror = () => {
            document.documentElement.classList.add(webP.height === 2 ? 'webp-support' : 'no-webp');
        };
        webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    }

    optimizeImages() {
        this.$$('img').forEach(img => {
            if (this.supportsWebP) {
                const webpSrc = img.src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
                this.preloadImage(webpSrc, () => {
                    img.src = webpSrc;
                });
            }
        });
    }

    preloadImage(src, onLoad) {
        const img = new Image();
        img.onload = onLoad;
        img.src = src;
    }

    setupResponsiveImages() {
        this.$$('img[data-srcset]').forEach(img => {
            const srcset = img.getAttribute('data-srcset');
            const sizes = img.getAttribute('data-sizes') || '(max-width: 768px) 100vw, 50vw';
            
            img.setAttribute('srcset', srcset);
            img.setAttribute('sizes', sizes);
        });
    }

    // ==================== FORM VALIDATION ====================
    
    setupFormValidation() {
        // Email validation
        this.emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        // Phone validation (international format)
        this.phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        
        // Setup form handlers
        document.addEventListener('submit', (e) => {
            if (e.target.matches('form[data-validate]')) {
                this.validateForm(e.target);
            }
        });
    }

    validateForm(form) {
        const fields = this.$$('[data-validate]', form);
        let isValid = true;
        const errors = [];

        fields.forEach(field => {
            const type = field.getAttribute('data-validate');
            const value = field.value.trim();
            let fieldValid = true;
            let errorMessage = '';

            // Required validation
            if (field.hasAttribute('required') && !value) {
                fieldValid = false;
                errorMessage = 'This field is required';
            }

            // Type-specific validation
            if (value && fieldValid) {
                switch (type) {
                    case 'email':
                        if (!this.emailRegex.test(value)) {
                            fieldValid = false;
                            errorMessage = 'Please enter a valid email address';
                        }
                        break;
                    case 'phone':
                        if (!this.phoneRegex.test(value.replace(/\s/g, ''))) {
                            fieldValid = false;
                            errorMessage = 'Please enter a valid phone number';
                        }
                        break;
                    case 'url':
                        try {
                            new URL(value);
                        } catch {
                            fieldValid = false;
                            errorMessage = 'Please enter a valid URL';
                        }
                        break;
                }
            }

            // Display validation result
            this.displayFieldValidation(field, fieldValid, errorMessage);
            
            if (!fieldValid) {
                isValid = false;
                errors.push({ field, message: errorMessage });
            }
        });

        return { isValid, errors };
    }

    displayFieldValidation(field, isValid, message) {
        const errorElement = field.parentNode.querySelector('.field-error');
        
        if (isValid) {
            field.classList.remove('error');
            if (errorElement) errorElement.remove();
        } else {
            field.classList.add('error');
            if (!errorElement) {
                const error = this.createElement('div', {
                    class: 'field-error',
                    style: 'color: #e74c3c; font-size: 12px; margin-top: 5px;'
                }, message);
                field.parentNode.appendChild(error);
            } else {
                errorElement.textContent = message;
            }
        }
    }

    // ==================== SOCIAL SHARING ====================
    
    setupSocialSharing() {
        const shareButtons = this.$$('[data-share]');
        
        shareButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const platform = button.getAttribute('data-share');
                const url = button.getAttribute('data-url') || window.location.href;
                const title = button.getAttribute('data-title') || document.title;
                const text = button.getAttribute('data-text') || '';
                
                this.shareContent(platform, { url, title, text });
            });
        });
    }

    shareContent(platform, data) {
        const { url, title, text } = data;
        
        switch (platform) {
            case 'facebook':
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
                break;
            case 'twitter':
                window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
                break;
            case 'linkedin':
                window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
                break;
            case 'whatsapp':
                window.open(`https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`, '_blank');
                break;
            case 'copy':
                this.copyToClipboard(url);
                this.showNotification('Link copied to clipboard!');
                break;
            default:
                console.warn('Unknown sharing platform:', platform);
        }
    }

    copyToClipboard(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text);
        } else {
            // Fallback for older browsers
            const textArea = this.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        }
    }

    // ==================== NOTIFICATIONS ====================
    
    showNotification(message, type = 'info', duration = 3000) {
        const notification = this.createElement('div', {
            class: `qodef-notification qodef-notification-${type}`,
            style: `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${type === 'error' ? '#e74c3c' : type === 'success' ? '#27ae60' : '#3498db'};
                color: white;
                padding: 15px 20px;
                border-radius: 5px;
                z-index: 10000;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                opacity: 0;
                transform: translateX(100%);
                transition: all 0.3s ease;
            `
        }, message);

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 10);

        // Auto remove
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, duration);
    }

    // ==================== PERFORMANCE MONITORING ====================
    
    setupPerformanceMonitoring() {
        if ('performance' in window) {
            // Monitor page load performance
            window.addEventListener('load', () => {
                setTimeout(() => {
                    this.logPerformanceMetrics();
                }, 0);
            });
        }
    }

    logPerformanceMetrics() {
        const timing = performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        const domReady = timing.domContentLoadedEventEnd - timing.navigationStart;
        const firstPaint = performance.getEntriesByType('paint').find(entry => entry.name === 'first-paint');
        
        console.group('Rawtracks Performance Metrics');
        console.log('Page Load Time:', loadTime + 'ms');
        console.log('DOM Ready Time:', domReady + 'ms');
        if (firstPaint) {
            console.log('First Paint:', firstPaint.startTime + 'ms');
        }
        console.groupEnd();

        // Send to analytics if available
        if (window.gtag) {
            window.gtag('event', 'page_load_time', {
                custom_parameter: loadTime
            });
        }
    }

    // ==================== THEME CUSTOMIZATION ====================
    
    setupThemeCustomization() {
        // Color picker functionality
        const colorInputs = this.$$('input[type="color"]');
        colorInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                const color = e.target.value;
                const property = e.target.getAttribute('data-css-var') || '--qode-main-color';
                document.documentElement.style.setProperty(property, color);
                this.saveThemeSettings();
            });
        });

        // Load saved settings
        this.loadThemeSettings();
    }

    saveThemeSettings() {
        const styles = getComputedStyle(document.documentElement);
        const settings = {
            primaryColor: styles.getPropertyValue('--qode-main-color').trim(),
            backgroundColor: styles.getPropertyValue('--qode-page-background-color').trim(),
            textColor: styles.getPropertyValue('--qode-text-color').trim()
        };
        
        localStorage.setItem('rawtracks-theme', JSON.stringify(settings));
    }

    loadThemeSettings() {
        const saved = localStorage.getItem('rawtracks-theme');
        if (saved) {
            try {
                const settings = JSON.parse(saved);
                Object.entries(settings).forEach(([property, value]) => {
                    document.documentElement.style.setProperty(`--${property}`, value);
                });
            } catch (e) {
                console.warn('Failed to load theme settings:', e);
            }
        }
    }

    // ==================== ACCESSIBILITY ====================
    
    setupAccessibility() {
        // Skip link functionality
        const skipLink = this.$('.skip-link');
        if (skipLink) {
            skipLink.addEventListener('click', (e) => {
                e.preventDefault();
                const target = this.$(skipLink.getAttribute('href'));
                if (target) {
                    target.focus();
                    target.scrollIntoView();
                }
            });
        }

        // Keyboard navigation for custom components
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });

        // ARIA live regions for dynamic content
        this.setupLiveRegions();
    }

    setupLiveRegions() {
        const liveRegion = this.createElement('div', {
            'aria-live': 'polite',
            'aria-atomic': 'true',
            class: 'sr-only',
            style: `
                position: absolute;
                left: -10000px;
                width: 1px;
                height: 1px;
                overflow: hidden;
            `
        });
        document.body.appendChild(liveRegion);
        
        this.liveRegion = liveRegion;
    }

    announceToScreenReader(message) {
        if (this.liveRegion) {
            this.liveRegion.textContent = message;
            setTimeout(() => {
                this.liveRegion.textContent = '';
            }, 1000);
        }
    }

    // ==================== UTILITY METHODS ====================
    
    debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    }

    throttle(func, limit) {
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

    isMobile() {
        return window.innerWidth <= 768;
    }

    isTablet() {
        return window.innerWidth > 768 && window.innerWidth <= 1024;
    }

    isDesktop() {
        return window.innerWidth > 1024;
    }

    // ==================== COOKIE MANAGEMENT ====================
    
    setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    }

    getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    deleteCookie(name) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/`;
    }
}

// Initialize utilities when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    window.rawtracksUtils = new RawtracksUtils();
    
    // Setup theme customization
    window.rawtracksUtils.setupThemeCustomization();
    
    // Setup accessibility
    window.rawtracksUtils.setupAccessibility();
    
    console.log('Rawtracks Utils ready!');
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RawtracksUtils;
}