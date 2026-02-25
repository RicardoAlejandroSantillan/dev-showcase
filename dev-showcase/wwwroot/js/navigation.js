document.addEventListener('DOMContentLoaded', () => {
    const navButtons = document.querySelectorAll('.nav-button');
    const contentSections = document.querySelectorAll('.content-section');
    const skillFilterBtns = document.querySelectorAll('.skill-filter-btn');
    const skillSections = document.querySelectorAll('.skill-section');
    const projectFilterBtns = document.querySelectorAll('.project-filter-btn');
    const prepBtn = document.getElementById('preparation-btn');
    const certBtn = document.getElementById('certificates-btn');
    const prepContent = document.getElementById('preparation-content');
    const certContent = document.getElementById('certificates-content');

    function switchSection(targetId) {
        contentSections.forEach(section => {
            section.classList.remove('active');
        });

        const target = document.querySelector(`.content-section[data-content="${targetId}"]`);
        if (target) {
            target.classList.add('active');
            target.scrollTop = 0;
        }

        navButtons.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-section') === targetId);
        });
    }

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const section = btn.getAttribute('data-section');
            switchSection(section);

            const overlay = document.querySelector('.menu-overlay');
            const toggle = document.querySelector('.menu-toggle');
            const sidebar = document.querySelector('.sidebar');
            if (overlay && overlay.classList.contains('active')) {
                overlay.classList.remove('active');
                toggle && toggle.classList.remove('active');
                sidebar && sidebar.classList.remove('open');
            }
        });
    });

    skillFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            skillFilterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const targetId = btn.id.replace('-btn', '-content');

            skillSections.forEach(section => {
                section.classList.remove('active');
            });

            const target = document.getElementById(targetId);
            if (target) {
                target.classList.add('active');

                const statBars = target.querySelectorAll('.stat-bar[data-percent]');
                statBars.forEach(bar => {
                    const percent = parseInt(bar.getAttribute('data-percent'), 10);
                    bar.style.setProperty('--target-width', percent + '%');
                    bar.classList.remove('animated');
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            bar.classList.add('animated');
                        });
                    });
                });
            }
        });
    });

    const projectInfoCards = document.querySelectorAll('.project-info-card');

    function showProjectInfo(projectKey) {
        projectInfoCards.forEach(card => {
            card.classList.remove('active');
        });
        const target = document.getElementById(`${projectKey}-info`);
        if (target) {
            target.classList.add('active');
            const infoContainer = document.querySelector('.carousel-information-container');
            if (infoContainer) {
                const parentSection = document.querySelector('.content-section[data-content="projects"]');
                if (parentSection) {
                    parentSection.scrollTo({
                        top: infoContainer.offsetTop - 20,
                        behavior: 'smooth'
                    });
                }
            }
        }
    }

    document.querySelectorAll('.carousel-card[data-project]').forEach(card => {
        card.addEventListener('click', () => {
            const projectKey = card.getAttribute('data-project');
            if (projectKey) {
                showProjectInfo(projectKey);
            }
        });
    });

    if (prepBtn && certBtn && prepContent && certContent) {
        prepBtn.addEventListener('click', () => {
            prepBtn.classList.add('active');
            certBtn.classList.remove('active');
            prepContent.classList.add('active');
            certContent.classList.remove('active');
        });

        certBtn.addEventListener('click', () => {
            certBtn.classList.add('active');
            prepBtn.classList.remove('active');
            certContent.classList.add('active');
            prepContent.classList.remove('active');
        });
    }

    const certificateCards = document.querySelectorAll('.certificate-card');
    const certModal = document.getElementById('certificateModal');
    const certModalImg = document.getElementById('certificateModalImage');
    const certModalTitle = document.getElementById('certificateModalTitle');
    const certModalDate = document.getElementById('certificateModalDate');
    const certModalClose = document.getElementById('certificateModalCloseBtn');

    certificateCards.forEach(card => {
        card.addEventListener('click', () => {
            const img = card.querySelector('img');
            const name = card.querySelector('.certificate-info p:first-child');
            const date = card.querySelector('.certificate-info span');
            if (img && certModal) {
                certModalImg.src = img.src;
                certModalImg.alt = img.alt;
                if (certModalTitle) certModalTitle.textContent = name ? name.textContent : '';
                if (certModalDate) certModalDate.textContent = date ? date.textContent : '';
                certModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    if (certModalClose) {
        certModalClose.addEventListener('click', () => {
            certModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    if (certModal) {
        certModal.addEventListener('click', (e) => {
            if (e.target === certModal) {
                certModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    const imageModal = document.getElementById('imageModal');
    const imageModalImg = document.getElementById('modalImage');
    const imageModalClose = document.getElementById('modalCloseBtn');

    document.querySelectorAll('.left-pnl.img-pnl img').forEach(img => {
        img.addEventListener('click', () => {
            if (imageModal && imageModalImg) {
                imageModalImg.src = img.src;
                imageModalImg.alt = img.alt;
                imageModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    if (imageModalClose) {
        imageModalClose.addEventListener('click', () => {
            imageModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    if (imageModal) {
        imageModal.addEventListener('click', (e) => {
            if (e.target === imageModal) {
                imageModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            [certModal, imageModal].forEach(modal => {
                if (modal && modal.classList.contains('active')) {
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }
    });

    const menuToggle = document.querySelector('.menu-toggle');
    const menuOverlay = document.querySelector('.menu-overlay');
    const sidebar = document.querySelector('.sidebar');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            menuOverlay && menuOverlay.classList.toggle('active');
            sidebar && sidebar.classList.toggle('open');
        });
    }

    if (menuOverlay) {
        menuOverlay.addEventListener('click', () => {
            menuToggle && menuToggle.classList.remove('active');
            menuOverlay.classList.remove('active');
            sidebar && sidebar.classList.remove('open');
        });
    }

    const vocationalSectionBtns = document.querySelectorAll('.vocational-section-btn');
    const vocationalSectionContents = document.querySelectorAll('.vocational-section-content');

    vocationalSectionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-section');
            vocationalSectionBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            vocationalSectionContents.forEach(content => {
                content.classList.toggle('active', content.getAttribute('data-section-content') === target);
            });
        });
    });
});