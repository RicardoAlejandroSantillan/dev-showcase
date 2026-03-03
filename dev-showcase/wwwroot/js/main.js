document.addEventListener('DOMContentLoaded', () => {
    initializeMenuToggle();
    initializeCV();
});

function initializeMenuToggle() {
    const menuToggle = document.querySelector('.menu-toggle');
    const menuOverlay = document.querySelector('.menu-overlay');
    const sidebar = document.querySelector('.sidebar');
    const navButtons = document.querySelectorAll('.nav-button');

    if (!menuToggle || !menuOverlay || !sidebar) {
        console.warn('Menu elements not found');
        return;
    }

    function toggleMenu() {
        menuToggle.classList.toggle('active');
        sidebar.classList.toggle('open');
        menuOverlay.classList.toggle('active');
        document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : '';
    }

    function closeMenu() {
        menuToggle.classList.remove('active');
        sidebar.classList.remove('open');
        menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    menuToggle.addEventListener('click', toggleMenu);
    menuOverlay.addEventListener('click', closeMenu);

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (window.innerWidth <= 1024) {
                closeMenu();
            }
        });
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 1024) {
            closeMenu();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar.classList.contains('open')) {
            closeMenu();
        }
    });
}

function initializeCV() {
    const cvDownloadBtn = document.getElementById('cvDownloadBtn');

    if (!cvDownloadBtn) {
        console.warn('CV download button not found');
        return;
    }

    const cvPaths = {
        es: '/files/RicardoAlejandroPerezSantillan_AnalistaDeDatos.pdf',
        en: '/files/RicardoAlejandroPerezSantillan_DataAnalyst.pdf'
    };

    const getCurrentLanguage = () => localStorage.getItem('preferredLanguage') || 'es';

    window.updateCVLink = () => {
        const currentLang = getCurrentLanguage();
        cvDownloadBtn.href = cvPaths[currentLang] || cvPaths.es;
        cvDownloadBtn.download = `RicardoAlejandroPerezSantillan_CV_${currentLang.toUpperCase()}.pdf`;
    };

    window.updateCVLink();

    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            setTimeout(() => {
                window.updateCVLink();
                if (typeof window.refreshVocationalCharts === 'function') {
                    window.refreshVocationalCharts();
                }
            }, 200);
        });
    });
}