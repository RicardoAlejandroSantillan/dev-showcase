document.addEventListener('DOMContentLoaded', function () {
    var menuToggle = document.getElementById('menuToggle');
    var sidebar = document.getElementById('sidebar');
    var menuOverlay = document.getElementById('menuOverlay');
    var navButtons = document.querySelectorAll('.nav-button');

    if (!menuToggle || !sidebar || !menuOverlay) {
        console.warn('[main.js] Elementos del menú no encontrados en el DOM.');
        return;
    }

    var isOpen = false;

    function openMenu() {
        isOpen = true;
        sidebar.classList.add('active');
        menuToggle.classList.add('active');
        menuOverlay.classList.add('active');
        document.documentElement.classList.add('menu-is-open');
    }

    function closeMenu() {
        isOpen = false;
        sidebar.classList.remove('active');
        menuToggle.classList.remove('active');
        menuOverlay.classList.remove('active');
        document.documentElement.classList.remove('menu-is-open');
    }

    function handleToggleClick(e) {
        e.preventDefault();
        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    menuToggle.addEventListener('click', handleToggleClick);
    menuToggle.addEventListener('touchend', function (e) {
        e.preventDefault();
        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }, { passive: false });

    menuOverlay.addEventListener('click', closeMenu);
    menuOverlay.addEventListener('touchend', function (e) {
        e.preventDefault();
        closeMenu();
    }, { passive: false });

    navButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            if (window.innerWidth <= 1024 && isOpen) {
                closeMenu();
            }
        });
    });

    window.addEventListener('resize', function () {
        if (window.innerWidth > 1024 && isOpen) {
            closeMenu();
        }
    });
});