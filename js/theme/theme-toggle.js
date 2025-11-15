/*
 * Theme Toggle Functionality - Heather Free Version Theme
 * Dark/Light theme switching functionality
 */

(function() {
    'use strict';

    // Get theme toggle buttons
    var themeToggleBtn = document.getElementById('theme-toggle-btn');
    var themeToggleBtnMobile = document.getElementById('theme-toggle-btn-mobile');
    var themeIcon = document.getElementById('theme-icon');
    var themeIconMobile = document.getElementById('theme-icon-mobile');

    // Check for saved theme preference or default to light mode
    var currentTheme = localStorage.getItem('theme') || 'light';

    // Apply the current theme on load
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-theme');
        if (themeIcon) themeIcon.className = 'fa fa-sun-o';
        if (themeIconMobile) themeIconMobile.className = 'fa fa-sun-o';
    }

    // Function to toggle theme
    function toggleTheme() {
        var isDark = document.body.classList.contains('dark-theme');

        if (isDark) {
            // Switch to light theme
            document.body.classList.remove('dark-theme');
            if (themeIcon) themeIcon.className = 'fa fa-moon-o';
            if (themeIconMobile) themeIconMobile.className = 'fa fa-moon-o';
            localStorage.setItem('theme', 'light');
        } else {
            // Switch to dark theme
            document.body.classList.add('dark-theme');
            if (themeIcon) themeIcon.className = 'fa fa-sun-o';
            if (themeIconMobile) themeIconMobile.className = 'fa fa-sun-o';
            localStorage.setItem('theme', 'dark');
        }
    }

    // Add event listeners
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }
    if (themeToggleBtnMobile) {
        themeToggleBtnMobile.addEventListener('click', toggleTheme);
    }

})();