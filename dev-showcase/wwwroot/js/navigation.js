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
        contentSections.forEach(section => section.classList.remove('active'));

        const target = document.querySelector(`.content-section[data-content="${targetId}"]`);
        if (target) {
            target.classList.add('active');
            target.scrollTop = 0;
        }

        navButtons.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-section') === targetId);
        });

        if (targetId === 'education') {
            if (prepContent && !prepContent.classList.contains('active') && !certContent?.classList.contains('active')) {
                prepContent.classList.add('active');
                if (prepBtn) prepBtn.classList.add('active');
            }
        }

        if (targetId === 'skills') {
            const activeSkillSection = document.querySelector('.skill-section.active');
            if (!activeSkillSection) {
                const firstSkillSection = document.getElementById('hard-skills-content');
                if (firstSkillSection) firstSkillSection.classList.add('active');
                const firstBtn = document.getElementById('hard-skills-btn');
                if (firstBtn) firstBtn.classList.add('active');
            }
        }

        if (targetId === 'projects') {
            const activeProjSection = document.querySelector('.professional-work.active, .personal-project.active');
            if (!activeProjSection) {
                const firstProj = document.getElementById('professional-work-content');
                if (firstProj) firstProj.classList.add('active');
                const firstBtn = document.getElementById('professional-work-btn');
                if (firstBtn) firstBtn.classList.add('active');
            }
        }
    }

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => switchSection(btn.getAttribute('data-section')));
    });

    skillFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            skillFilterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const targetId = btn.id.replace('-btn', '-content');
            skillSections.forEach(section => section.classList.remove('active'));

            const target = document.getElementById(targetId);
            if (target) {
                target.classList.add('active');
                if (typeof window.animateStatBars === 'function') {
                    setTimeout(() => window.animateStatBars(target), 150);
                }
            }
        });
    });

    projectFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            projectFilterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const targetId = btn.id.replace('-btn', '-content');
            document.querySelectorAll('.professional-work, .personal-project').forEach(el => el.classList.remove('active'));

            const target = document.getElementById(targetId);
            if (target) target.classList.add('active');
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
});