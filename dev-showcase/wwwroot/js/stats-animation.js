document.addEventListener('DOMContentLoaded', () => {

    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px'
    };

    const statsObserver = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statBars = entry.target.querySelectorAll('.stat-bar');

                statBars.forEach((bar, index) => {
                    const percentage = bar.getAttribute('data-percent');

                    setTimeout(() => {
                        bar.style.width = percentage + '%';
                    }, index * 150);
                });

                statsObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const statsSection = document.querySelector('.stats-bars-section');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
});