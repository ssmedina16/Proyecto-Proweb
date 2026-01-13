// Mobile Menu Toggle - Click on logo to open/close menu

document.addEventListener('DOMContentLoaded', () => {
    const logo = document.querySelector('.logo');
    const nav = document.querySelector('nav');

    if (!logo || !nav) return;

    // Only add click handler on mobile
    if (window.innerWidth <= 968) {
        setupMobileMenu();
    }

    // Re-setup on resize
    window.addEventListener('resize', () => {
        if (window.innerWidth <= 968) {
            setupMobileMenu();
        } else {
            // Remove mobile menu on desktop
            logo.classList.remove('menu-open');
            nav.classList.remove('mobile-open');
            logo.style.cursor = 'default';
        }
    });
});

function setupMobileMenu() {
    const logo = document.querySelector('.logo');
    const nav = document.querySelector('nav');

    if (!logo || !nav) return;

    // Remove previous listeners to avoid duplicates
    const newLogo = logo.cloneNode(true);
    logo.parentNode.replaceChild(newLogo, logo);

    // Add click handler to logo
    newLogo.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        newLogo.classList.toggle('menu-open');
        nav.classList.toggle('mobile-open');
    });

    // Close menu when clicking nav item
    const navLinks = nav.querySelectorAll('.nav-box');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            newLogo.classList.remove('menu-open');
            nav.classList.remove('mobile-open');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !newLogo.contains(e.target)) {
            newLogo.classList.remove('menu-open');
            nav.classList.remove('mobile-open');
        }
    });
}
