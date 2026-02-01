/**
 * Animations Module
 * Handles scroll animations, skill bar animations, and other visual effects
 */

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        scrollOffset: 100,
        skillBarDelay: 200,
        counterDuration: 2000,
        typingSpeed: 50,
        typingDelay: 1000
    };

    /**
     * Initialize AOS (Animate On Scroll) library
     */
    function initAOS() {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-out-cubic',
                once: true,
                offset: 100,
                delay: 0,
                disable: function() {
                    // Disable on mobile for better performance
                    return window.innerWidth < 768 && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                }
            });
        }
    }

    /**
     * Initialize skill bar animations
     */
    function initSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        
        if (!skillBars.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const width = bar.getAttribute('data-width');
                    
                    // Stagger animations
                    setTimeout(() => {
                        bar.style.width = width + '%';
                    }, index * CONFIG.skillBarDelay);
                    
                    observer.unobserve(bar);
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '0px'
        });

        skillBars.forEach(bar => observer.observe(bar));
    }

    /**
     * Initialize counter animations
     */
    function initCounters() {
        const counters = document.querySelectorAll('.counter');
        
        if (!counters.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-target'));
                    const duration = CONFIG.counterDuration;
                    const step = target / (duration / 16);
                    let current = 0;

                    const updateCounter = () => {
                        current += step;
                        if (current < target) {
                            counter.textContent = Math.floor(current);
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.textContent = target;
                        }
                    };

                    updateCounter();
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));
    }

    /**
     * Initialize typing animation for hero section
     */
    function initTypingAnimation() {
        const typingElement = document.querySelector('.typing-text');
        
        if (!typingElement) return;

        const roles = [
            'Web Developer',
            'PHP & Laravel Expert',
            'API Developer',
            'Full Stack Developer'
        ];

        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function type() {
            const currentRole = roles[roleIndex];
            
            if (isDeleting) {
                typingElement.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingElement.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
            }

            let typeSpeed = isDeleting ? CONFIG.typingSpeed / 2 : CONFIG.typingSpeed;

            if (!isDeleting && charIndex === currentRole.length) {
                typeSpeed = CONFIG.typingDelay;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typeSpeed = 500;
            }

            setTimeout(type, typeSpeed);
        }

        // Start typing animation
        setTimeout(type, CONFIG.typingDelay);
    }

    /**
     * Initialize scroll reveal animations (fallback for browsers without AOS)
     */
    function initScrollReveal() {
        // Skip if AOS is available
        if (typeof AOS !== 'undefined') return;

        const revealElements = document.querySelectorAll('.reveal, [data-aos]');
        
        if (!revealElements.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => observer.observe(el));
    }

    /**
     * Initialize parallax effect for hero section
     */
    function initParallax() {
        const heroSection = document.querySelector('.hero-section');
        const orbs = document.querySelectorAll('.gradient-orb');
        
        if (!heroSection || !orbs.length) return;

        // Skip on touch devices
        if (window.matchMedia('(pointer: coarse)').matches) return;

        let ticking = false;

        function updateParallax() {
            const scrollY = window.pageYOffset;
            const heroHeight = heroSection.offsetHeight;
            
            if (scrollY < heroHeight) {
                orbs.forEach((orb, index) => {
                    const speed = 0.1 + (index * 0.05);
                    const yPos = scrollY * speed;
                    orb.style.transform = `translateY(${yPos}px)`;
                });
            }
            
            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }, { passive: true });
    }

    /**
     * Initialize floating card animations with random delays
     */
    function initFloatingCards() {
        const cards = document.querySelectorAll('.floating-card');
        
        cards.forEach((card, index) => {
            // Add random animation delay for more organic feel
            const randomDelay = Math.random() * -3;
            card.style.animationDelay = `${randomDelay}s`;
        });
    }

    /**
     * Initialize project filter functionality
     */
    function initProjectFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const projectItems = document.querySelectorAll('.project-item');

        if (!filterBtns.length || !projectItems.length) return;

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active button
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.getAttribute('data-filter');

                // Filter projects
                projectItems.forEach(item => {
                    const category = item.getAttribute('data-category');
                    
                    if (filter === 'all' || category === filter) {
                        item.style.display = 'block';
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(20px)';
                        
                        // Animate in
                        setTimeout(() => {
                            item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(20px)';
                        
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 400);
                    }
                });
            });
        });
    }

    /**
     * Initialize smooth scroll for anchor links
     */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                if (href === '#') return;
                
                const target = document.querySelector(href);
                
                if (target) {
                    e.preventDefault();
                    
                    const navHeight = document.querySelector('.navbar').offsetHeight;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Update URL without jumping
                    history.pushState(null, null, href);
                }
            });
        });
    }

    /**
     * Initialize navbar scroll effect
     */
    function initNavbarScroll() {
        const navbar = document.querySelector('.navbar');
        
        if (!navbar) return;

        let lastScroll = 0;
        let ticking = false;

        function updateNavbar() {
            const currentScroll = window.pageYOffset;
            
            // Add/remove scrolled class
            if (currentScroll > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // Hide/show navbar on scroll direction (optional)
            if (currentScroll > lastScroll && currentScroll > 500) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }

            lastScroll = currentScroll;
            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateNavbar);
                ticking = true;
            }
        }, { passive: true });
    }

    /**
     * Initialize intersection observer for section highlighting
     */
    function initSectionHighlight() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

        if (!sections.length || !navLinks.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, {
            rootMargin: '-50% 0px -50% 0px',
            threshold: 0
        });

        sections.forEach(section => observer.observe(section));
    }

    /**
     * Initialize preloader
     */
    function initPreloader() {
        const preloader = document.getElementById('preloader');
        
        if (!preloader) return;

        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('hidden');
                
                // Remove from DOM after animation
                setTimeout(() => {
                    preloader.remove();
                }, 500);
            }, 500);
        });
    }

    /**
     * Initialize back to top button
     */
    function initBackToTop() {
        const backToTop = document.getElementById('backToTop');
        
        if (!backToTop) return;

        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }, { passive: true });

        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /**
     * Initialize all animations
     */
    function init() {
        initPreloader();
        initAOS();
        initSkillBars();
        initCounters();
        initTypingAnimation();
        initScrollReveal();
        initParallax();
        initFloatingCards();
        initProjectFilters();
        initSmoothScroll();
        initNavbarScroll();
        initSectionHighlight();
        initBackToTop();
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Re-initialize AOS on window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (typeof AOS !== 'undefined') {
                AOS.refresh();
            }
        }, 250);
    });

})();
