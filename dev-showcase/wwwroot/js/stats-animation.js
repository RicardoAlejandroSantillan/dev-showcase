document.addEventListener('DOMContentLoaded', () => {
    function animateStatBars(container) {
        const bars = container.querySelectorAll('.stat-bar[data-percent]');
        bars.forEach(bar => {
            const percent = parseInt(bar.getAttribute('data-percent'), 10);
            bar.style.setProperty('--target-width', percent + '%');
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    bar.classList.add('animated');
                });
            });
        });
    }

    const skillSections = document.querySelectorAll('.skill-section');

    skillSections.forEach(section => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && section.classList.contains('active')) {
                    animateStatBars(section);
                    observer.disconnect();
                }
            });
        }, { threshold: 0.1 });

        observer.observe(section);
    });

    const hardSkillsBtn = document.getElementById('hard-skills-btn');
    if (hardSkillsBtn) {
        hardSkillsBtn.addEventListener('click', () => {
            setTimeout(() => {
                const hardSkillsSection = document.getElementById('hard-skills-content');
                if (hardSkillsSection) {
                    animateStatBars(hardSkillsSection);
                }
            }, 150);
        });
    }

    const activeSection = document.querySelector('.skill-section.active');
    if (activeSection) {
        setTimeout(() => animateStatBars(activeSection), 300);
    }
});