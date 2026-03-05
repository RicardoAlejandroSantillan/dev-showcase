document.addEventListener('DOMContentLoaded', () => {
    const certModal = document.getElementById('certificateModal');
    const certModalImg = document.getElementById('certificateModalImage');
    const certModalTitle = document.getElementById('certificateModalTitle');
    const certModalDate = document.getElementById('certificateModalDate');
    const certModalClose = document.getElementById('certificateModalCloseBtn');

    const imageModal = document.getElementById('imageModal');
    const imageModalImg = document.getElementById('modalImage');
    const imageModalClose = document.getElementById('modalCloseBtn');

    function openModal(modal) {
        if (!modal) return;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal(modal) {
        if (!modal) return;
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    document.querySelectorAll('.certificate-card').forEach(card => {
        card.addEventListener('click', () => {
            const img = card.querySelector('img');
            const name = card.querySelector('.certificate-info p:first-child');
            const date = card.querySelector('.certificate-info span');
            if (!img || !certModal) return;

            certModalImg.src = img.src;
            certModalImg.alt = img.alt;
            if (certModalTitle) certModalTitle.textContent = name ? name.textContent : '';
            if (certModalDate) certModalDate.textContent = date ? date.textContent : '';
            openModal(certModal);
        });
    });

    if (certModalClose) certModalClose.addEventListener('click', () => closeModal(certModal));
    if (certModal) certModal.addEventListener('click', (e) => { if (e.target === certModal) closeModal(certModal); });

    document.querySelectorAll('.left-pnl.img-pnl img').forEach(img => {
        img.addEventListener('click', () => {
            if (!imageModal || !imageModalImg) return;
            imageModalImg.src = img.src;
            imageModalImg.alt = img.alt;
            openModal(imageModal);
        });
    });

    if (imageModalClose) imageModalClose.addEventListener('click', () => closeModal(imageModal));
    if (imageModal) imageModal.addEventListener('click', (e) => { if (e.target === imageModal) closeModal(imageModal); });

    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        [certModal, imageModal].forEach(modal => {
            if (modal?.classList.contains('active')) closeModal(modal);
        });
    });
});