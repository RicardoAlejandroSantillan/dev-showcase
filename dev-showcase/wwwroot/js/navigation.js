document.addEventListener('DOMContentLoaded', () => {

    const navButtons = document.querySelectorAll('.nav-button');
    const contentSections = document.querySelectorAll('.content-section');

    const changeSection = (targetSection) => {

        navButtons.forEach(btn => btn.classList.remove('active'));
        contentSections.forEach(section => section.classList.remove('active'));

        const activeButton = document.querySelector(`[data-section="${targetSection}"]`);
        if (activeButton) activeButton.classList.add('active');

        const activeSection = document.querySelector(`[data-content="${targetSection}"]`);
        if (activeSection) {
            setTimeout(() => {
                activeSection.classList.add('active');
                const mainContent = document.querySelector('.main-content');
                if (mainContent) mainContent.scrollTop = 0;
            }, 50);
        }
    };

    navButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = button.dataset.section;
            if (!button.classList.contains('active')) {
                changeSection(targetSection);
            }
        });
    });

    const initializeFromURL = () => {
        const hash = window.location.hash.substring(1);
        if (hash) {
            const section = document.querySelector(`[data-section="${hash}"]`);
            if (section) changeSection(hash);
        }
    };

    initializeFromURL();
    window.addEventListener('hashchange', initializeFromURL);

    initializeSkillsToggle();
    initializeProjectsToggle();
    initializeEducationToggle();
    initializeProjectInfo();
    initializeImageModal();
    initializeCertificateModal();
});

function initializeSkillsToggle() {
    const hardSkillsBtn = document.getElementById('hard-skills');
    const softSkillsBtn = document.getElementById('soft-skills');
    const vocationalStatsBtn = document.getElementById('vocational-stats');
    const hardSkillsContent = document.getElementById('hard-skills-content');
    const softSkillsContent = document.getElementById('soft-skills-content');
    const vocationalStatsContent = document.getElementById('vocational-stats-content');

    if (!hardSkillsBtn || !softSkillsBtn || !vocationalStatsBtn) {
        return;
    }

    const showHardSkills = () => {
        hardSkillsBtn.classList.add('active');
        softSkillsBtn.classList.remove('active');
        vocationalStatsBtn.classList.remove('active');
        hardSkillsContent.classList.add('active');
        softSkillsContent.classList.remove('active');
        vocationalStatsContent.classList.remove('active');
    };

    const showSoftSkills = () => {
        softSkillsBtn.classList.add('active');
        hardSkillsBtn.classList.remove('active');
        vocationalStatsBtn.classList.remove('active');
        softSkillsContent.classList.add('active');
        hardSkillsContent.classList.remove('active');
        vocationalStatsContent.classList.remove('active');
    };

    const showVocationalStats = () => {
        vocationalStatsBtn.classList.add('active');
        hardSkillsBtn.classList.remove('active');
        softSkillsBtn.classList.remove('active');
        vocationalStatsContent.classList.add('active');
        hardSkillsContent.classList.remove('active');
        softSkillsContent.classList.remove('active');
    };

    hardSkillsBtn.addEventListener('click', (e) => { e.preventDefault(); showHardSkills(); });
    softSkillsBtn.addEventListener('click', (e) => { e.preventDefault(); showSoftSkills(); });
    vocationalStatsBtn.addEventListener('click', (e) => { e.preventDefault(); showVocationalStats(); });
}

function initializeProjectsToggle() {
    const professionalBtn = document.getElementById('professional-work-btn');
    const personalBtn = document.getElementById('personal-project-btn');
    const professionalContent = document.querySelector('.professional-work');
    const personalContent = document.querySelector('.personal-project');

    if (!professionalBtn || !personalBtn) {
        return;
    }

    professionalContent.classList.add('active');

    const showProfessionalWork = () => {
        professionalBtn.classList.add('active');
        personalBtn.classList.remove('active');
        professionalContent.classList.add('active');
        personalContent.classList.remove('active');
    };

    const showPersonalProjects = () => {
        personalBtn.classList.add('active');
        professionalBtn.classList.remove('active');
        personalContent.classList.add('active');
        professionalContent.classList.remove('active');
    };

    professionalBtn.addEventListener('click', (e) => { e.preventDefault(); showProfessionalWork(); });
    personalBtn.addEventListener('click', (e) => { e.preventDefault(); showPersonalProjects(); });
}

