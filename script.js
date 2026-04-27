document.addEventListener('DOMContentLoaded', () => {
    const qrInput = document.getElementById('qr-input');
    const sizeSelect = document.getElementById('size-select');
    const colorDark = document.getElementById('color-dark');
    const qrContainer = document.getElementById('qrcode');
    const placeholder = document.getElementById('placeholder');
    const downloadBtn = document.getElementById('download-btn');
    const downloadSvgBtn = document.getElementById('download-svg-btn');

    const generateQRCode = async () => {
        const text = qrInput.value.trim();
        const size = parseInt(sizeSelect.value);
        const color = colorDark.value;

        if (text === '') {
            qrContainer.innerHTML = '';
            placeholder.style.display = 'block';
            [downloadBtn, downloadSvgBtn].forEach(btn => {
                btn.classList.add('disabled');
                btn.disabled = true;
            });
            return;
        }

        placeholder.style.display = 'none';
        [downloadBtn, downloadSvgBtn].forEach(btn => {
            btn.classList.remove('disabled');
            btn.disabled = false;
        });

        try {
            qrContainer.innerHTML = '';
            const canvas = document.createElement('canvas');
            qrContainer.appendChild(canvas);

            await QRCode.toCanvas(canvas, text, {
                width: size,
                margin: 2,
                color: {
                    dark: color,
                    light: '#ffffff'
                },
                errorCorrectionLevel: 'H'
            });

            qrContainer.style.opacity = '0';
            setTimeout(() => {
                qrContainer.style.opacity = '1';
            }, 50);

        } catch (err) {
            console.error(err);
        }
    };

    const downloadPNG = () => {
        const canvas = qrContainer.querySelector('canvas');
        if (!canvas) return;

        const link = document.createElement('a');
        link.download = `qrcode-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    const downloadSVG = async () => {
        const text = qrInput.value.trim();
        const color = colorDark.value;
        const size = parseInt(sizeSelect.value);

        try {
            const svgString = await QRCode.toString(text, {
                type: 'svg',
                width: size,
                margin: 2,
                color: {
                    dark: color,
                    light: '#ffffff'
                },
                errorCorrectionLevel: 'H'
            });

            const blob = new Blob([svgString], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `qrcode-${Date.now()}.svg`;
            link.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error(err);
        }
    };

    qrInput.addEventListener('input', generateQRCode);
    sizeSelect.addEventListener('change', generateQRCode);
    colorDark.addEventListener('input', generateQRCode);
    downloadBtn.addEventListener('click', downloadPNG);
    downloadSvgBtn.addEventListener('click', downloadSVG);
});
