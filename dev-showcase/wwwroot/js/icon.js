document.addEventListener('visibilitychange', function () {
    const favicon = document.querySelector('link[rel="icon"]');
    const img = new Image();
    img.src = '/images/profile/logo-32x32.png';

    img.onload = function () {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, 32, 32);

        if (document.hidden) {
            // El usuario NO está viendo la página: MANTENER ORIGINAL (Negro)
            favicon.href = '/images/profile/logo-32x32.png';
        } else {
            // El usuario ESTÁ viendo la página: INVERTIR A BLANCO
            const imageData = ctx.getImageData(0, 0, 32, 32);
            const data = imageData.data;

            for (let i = 0; i < data.length; i += 4) {
                // Invertimos solo los canales RGB, mantenemos el Alpha (transparencia)
                data[i] = 255 - data[i];     // Red
                data[i + 1] = 255 - data[i + 1]; // Green
                data[i + 2] = 255 - data[i + 2]; // Blue
            }

            ctx.putImageData(imageData, 0, 0);
            favicon.href = canvas.toDataURL('image/png');
        }
    };
});