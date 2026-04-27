document.addEventListener('DOMContentLoaded', () => {
    const qrInput = document.getElementById('qr-input');
    const sizeSelect = document.getElementById('size-select');
    const colorDark = document.getElementById('color-dark');
    const qrContainer = document.getElementById('qrcode');
    const placeholder = document.getElementById('placeholder');
    const downloadBtn = document.getElementById('download-btn');
    const downloadSvgBtn = document.getElementById('download-svg-btn');

    const generateQRCode = () => {
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
            
            const el = kjua({
                render: 'image',
                text: text,
                size: size,
                fill: color,
                back: '#ffffff',
                rounded: 0,
                quiet: 1,
                crisp: true
            });

            qrContainer.appendChild(el);

            qrContainer.style.opacity = '0';
            setTimeout(() => {
                qrContainer.style.opacity = '1';
            }, 50);

        } catch (err) {
            console.error('Erro ao gerar QR:', err);
        }
    };

    const downloadPNG = () => {
        const img = qrContainer.querySelector('img');
        if (!img) return;

        const link = document.createElement('a');
        link.download = `qrcode-${Date.now()}.png`;
        link.href = img.src;
        link.click();
    };

    const downloadSVG = () => {
        const text = qrInput.value.trim();
        const color = colorDark.value;
        const size = parseInt(sizeSelect.value);

        try {
            const svgEl = kjua({
                render: 'svg',
                text: text,
                size: size,
                fill: color,
                back: '#ffffff',
                quiet: 1
            });

            const serializer = new XMLSerializer();
            const svgString = serializer.serializeToString(svgEl);
            
            const blob = new Blob([svgString], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `qrcode-${Date.now()}.svg`;
            link.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Erro ao baixar SVG:', err);
        }
    };

    qrInput.addEventListener('input', generateQRCode);
    sizeSelect.addEventListener('change', generateQRCode);
    colorDark.addEventListener('input', generateQRCode);
    downloadBtn.addEventListener('click', downloadPNG);
    downloadSvgBtn.addEventListener('click', downloadSVG);
});
