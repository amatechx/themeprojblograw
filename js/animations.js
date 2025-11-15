/*!
 * Rawtracks Blogspot Theme - Scroll Animations & Effects
 * Lightweight animation library sebagai replacement qodefAddonsCore
 * GitHub: https://github.com/amatechx/themeprojblograw
 */

class RawtracksAnimations {
    constructor(options = {}) {
        this.options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px',
            duration: 800,
            easing: 'cubic-bezier(0.25, 0.8, 0.25, 1)',
            ...options
        };

        this.observers = new Map();
        this.animatedElements = new Set();
        this.isInitialized = false;
        
        this.init();
    }

    init() {
        if (this.isInitialized) return;
        
        this.createObservers();
        this.observeElements();
        this.setupScrollEffects();
        this.setupParallax();
        this.setupHoverEffects();
        
        this.isInitialized = true;
        console.log('Rawtracks Animations initialized');
    }

    createObservers() {
        // Fade in observer
        this.observers.set('fadeIn', new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target, 'fadeIn');
                    this.observers.get('fadeIn').unobserve(entry.target);
                }
            });
        }, this.options));

        // Slide up observer
        this.observers.set('slideUp', new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target, 'slideUp');
                    this.observers.get('slideUp').unobserve(entry.target);
                }
            });
        }, { ...this.options, rootMargin: '0px 0px -100px 0px' }));

        // Scale observer
        this.observers.set('scaleIn', new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target, 'scaleIn');
                    this.observers.get('scaleIn').unobserve(entry.target);
                }
            });
        }, this.options));
    }

    observeElements() {
        // Auto-observe elements with animation classes
        const elements = document.querySelectorAll(`
            [class*="qodef-animate"],
            [class*="fade-in"],
            [class*="slide-up"],
            [class*="scale-in"],
            .qodef-album-item,
            .qodef-blog-post,
            .qodef-audio-player
        `);

        elements.forEach(el => {
            if (el.classList.contains('qodef-animate-fade-in') || 
                el.classList.contains('fade-in')) {
                this.observers.get('fadeIn').observe(el);
            } else if (el.classList.contains('qodef-animate-slide-up') || 
                       el.classList.contains('slide-up')) {
                this.observers.get('slideUp').observe(el);
            } else if (el.classList.contains('qodef-animate-scale-in') || 
                       el.classList.contains('scale-in')) {
                this.observers.get('scaleIn').observe(el);
            } else {
                // Default animation for certain elements
                if (el.classList.contains('qodef-album-item') || 
                    el.classList.contains('qodef-blog-post')) {
                    this.observers.get('slideUp').observe(el);
                }
            }
        });
    }

    animateElement(element, animationType) {
        if (this.animatedElements.has(element)) return;

        element.style.willChange = 'transform, opacity';
        
        switch (animationType) {
            case 'fadeIn':
                this.fadeIn(element);
                break;
            case 'slideUp':
                this.slideUp(element);
                break;
            case 'scaleIn':
                this.scaleIn(element);
                break;
            default:
                this.slideUp(element);
        }
    }

    fadeIn(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(0)';
        
        element.offsetHeight; // Force reflow
        
        element.style.transition = `opacity ${this.options.duration}ms ${this.options.easing}`;
        element.style.opacity = '1';
        
        setTimeout(() => {
            element.style.willChange = 'auto';
            this.animatedElements.add(element);
        }, this.options.duration);
    }

    slideUp(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(40px)';
        
        element.offsetHeight; // Force reflow
        
        element.style.transition = `all ${this.options.duration}ms ${this.options.easing}`;
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
        
        setTimeout(() => {
            element.style.willChange = 'auto';
            this.animatedElements.add(element);
        }, this.options.duration);
    }

    scaleIn(element) {
        element.style.opacity = '0';
        element.style.transform = 'scale(0.8)';
        
        element.offsetHeight; // Force reflow
        
        element.style.transition = `all ${this.options.duration}ms ${this.options.easing}`;
        element.style.opacity = '1';
        element.style.transform = 'scale(1)';
        
        setTimeout(() => {
            element.style.willChange = 'auto';
            this.animatedElements.add(element);
        }, this.options.duration);
    }

    setupScrollEffects() {
        let ticking = false;

        const updateScrollEffects = () => {
            const scrollY = window.pageYOffset;
            const windowHeight = window.innerHeight;
            
            // Header hide/show on scroll
            const header = document.querySelector('.qodef-header');
            if (header) {
                if (scrollY > 100) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }

            // Parallax elements
            const parallaxElements = document.querySelectorAll('[data-parallax]');
            parallaxElements.forEach(el => {
                const speed = parseFloat(el.getAttribute('data-parallax')) || 0.5;
                const yPos = -(scrollY * speed);
                el.style.transform = `translateY(${yPos}px)`;
            });

            ticking = false;
        };

        const requestScrollUpdate = () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollEffects);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestScrollUpdate, { passive: true });
    }

    setupParallax() {
        const parallaxElements = document.querySelectorAll('.qodef-parallax');
        
        parallaxElements.forEach(element => {
            const speed = element.getAttribute('data-speed') || 0.5;
            element.style.transform = `translateY(0)`;
            element.setAttribute('data-parallax-speed', speed);
        });
    }

    setupHoverEffects() {
        // Album items hover effects
        const albumItems = document.querySelectorAll('.qodef-album-item');
        albumItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'translateY(-12px) scale(1.02)';
                item.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.4)';
            });

            item.addEventListener('mouseleave', () => {
                item.style.transform = '';
                item.style.boxShadow = '';
            });
        });

        // Button hover effects
        const buttons = document.querySelectorAll('.qodef-play-btn');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                if (!button.classList.contains('playing')) {
                    button.style.transform = 'scale(1.1)';
                }
            });

            button.addEventListener('mouseleave', () => {
                if (!button.classList.contains('playing')) {
                    button.style.transform = '';
                }
            });
        });
    }

    // Public methods
    observeElement(element, animationType = 'slideUp') {
        const observer = this.observers.get(animationType);
        if (observer) {
            observer.observe(element);
        }
    }

    animateCustom(element, keyframes, options = {}) {
        const defaultOptions = {
            duration: this.options.duration,
            easing: this.options.easing,
            fill: 'forwards'
        };

        return element.animate(keyframes, { ...defaultOptions, ...options });
    }

    staggerAnimation(elements, animationType = 'fadeIn', staggerDelay = 100) {
        elements.forEach((element, index) => {
            setTimeout(() => {
                this.animateElement(element, animationType);
            }, index * staggerDelay);
        });
    }

    // Utility methods
    easeInOut(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    lerp(start, end, factor) {
        return start + (end - start) * factor;
    }

    // Performance monitoring
    measurePerformance() {
        if ('performance' in window) {
            const measure = performance.measure('rawtracks-animation');
            console.log('Animation performance:', measure);
        }
    }
}

