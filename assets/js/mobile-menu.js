//********************* Menu movil toggle click en logo para abrir cerrar menu *********************//

    document.addEventListener('DOMContentLoaded', () => {
        const logo = document.querySelector('.logo');
        const nav = document.querySelector('nav');

        if (!logo || !nav) return;

        if (window.innerWidth <= 968) {
            setupMobileMenu();
        }

    //********************* Reconfigurar menu al cambiar tamano de ventana *********************//
            window.addEventListener('resize', () => {
                if (window.innerWidth <= 968) {
                    setupMobileMenu();
                } else {
                    logo.classList.remove('menu-open');
                    nav.classList.remove('mobile-open');
                    logo.style.cursor = 'default';
                }
            });
    });

//********************* Configura funcionalidad de menu movil con eventos de click *********************//
    function setupMobileMenu() {
        const logo = document.querySelector('.logo');
        const nav = document.querySelector('nav');

        if (!logo || !nav) return;

        const newLogo = logo.cloneNode(true);
        logo.parentNode.replaceChild(newLogo, logo);

        newLogo.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            newLogo.classList.toggle('menu-open');
            nav.classList.toggle('mobile-open');
        });

    //********************* Cierra menu al hacer click en item de navegacion *********************//
    const navLinks = nav.querySelectorAll('.nav-box');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                newLogo.classList.remove('menu-open');
                nav.classList.remove('mobile-open');
            });
        });

    //********************* Cierra menu al hacer click fuera de el *********************//
            document.addEventListener('click', (e) => {
                if (!nav.contains(e.target) && !newLogo.contains(e.target)) {
                    newLogo.classList.remove('menu-open');
                    nav.classList.remove('mobile-open');
                }
            });
    }
