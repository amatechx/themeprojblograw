/**
 * Blogspot Animations Module
 * GSAP-based animations for Rawtracks template
 * Compatible with Blogger/Blogspot platform
 */

(function(window) {
    'use strict';

    // Check if GSAP is loaded
    if (typeof gsap === 'undefined') {
        console.warn('GSAP is not loaded. Animations module requires GSAP library.');
        return;
    }

    class BlogspotAnimations {
        constructor(options = {}) {
            this.options = {
                enableScrollTrigger: true,
                defaultDuration: 0.8,
                defaultEase: 'power2.out',
                staggerDelay: 0.1,
                ...options
            };

            this.animations = new Map();
            this.observers = new Map();

            // Register ScrollTrigger if available
            if (this.options.enableScrollTrigger && typeof ScrollTrigger !== 'undefined') {
                gsap.registerPlugin(ScrollTrigger);
            }

            this.init();
        }

        init() {
            this.initOnScrollAnimations();
            this.initParallaxEffects();
            this.initDistortionEffects();
            this.initBackgroundText();
            this.initTextMarquee();
            this.bindEvents();
        }

        bindEvents() {
            // Re-initialize on resize
            window.addEventListener('resize', () => {
                this.refreshAnimations();
            });

            // Handle page load
            window.addEventListener('load', () => {
                this.refreshAnimations();
            });
        }

        // Initialize scroll-triggered animations
        initOnScrollAnimations() {
            const animatedElements = document.querySelectorAll('[data-animation]');

            animatedElements.forEach(element => {
                const animationType = element.getAttribute('data-animation');
                const delay = parseFloat(element.getAttribute('data-animation-delay')) || 0;
                const duration = parseFloat(element.getAttribute('data-animation-duration')) || this.options.defaultDuration;

                this.createScrollAnimation(element, animationType, { delay, duration });
            });
        }

        createScrollAnimation(element, type, options = {}) {
            const { delay = 0, duration = this.options.defaultDuration } = options;

            let animation;

            switch (type) {
                case 'fadeIn':
                    animation = gsap.fromTo(element,
                        { opacity: 0 },
                        {
                            opacity: 1,
                            duration: duration,
                            delay: delay,
                            ease: this.options.defaultEase
                        }
                    );
                    break;

                case 'fadeInUp':
                    animation = gsap.fromTo(element,
                        { opacity: 0, y: 50 },
                        {
                            opacity: 1,
                            y: 0,
                            duration: duration,
                            delay: delay,
                            ease: this.options.defaultEase
                        }
                    );
                    break;

                case 'fadeInDown':
                    animation = gsap.fromTo(element,
                        { opacity: 0, y: -50 },
                        {
                            opacity: 1,
                            y: 0,
                            duration: duration,
                            delay: delay,
                            ease: this.options.defaultEase
                        }
                    );
                    break;

                case 'fadeInLeft':
                    animation = gsap.fromTo(element,
                        { opacity: 0, x: -50 },
                        {
                            opacity: 1,
                            x: 0,
                            duration: duration,
                            delay: delay,
                            ease: this.options.defaultEase
                        }
                    );
                    break;

                case 'fadeInRight':
                    animation = gsap.fromTo(element,
                        { opacity: 0, x: 50 },
                        {
                            opacity: 1,
                            x: 0,
                            duration: duration,
                            delay: delay,
                            ease: this.options.defaultEase
                        }
                    );
                    break;

                case 'slideInUp':
                    animation = gsap.fromTo(element,
                        { y: 100 },
                        {
                            y: 0,
                            duration: duration,
                            delay: delay,
                            ease: this.options.defaultEase
                        }
                    );
                    break;

                case 'scaleIn':
                    animation = gsap.fromTo(element,
                        { scale: 0 },
                        {
                            scale: 1,
                            duration: duration,
                            delay: delay,
                            ease: this.options.defaultEase
                        }
                    );
                    break;

                case 'rotateIn':
                    animation = gsap.fromTo(element,
                        { rotation: -180, scale: 0 },
                        {
                            rotation: 0,
                            scale: 1,
                            duration: duration,
                            delay: delay,
                            ease: this.options.defaultEase
                        }
                    );
                    break;

                default:
                    console.warn(`Unknown animation type: ${type}`);
                    return;
            }

            this.animations.set(element, animation);
        }

        // Parallax effects
        initParallaxEffects() {
            const parallaxElements = document.querySelectorAll('[data-parallax]');

            parallaxElements.forEach(element => {
                const parallaxData = element.getAttribute('data-parallax');

                if (parallaxData) {
                    try {
                        const config = JSON.parse(parallaxData);
                        this.createParallaxEffect(element, config);
                    } catch (e) {
                        console.warn('Invalid parallax data:', parallaxData);
                    }
                }
            });
        }

        createParallaxEffect(element, config) {
            const { y = 0, smoothness = 30 } = config;

            gsap.to(element, {
                y: y,
                ease: 'none',
                scrollTrigger: {
                    trigger: element,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: smoothness / 10,
                    invalidateOnRefresh: true
                }
            });
        }

        // Distortion effects (SVG filters)
        initDistortionEffects() {
            const distortionElements = document.querySelectorAll('.qodef--distort-animation');

            distortionElements.forEach(element => {
                this.createDistortionEffect(element);
            });
        }

        createDistortionEffect(element) {
            // Create SVG filter if it doesn't exist
            if (!element.querySelector('.qodef-svg-distort-filter')) {
                const svgFilter = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                svgFilter.className = 'qodef-svg-distort-filter';
                svgFilter.setAttribute('width', '100%');
                svgFilter.setAttribute('height', '100%');

                const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
                filter.setAttribute('id', `qodef-svg-distort-${Date.now()}`);
                filter.setAttribute('x', '-25%');
                filter.setAttribute('y', '-25%');
                filter.setAttribute('width', '150%');
                filter.setAttribute('height', '150%');

                const turbulence = document.createElementNS('http://www.w3.org/2000/svg', 'feTurbulence');
                turbulence.setAttribute('type', 'fractalNoise');
                turbulence.setAttribute('baseFrequency', '0.06 0.04');
                turbulence.setAttribute('numOctaves', '5');
                turbulence.setAttribute('seed', '2');

                const displacement = document.createElementNS('http://www.w3.org/2000/svg', 'feDisplacementMap');
                displacement.setAttribute('xChannelSelector', 'R');
                displacement.setAttribute('yChannelSelector', 'G');
                displacement.setAttribute('scale', '0');

                filter.appendChild(turbulence);
                filter.appendChild(displacement);
                svgFilter.appendChild(filter);
                element.appendChild(svgFilter);

                // Create animation timeline
                const timeline = gsap.timeline({
                    paused: true,
                    defaults: {
                        duration: 0.8,
                        ease: 'power1.out'
                    }
                });

                const displacementMap = displacement;
                let val = { scale: 0 };

                timeline.to(val, {
                    scale: 15,
                    onUpdate: () => {
                        displacementMap.setAttribute('scale', val.scale);
                    }
                });

                element.distortionTimeline = timeline;
                element.filterId = filter.id;
            }

            // Setup intersection observer for automatic triggering
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        element.distortionTimeline.restart();
                    }
                });
            });

            observer.observe(element);
            this.observers.set(element, observer);
        }

        // Background text animations
        initBackgroundText() {
            const backgroundTexts = document.querySelectorAll('.qodef-background-text');

            backgroundTexts.forEach(element => {
                this.createBackgroundTextAnimation(element);
            });
        }

        createBackgroundTextAnimation(element) {
            const textElement = element.querySelector('.qodef-m-background-text');
            if (!textElement) return;

            // Responsive font sizing based on data attributes
            const updateSize = () => {
                const windowWidth = window.innerWidth;
                let size = 100; // default

                if (windowWidth <= 3840 && windowWidth >= 1441) {
                    size = textElement.getAttribute('data-size-3840') || 100;
                } else if (windowWidth <= 1440 && windowWidth >= 1367) {
                    size = textElement.getAttribute('data-size-1440') || 100;
                } else if (windowWidth <= 1366 && windowWidth >= 1025) {
                    size = textElement.getAttribute('data-size-1366') || 100;
                } else if (windowWidth <= 1024 && windowWidth >= 1) {
                    size = textElement.getAttribute('data-size-1024') || 100;
                }

                textElement.style.fontSize = `${size}px`;
            };

            updateSize();
            window.addEventListener('resize', updateSize);

            // Initial animation
            gsap.fromTo(textElement,
                { opacity: 0, scale: 0.8 },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 1.5,
                    delay: 0.5,
                    ease: 'power2.out'
                }
            );
        }

        // Text marquee animations
        initTextMarquee() {
            const marquees = document.querySelectorAll('.qodef-text-marquee');

            marquees.forEach(element => {
                this.createTextMarquee(element);
            });
        }

        createTextMarquee(element) {
            const textElements = element.querySelectorAll('.qodef-m-text');

            textElements.forEach(textElement => {
                textElement.x = 0;
                this.animateMarquee(element, textElement);
            });

            // Responsive font sizing
            this.makeMarqueeResponsive(element);
        }

        animateMarquee(container, textElement) {
            const animate = () => {
                if (!this.isElementInViewport(container)) {
                    requestAnimationFrame(animate);
                    return;
                }

                textElement.style.transform = `translate3d(${textElement.x}%, 0, 0)`;
                textElement.x -= 0.05;

                if (textElement.x < -100) {
                    textElement.x = 100;
                }

                requestAnimationFrame(animate);
            };

            animate();
        }

        makeMarqueeResponsive(element) {
            const content = element.querySelector('.qodef-m-content');
            if (!content) return;

            const updateResponsive = () => {
                const windowWidth = window.innerWidth;
                let fontSize = 60; // default
                let lineHeight = 1.2;

                if (windowWidth < 1480) fontSize *= 0.8;
                if (windowWidth < 1200) fontSize *= 0.7;
                if (windowWidth < 768) {
                    fontSize *= 0.55;
                    lineHeight = 1.1;
                }
                if (windowWidth < 600) {
                    fontSize *= 0.45;
                    lineHeight = 1.0;
                }
                if (windowWidth < 480) {
                    fontSize *= 0.4;
                    lineHeight = 0.9;
                }

                content.style.fontSize = `${fontSize}px`;
                content.style.lineHeight = lineHeight;
            };

            updateResponsive();
            window.addEventListener('resize', updateResponsive);
        }

        isElementInViewport(element) {
            const rect = element.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        }

        // Stagger animations for multiple elements
        animateStagger(elements, properties, options = {}) {
            const { delay = 0, stagger = this.options.staggerDelay } = options;

            gsap.fromTo(elements, properties.from, {
                ...properties.to,
                delay: delay,
                stagger: stagger,
                ease: this.options.defaultEase
            });
        }

        // Hover animations
        addHoverAnimation(element, hoverProps, options = {}) {
            const { duration = 0.3 } = options;

            element.addEventListener('mouseenter', () => {
                gsap.to(element, {
                    ...hoverProps,
                    duration: duration,
                    ease: this.options.defaultEase
                });
            });

            element.addEventListener('mouseleave', () => {
                gsap.to(element, {
                    ...hoverProps.reset,
                    duration: duration,
                    ease: this.options.defaultEase
                });
            });
        }

        // Refresh all animations (useful after DOM changes)
        refreshAnimations() {
            // Kill existing animations
            this.animations.forEach(animation => {
                animation.kill();
            });
            this.animations.clear();

            // Disconnect observers
            this.observers.forEach(observer => {
                observer.disconnect();
            });
            this.observers.clear();

            // Re-initialize
            this.init();
        }

        // Utility method to create custom animations
        createCustomAnimation(element, fromProps, toProps, options = {}) {
            const { trigger, start = 'top center', end = 'bottom center', scrub = false } = options;

            const animation = gsap.fromTo(element, fromProps, {
                ...toProps,
                ease: this.options.defaultEase
            });

            if (trigger && typeof ScrollTrigger !== 'undefined') {
                ScrollTrigger.create({
                    trigger: trigger,
                    start: start,
                    end: end,
                    scrub: scrub,
                    animation: animation
                });
            }

            this.animations.set(element, animation);
            return animation;
        }

        // Destroy all animations
        destroy() {
            this.animations.forEach(animation => {
                animation.kill();
            });
            this.animations.clear();

            this.observers.forEach(observer => {
                observer.disconnect();
            });
            this.observers.clear();

            // Kill all ScrollTrigger instances
            if (typeof ScrollTrigger !== 'undefined') {
                ScrollTrigger.killAll();
            }
        }
    }

    // Initialize when DOM is ready and GSAP is loaded
    const initAnimations = () => {
        if (typeof gsap !== 'undefined') {
            window.blogspotAnimations = new BlogspotAnimations();
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAnimations);
    } else {
        initAnimations();
    }

    // Make class globally available
    window.BlogspotAnimations = BlogspotAnimations;

})(window);