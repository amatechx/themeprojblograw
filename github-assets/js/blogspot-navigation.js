/**
 * Blogspot Navigation Module
 * Vanilla JavaScript implementation for Rawtracks template navigation
 * Compatible with Blogger/Blogspot platform
 */

(function(window) {
    'use strict';

    class BlogspotNavigation {
        constructor(options = {}) {
            this.options = {
                mobileBreakpoint: 1024,
                scrollOffset: 100,
                animationDuration: 300,
                ...options
            };

            this.body = document.body;
            this.html = document.documentElement;
            this.window = window;
            this.scrollY = 0;
            this.isMobile = false;

            this.init();
        }

        init() {
            this.checkMobile();
            this.initScrollToTop();
            this.initMobileMenu();
            this.initFullscreenMenu();
            this.initSideArea();
            this.initStickyHeader();
            this.initDropdownMenus();
            this.bindEvents();
        }

        checkMobile() {
            this.isMobile = window.innerWidth <= this.options.mobileBreakpoint;
        }

        bindEvents() {
            window.addEventListener('resize', () => {
                this.checkMobile();
                this.handleResize();
            });

            window.addEventListener('scroll', () => {
                this.scrollY = window.pageYOffset || document.documentElement.scrollTop;
                this.handleScroll();
            });

            // Close menus on escape
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeAllMenus();
                }
            });
        }

        // Scroll to Top functionality
        initScrollToTop() {
            const scrollTopBtn = document.querySelector('.qodef-back-to-top, #qodef-back-to-top');
            if (!scrollTopBtn) return;

            scrollTopBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.scrollToTop();
            });

            this.updateScrollToTopVisibility();
        }

        scrollToTop() {
            const start = this.scrollY;
            const duration = this.options.animationDuration;
            const startTime = performance.now();

            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Easing function (easeOutSine)
                const easeOutSine = 1 - Math.cos((progress * Math.PI) / 2);

                window.scrollTo(0, start * (1 - easeOutSine));

                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };

            requestAnimationFrame(animate);
        }

        updateScrollToTopVisibility() {
            const scrollTopBtn = document.querySelector('.qodef-back-to-top, #qodef-back-to-top');
            if (!scrollTopBtn) return;

            const threshold = window.innerHeight / 2;

            if (this.scrollY > threshold) {
                scrollTopBtn.classList.add('qodef--on');
                scrollTopBtn.classList.remove('qodef--off');
            } else {
                scrollTopBtn.classList.add('qodef--off');
                scrollTopBtn.classList.remove('qodef--on');
            }
        }

        // Mobile Menu functionality
        initMobileMenu() {
            const mobileMenuOpener = document.querySelector('.qodef-mobile-menu-opener');
            const mobileMenu = document.querySelector('.qodef-mobile-menu');

            if (!mobileMenuOpener || !mobileMenu) return;

            mobileMenuOpener.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleMobileMenu();
            });

            // Close on overlay click
            const overlay = mobileMenu.querySelector('.qodef-mobile-menu-overlay');
            if (overlay) {
                overlay.addEventListener('click', () => {
                    this.closeMobileMenu();
                });
            }

            // Handle submenu toggles
            const submenuItems = mobileMenu.querySelectorAll('.menu-item-has-children > a');
            submenuItems.forEach(item => {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.toggleMobileSubmenu(item.parentElement);
                });
            });
        }

        toggleMobileMenu() {
            const mobileMenu = document.querySelector('.qodef-mobile-menu');
            if (!mobileMenu) return;

            const isOpen = this.body.classList.contains('qodef-mobile-menu--opened');

            if (isOpen) {
                this.closeMobileMenu();
            } else {
                this.openMobileMenu();
            }
        }

        openMobileMenu() {
            this.body.classList.add('qodef-mobile-menu--opened');
            this.disableScroll();
        }

        closeMobileMenu() {
            this.body.classList.remove('qodef-mobile-menu--opened');
            this.enableScroll();
        }

        toggleMobileSubmenu(menuItem) {
            const submenu = menuItem.querySelector('.sub-menu');
            if (!submenu) return;

            const isOpen = menuItem.classList.contains('qodef--opened');

            if (isOpen) {
                submenu.style.height = '0px';
                menuItem.classList.remove('qodef--opened');
            } else {
                submenu.style.height = submenu.scrollHeight + 'px';
                menuItem.classList.add('qodef--opened');
            }
        }

        // Fullscreen Menu functionality
        initFullscreenMenu() {
            const fullscreenOpener = document.querySelector('.qodef-fullscreen-menu-opener');
            const fullscreenMenu = document.querySelector('#qodef-fullscreen-area');

            if (!fullscreenOpener || !fullscreenMenu) return;

            fullscreenOpener.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleFullscreenMenu();
            });

            // Close menu items
            const menuLinks = fullscreenMenu.querySelectorAll('nav ul li a');
            menuLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if (!link.parentElement.classList.contains('menu-item-has-children')) {
                        this.closeFullscreenMenu();
                    }
                });
            });

            // Handle submenu in fullscreen menu
            const submenuParents = fullscreenMenu.querySelectorAll('.menu-item-has-children > a');
            submenuParents.forEach(parent => {
                parent.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.toggleFullscreenSubmenu(parent.parentElement);
                });
            });
        }

        toggleFullscreenMenu() {
            const isOpen = this.body.classList.contains('qodef-fullscreen-menu--opened');

            if (isOpen) {
                this.closeFullscreenMenu();
            } else {
                this.openFullscreenMenu();
            }
        }

        openFullscreenMenu() {
            this.body.classList.remove('qodef-fullscreen-menu-animate--out');
            this.body.classList.add('qodef-fullscreen-menu--opened', 'qodef-fullscreen-menu-animate--in');
            this.disableScroll();
        }

        closeFullscreenMenu() {
            this.body.classList.remove('qodef-fullscreen-menu--opened', 'qodef-fullscreen-menu-animate--in');
            this.body.classList.add('qodef-fullscreen-menu-animate--out');
            this.enableScroll();
        }

        toggleFullscreenSubmenu(menuItem) {
            const submenu = menuItem.querySelector('.sub-menu');
            if (!submenu) return;

            const isOpen = menuItem.classList.contains('qodef--opened');

            if (isOpen) {
                submenu.style.display = 'none';
                menuItem.classList.remove('qodef--opened');
            } else {
                submenu.style.display = 'block';
                menuItem.classList.add('qodef--opened');
            }
        }

        // Side Area functionality
        initSideArea() {
            const sideAreaOpener = document.querySelector('.qodef-side-area-opener');
            const sideArea = document.querySelector('#qodef-side-area');
            const sideAreaClose = document.querySelector('#qodef-side-area-close');

            if (!sideAreaOpener || !sideArea) return;

            sideAreaOpener.addEventListener('click', (e) => {
                e.preventDefault();
                this.openSideArea();
            });

            if (sideAreaClose) {
                sideAreaClose.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.closeSideArea();
                });
            }

            // Close on overlay click
            this.createSideAreaOverlay();
        }

        createSideAreaOverlay() {
            const overlay = document.createElement('div');
            overlay.className = 'qodef-side-area-overlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 9998;
                display: none;
            `;
            document.body.appendChild(overlay);

            overlay.addEventListener('click', () => {
                this.closeSideArea();
            });

            this.sideAreaOverlay = overlay;
        }

        openSideArea() {
            this.body.classList.remove('qodef-side-area-animate--out');
            this.body.classList.add('qodef-side-area--opened', 'qodef-side-area-animate--in');

            if (this.sideAreaOverlay) {
                this.sideAreaOverlay.style.display = 'block';
            }
        }

        closeSideArea() {
            this.body.classList.remove('qodef-side-area--opened', 'qodef-side-area-animate--in');
            this.body.classList.add('qodef-side-area-animate--out');

            if (this.sideAreaOverlay) {
                this.sideAreaOverlay.style.display = 'none';
            }
        }

        // Sticky Header functionality
        initStickyHeader() {
            const header = document.querySelector('#qodef-page-header');
            if (!header) return;

            this.stickyHeader = header;
            this.handleScroll();
        }

        handleScroll() {
            if (!this.stickyHeader) return;

            const headerHeight = this.stickyHeader.offsetHeight;
            const scrollThreshold = headerHeight + 100;

            if (this.scrollY > scrollThreshold) {
                this.body.classList.add('qodef-header--sticky');
            } else {
                this.body.classList.remove('qodef-header--sticky');
            }

            this.updateScrollToTopVisibility();
        }

        // Dropdown Menus functionality
        initDropdownMenus() {
            const dropdownItems = document.querySelectorAll('.qodef-header-navigation > ul > li.menu-item-has-children');

            dropdownItems.forEach(item => {
                const link = item.querySelector('> a');
                const dropdown = item.querySelector('> .qodef-drop-down-second');

                if (!link || !dropdown) return;

                if (this.isMobile) {
                    // Mobile behavior - click to toggle
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        this.toggleDropdown(item);
                    });
                } else {
                    // Desktop behavior - hover
                    item.addEventListener('mouseenter', () => {
                        this.openDropdown(item);
                    });

                    item.addEventListener('mouseleave', () => {
                        this.closeDropdown(item);
                    });
                }
            });
        }

        toggleDropdown(item) {
            const isOpen = item.classList.contains('qodef--opened');

            if (isOpen) {
                this.closeDropdown(item);
            } else {
                this.closeAllDropdowns();
                this.openDropdown(item);
            }
        }

        openDropdown(item) {
            const dropdown = item.querySelector('.qodef-drop-down-second');
            if (!dropdown) return;

            item.classList.add('qodef--opened');
            dropdown.style.display = 'block';
            dropdown.style.opacity = '1';
            dropdown.style.visibility = 'visible';
        }

        closeDropdown(item) {
            const dropdown = item.querySelector('.qodef-drop-down-second');
            if (!dropdown) return;

            item.classList.remove('qodef--opened');
            dropdown.style.display = 'none';
            dropdown.style.opacity = '0';
            dropdown.style.visibility = 'hidden';
        }

        closeAllDropdowns() {
            const openDropdowns = document.querySelectorAll('.qodef-header-navigation > ul > li.qodef--opened');
            openDropdowns.forEach(item => {
                this.closeDropdown(item);
            });
        }

        // Utility methods
        handleResize() {
            this.checkMobile();

            // Re-initialize dropdown menus for new screen size
            if (this.isMobile) {
                this.closeAllDropdowns();
            }

            // Update sticky header
            this.handleScroll();
        }

        closeAllMenus() {
            this.closeMobileMenu();
            this.closeFullscreenMenu();
            this.closeSideArea();
            this.closeAllDropdowns();
        }

        disableScroll() {
            const scrollY = window.scrollY;
            this.body.style.position = 'fixed';
            this.body.style.top = `-${scrollY}px`;
            this.body.style.width = '100%';
            this.scrollPosition = scrollY;
        }

        enableScroll() {
            this.body.style.position = '';
            this.body.style.top = '';
            this.body.style.width = '';
            window.scrollTo(0, this.scrollPosition || 0);
        }

        // Smooth scroll to element
        scrollToElement(selector, offset = 0) {
            const element = document.querySelector(selector);
            if (!element) return;

            const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
            const targetPosition = elementTop - offset;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }

        // Add smooth scroll to anchor links
        initSmoothScroll() {
            const anchorLinks = document.querySelectorAll('a[href^="#"]');

            anchorLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    const href = link.getAttribute('href');

                    if (href === '#') return;

                    const target = document.querySelector(href);
                    if (target) {
                        e.preventDefault();
                        this.scrollToElement(href, 100); // 100px offset for header
                    }
                });
            });
        }
    }

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        window.blogspotNavigation = new BlogspotNavigation();
    });

    // Make class globally available
    window.BlogspotNavigation = BlogspotNavigation;

})(window);