// Scroll progress indicator
class ScrollProgress {
    constructor() {
        this.progressBar = null;
        this.createProgressBar();
        this.bindEvents();
    }

    createProgressBar() {
        this.progressBar = document.createElement('div');
        this.progressBar.className = 'qodef-scroll-progress';
        this.progressBar.innerHTML = '<div class="qodef-scroll-progress-fill"></div>';
        
        // Add styles
        const styles = `
            .qodef-scroll-progress {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 3px;
                background: rgba(255, 255, 255, 0.1);
                z-index: 9999;
                pointer-events: none;
            }
            
            .qodef-scroll-progress-fill {
                height: 100%;
                background: linear-gradient(90deg, var(--qode-main-color), #f4b860);
                width: 0%;
                transition: width 0.1s ease;
            }
        `;
        
        if (!document.querySelector('#rawtracks-scroll-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'rawtracks-scroll-styles';
            styleSheet.textContent = styles;
            document.head.appendChild(styleSheet);
        }
        
        document.body.appendChild(this.progressBar);
    }

    bindEvents() {
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            
            const progressFill = this.progressBar.querySelector('.qodef-scroll-progress-fill');
            if (progressFill) {
                progressFill.style.width = `${Math.min(scrollPercent, 100)}%`;
            }
        }, { passive: true });
    }
}

// Page transition effects
class PageTransitions {
    constructor() {
        this.isEnabled = true;
        this.transitionDuration = 300;
    }

    fadeOut(callback) {
        document.body.style.opacity = '0';
        document.body.style.transition = `opacity ${this.transitionDuration}ms ease`;
        
        setTimeout(() => {
            if (callback) callback();
            document.body.style.opacity = '1';
        }, this.transitionDuration);
    }

    slideOut(direction = 'left', callback) {
        const slides = document.querySelectorAll('.qodef-slide');
        slides.forEach((slide, index) => {
            const delay = index * 100;
            setTimeout(() => {
                slide.style.transform = `translateX(${direction === 'left' ? '-100%' : '100%'})`;
                slide.style.opacity = '0';
            }, delay);
        });

        setTimeout(() => {
            if (callback) callback();
        }, slides.length * 100 + this.transitionDuration);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize main animation system
    window.rawtracksAnimations = new RawtracksAnimations();
    
    // Initialize scroll progress indicator
    window.rawtracksScrollProgress = new ScrollProgress();
    
    // Initialize page transitions
    window.rawtracksTransitions = new PageTransitions();
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    console.log('Rawtracks Animation System ready!');
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { RawtracksAnimations, ScrollProgress, PageTransitions };
}