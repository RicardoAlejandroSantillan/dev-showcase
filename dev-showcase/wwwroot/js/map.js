document.addEventListener('DOMContentLoaded', function () {
    var mapContainer = document.getElementById('portfolio-map');

    if (!mapContainer) {
        return;
    }

    mapContainer.addEventListener('click', function () {
        mapContainer.classList.add('map-active');
    });

    mapContainer.addEventListener('mouseleave', function () {
        mapContainer.classList.remove('map-active');
    });

    var introSection = document.querySelector('.content-section[data-content="introduction"]');
    if (introSection) {
        var sectionObserver = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.type === 'attributes' &&
                    mutation.attributeName === 'class' &&
                    !introSection.classList.contains('active')) {
                    mapContainer.classList.remove('map-active');
                }
            });
        });
        sectionObserver.observe(introSection, { attributes: true });
    }
});