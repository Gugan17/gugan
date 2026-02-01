/**
 * Main JavaScript Module
 * Core functionality for the portfolio website
 */

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        toastDuration: 3000,
        formEndpoint: '#', // Replace with actual endpoint
        debounceDelay: 100
    };

    /**
     * Utility: Debounce function
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Utility: Throttle function
     */
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Show toast notification
     */
    function showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const toastMessage = toast?.querySelector('.toast-message');
        const toastIcon = toast?.querySelector('i');

        if (!toast || !toastMessage) return;

        // Update message
        toastMessage.textContent = message;

        // Update icon based on type
        if (toastIcon) {
            toastIcon.className = type === 'success' 
                ? 'bi bi-check-circle-fill' 
                : 'bi bi-exclamation-circle-fill';
            toastIcon.style.color = type === 'success' 
                ? 'var(--success-color)' 
                : 'var(--error-color)';
        }

        // Show toast
        toast.classList.add('show');

        // Hide after duration
        setTimeout(() => {
            toast.classList.remove('show');
        }, CONFIG.toastDuration);
    }

    /**
     * Initialize contact form
     */
    function initContactForm() {
        const form = document.getElementById('contactForm');
        
        if (!form) return;

        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            // Basic validation
            if (!data.name || !data.email || !data.subject || !data.message) {
                showToast('Please fill in all fields', 'error');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                showToast('Please enter a valid email address', 'error');
                return;
            }

            // Show loading state
            const submitBtn = form.querySelector('.btn-submit');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Sending...';
            submitBtn.disabled = true;

            try {
                // Simulate form submission (replace with actual API call)
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Show success message
                showToast('Message sent successfully! I\'ll get back to you soon.', 'success');
                
                // Reset form
                form.reset();
                
            } catch (error) {
                showToast('Failed to send message. Please try again.', 'error');
            } finally {
                // Restore button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });

        // Real-time validation feedback
        const inputs = form.querySelectorAll('.form-control');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (this.value.trim()) {
                    this.classList.add('is-valid');
                } else if (this.hasAttribute('required')) {
                    this.classList.add('is-invalid');
                }
            });

            input.addEventListener('input', function() {
                this.classList.remove('is-invalid');
            });
        });
    }

    /**
     * Initialize mobile menu
     */
    function initMobileMenu() {
        const navbarToggler = document.querySelector('.navbar-toggler');
        const navbarCollapse = document.querySelector('.navbar-collapse');
        const navLinks = document.querySelectorAll('.navbar-collapse .nav-link');

        if (!navbarToggler || !navbarCollapse) return;

        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navbarCollapse.classList.contains('show')) {
                    navbarToggler.click();
                }
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navbarCollapse.classList.contains('show') && 
                !navbarCollapse.contains(e.target) && 
                !navbarToggler.contains(e.target)) {
                navbarToggler.click();
            }
        });

        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navbarCollapse.classList.contains('show')) {
                navbarToggler.click();
            }
        });
    }

    /**
     * Initialize lazy loading for images
     */
    function initLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        if (!images.length) return;

        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px'
            });

            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for browsers without IntersectionObserver
            images.forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
        }
    }

    /**
     * Initialize tooltip functionality
     */
    function initTooltips() {
        const tooltipTriggers = document.querySelectorAll('[data-tooltip]');
        
        tooltipTriggers.forEach(trigger => {
            trigger.addEventListener('mouseenter', function() {
                const tooltipText = this.getAttribute('data-tooltip');
                
                const tooltip = document.createElement('div');
                tooltip.className = 'custom-tooltip';
                tooltip.textContent = tooltipText;
                
                document.body.appendChild(tooltip);
                
                const rect = this.getBoundingClientRect();
                tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
                tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
                
                this._tooltip = tooltip;
            });
            
            trigger.addEventListener('mouseleave', function() {
                if (this._tooltip) {
                    this._tooltip.remove();
                    delete this._tooltip;
                }
            });
        });
    }

    /**
     * Initialize keyboard navigation
     */
    function initKeyboardNavigation() {
        // Skip to content link
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Skip to main content';
        document.body.insertBefore(skipLink, document.body.firstChild);

        // Add main-content id to first section
        const firstSection = document.querySelector('section');
        if (firstSection) {
            firstSection.id = firstSection.id || 'main-content';
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K to focus search (if implemented)
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                // Focus search input if exists
                const searchInput = document.querySelector('[type="search"]');
                if (searchInput) searchInput.focus();
            }
        });
    }

    /**
     * Initialize performance monitoring
     */
    function initPerformanceMonitoring() {
        // Log page load time
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = window.performance.timing;
                const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                
                console.log(`Page loaded in ${pageLoadTime}ms`);
                
                // Report to analytics if needed
                if (window.gtag) {
                    window.gtag('event', 'timing_complete', {
                        name: 'load',
                        value: pageLoadTime
                    });
                }
            }, 0);
        });
    }

    /**
     * Initialize error handling
     */
    function initErrorHandling() {
        window.addEventListener('error', (e) => {
            console.error('Global error:', e.error);
            // Could send to error tracking service
        });

        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled promise rejection:', e.reason);
            // Could send to error tracking service
        });
    }

    /**
     * Initialize copy to clipboard functionality
     */
    function initCopyToClipboard() {
        const copyElements = document.querySelectorAll('[data-copy]');
        
        copyElements.forEach(el => {
            el.addEventListener('click', async function() {
                const textToCopy = this.getAttribute('data-copy');
                
                try {
                    await navigator.clipboard.writeText(textToCopy);
                    showToast('Copied to clipboard!');
                } catch (err) {
                    // Fallback for older browsers
                    const textArea = document.createElement('textarea');
                    textArea.value = textToCopy;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                    showToast('Copied to clipboard!');
                }
            });
        });
    }

    /**
     * Initialize scroll progress indicator
     */
    function initScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.innerHTML = '<div class="scroll-progress-bar"></div>';
        document.body.appendChild(progressBar);

        const progressBarInner = progressBar.querySelector('.scroll-progress-bar');

        window.addEventListener('scroll', throttle(() => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            
            progressBarInner.style.width = `${scrollPercent}%`;
        }, 50), { passive: true });
    }

    /**
     * Add CSS for scroll progress
     */
    function addScrollProgressStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .scroll-progress {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 3px;
                z-index: 9999;
                background: transparent;
            }
            .scroll-progress-bar {
                height: 100%;
                background: var(--primary-gradient);
                width: 0%;
                transition: width 0.1s ease-out;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Initialize all modules
     */
    function init() {
        initContactForm();
        initMobileMenu();
        initLazyLoading();
        initTooltips();
        initKeyboardNavigation();
        initPerformanceMonitoring();
        initErrorHandling();
        initCopyToClipboard();
        addScrollProgressStyles();
        initScrollProgress();

        console.log('Portfolio initialized successfully!');
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose utility functions globally
    window.PortfolioUtils = {
        debounce,
        throttle,
        showToast
    };

    //download resume function
    function downloadFile() {
        const link = document.createElement('a');
        link.href = 'assets/files/Gugan_S_Resume.pdf';
        link.download = 'Gugan_S_Resume.pdf';
        link.click();
    }
    window.downloadFile = downloadFile;
})();
