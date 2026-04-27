document.addEventListener('DOMContentLoaded', () => {
    const qrInput = document.getElementById('qr-input');
    const sizeSelect = document.getElementById('size-select');
    const colorDark = document.getElementById('color-dark');
    const qrContainer = document.getElementById('qrcode');
    const placeholder = document.getElementById('placeholder');
    const downloadBtn = document.getElementById('download-btn');

    let qrCode = null;

    const generateQRCode = () => {
        const text = qrInput.value.trim();
        const size = parseInt(sizeSelect.value);
        const color = colorDark.value;

        qrContainer.innerHTML = '';

        if (text === '') {
            placeholder.style.display = 'block';
            downloadBtn.classList.add('disabled');
            downloadBtn.disabled = true;
            return;
        }

        placeholder.style.display = 'none';
        downloadBtn.classList.remove('disabled');
        downloadBtn.disabled = false;

        qrCode = new QRCode(qrContainer, {
            text: text,
            width: size,
            height: size,
            colorDark: color,
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });

        qrContainer.style.opacity = '0';
        setTimeout(() => {
            qrContainer.style.opacity = '1';
        }, 50);
    };

    const downloadQR = () => {
        const img = qrContainer.querySelector('img');
        const canvas = qrContainer.querySelector('canvas');
        
        if (img) {
            const link = document.createElement('a');
            link.download = `qrcode-${Date.now()}.png`;
            link.href = img.src;
            link.click();
        } else if (canvas) {
            const link = document.createElement('a');
            link.download = `qrcode-${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        }
    };

    qrInput.addEventListener('input', generateQRCode);
    sizeSelect.addEventListener('change', generateQRCode);
    colorDark.addEventListener('input', generateQRCode);
    downloadBtn.addEventListener('click', downloadQR);
});
