document.addEventListener('DOMContentLoaded', () => {
    console.log('Glow panels system initialized');

    document.querySelectorAll('.glow-panel').forEach(panel => {
        panel.addEventListener('mousemove', function (e) {
            const rect = panel.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const deltaX = x - centerX;
            const deltaY = y - centerY;

            let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
            angle = (angle + 360) % 360;

            panel.style.setProperty('--angle', `${angle}deg`);
        });

        panel.addEventListener('mouseleave', function () {
            panel.style.setProperty('--angle', '0deg');
        });
    });

    console.log('Glow panels ready');
});