function initializeEducationToggle() {
    const preparationBtn = document.getElementById('preparation-btn');
    const certificatesBtn = document.getElementById('certificates-btn');
    const preparationContent = document.getElementById('preparation-content');
    const certificatesContent = document.getElementById('certificates-content');

    if (!preparationBtn || !certificatesBtn) {
        return;
    }

    const showPreparation = () => {
        preparationBtn.classList.add('active');
        certificatesBtn.classList.remove('active');
        preparationContent.classList.add('active');
        certificatesContent.classList.remove('active');
    };

    const showCertificates = () => {
        certificatesBtn.classList.add('active');
        preparationBtn.classList.remove('active');
        certificatesContent.classList.add('active');
        preparationContent.classList.remove('active');
    };

    preparationBtn.addEventListener('click', (e) => { e.preventDefault(); showPreparation(); });
    certificatesBtn.addEventListener('click', (e) => { e.preventDefault(); showCertificates(); });
}

function initializeProjectInfo() {
    const professionalCards = document.querySelectorAll('.carousel-professional-work-card');
    const personalCards = document.querySelectorAll('.carousel-personal-project-card');
    const infoCards = document.querySelectorAll('.project-info-card');

    const showProjectInfo = (projectId) => {
        infoCards.forEach(card => card.classList.remove('active'));

        const targetInfo = document.getElementById(`${projectId}-info`);
        if (targetInfo) {
            targetInfo.classList.add('active');
            setTimeout(() => {
                targetInfo.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        }
    };

    professionalCards.forEach(card => {
        card.addEventListener('click', () => showProjectInfo(card.getAttribute('data-project')));
    });

    personalCards.forEach(card => {
        card.addEventListener('click', () => showProjectInfo(card.getAttribute('data-project')));
    });
}

function initializeImageModal() {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const projectImages = document.querySelectorAll('.left-pnl.img-pnl img');

    if (!modal || !modalImage || !modalCloseBtn) {
        return;
    }

    if (modal.parentElement !== document.body) {
        document.body.appendChild(modal);
    }

    const openModal = (imageSrc, imageAlt) => {
        modalImage.src = imageSrc;
        modalImage.alt = imageAlt;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
            if (!modal.classList.contains('active')) modalImage.src = '';
        }, 300);
    };

    projectImages.forEach(img => {
        img.addEventListener('click', (e) => {
            e.stopPropagation();
            openModal(img.src, img.alt);
        });
    });

    modalCloseBtn.addEventListener('click', (e) => { e.stopPropagation(); closeModal(); });
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });
}

function initializeCertificateModal() {
    const modal = document.getElementById('certificateModal');
    const modalImage = document.getElementById('certificateModalImage');
    const modalTitle = document.getElementById('certificateModalTitle');
    const modalDate = document.getElementById('certificateModalDate');
    const modalCloseBtn = document.getElementById('certificateModalCloseBtn');
    const certificateCards = document.querySelectorAll('.certificate-card');

    if (!modal || !modalImage || !modalCloseBtn) {
        return;
    }

    if (modal.parentElement !== document.body) {
        document.body.appendChild(modal);
    }

    const openCertificateModal = (card) => {
        const img = card.querySelector('.certificate-image-container img');
        const titleText = card.querySelector('.certificate-info p').textContent;
        const dateText = card.querySelector('.certificate-info span').textContent;

        modalImage.src = img.src;
        modalImage.alt = img.alt;
        modalTitle.textContent = titleText;
        modalDate.textContent = dateText;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeCertificateModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
            if (!modal.classList.contains('active')) {
                modalImage.src = '';
                modalTitle.textContent = '';
                modalDate.textContent = '';
            }
        }, 300);
    };

    certificateCards.forEach(card => {
        card.addEventListener('click', (e) => { e.stopPropagation(); openCertificateModal(card); });
    });

    modalCloseBtn.addEventListener('click', (e) => { e.stopPropagation(); closeCertificateModal(); });
    modal.addEventListener('click', (e) => { if (e.target === modal) closeCertificateModal(); });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) closeCertificateModal();
    });
}