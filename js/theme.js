/**
 * Theme Toggle Module
 * Handles light/dark theme switching with localStorage persistence
 */

(function() {
    'use strict';

    // Theme configuration
    const THEME_KEY = 'portfolio-theme';
    const THEME_DARK = 'dark';
    const THEME_LIGHT = 'light';

    // DOM Elements
    const themeToggle = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;

    /**
     * Get the current theme from localStorage or system preference
     * @returns {string} The current theme ('dark' or 'light')
     */
    function getCurrentTheme() {
        // Check localStorage first
        const storedTheme = localStorage.getItem(THEME_KEY);
        if (storedTheme) {
            return storedTheme;
        }

        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return THEME_DARK;
        }

        return THEME_LIGHT;
    }

    /**
     * Apply the theme to the document
     * @param {string} theme - The theme to apply ('dark' or 'light')
     */
    function applyTheme(theme) {
        htmlElement.setAttribute('data-theme', theme);
        
        // Update meta theme-color for mobile browsers
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', theme === THEME_DARK ? '#0f172a' : '#ffffff');
        }
    }

    /**
     * Save the theme preference to localStorage
     * @param {string} theme - The theme to save
     */
    function saveTheme(theme) {
        localStorage.setItem(THEME_KEY, theme);
    }

    /**
     * Toggle between light and dark themes
     */
    function toggleTheme() {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === THEME_DARK ? THEME_LIGHT : THEME_DARK;
        
        // Add transition class for smooth theme change
        htmlElement.classList.add('theme-transition');
        
        applyTheme(newTheme);
        saveTheme(newTheme);
        
        // Remove transition class after animation completes
        setTimeout(() => {
            htmlElement.classList.remove('theme-transition');
        }, 300);

        // Dispatch custom event for other components
        window.dispatchEvent(new CustomEvent('themeChanged', { 
            detail: { theme: newTheme } 
        }));
    }

    /**
     * Initialize the theme on page load
     */
    function initTheme() {
        const theme = getCurrentTheme();
        applyTheme(theme);
    }

    /**
     * Listen for system theme changes
     */
    function listenForSystemThemeChanges() {
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            
            mediaQuery.addEventListener('change', (e) => {
                // Only apply system preference if user hasn't manually set a preference
                if (!localStorage.getItem(THEME_KEY)) {
                    const newTheme = e.matches ? THEME_DARK : THEME_LIGHT;
                    applyTheme(newTheme);
                }
            });
        }
    }

    // Event Listeners
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initTheme();
            listenForSystemThemeChanges();
        });
    } else {
        initTheme();
        listenForSystemThemeChanges();
    }

    // Expose theme API for other scripts
    window.ThemeManager = {
        getCurrentTheme,
        applyTheme,
        toggleTheme,
        saveTheme
    };

})();
