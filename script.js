const video = document.getElementById('video-preview');
const canvas = document.getElementById('hidden-canvas');
const scanResult = document.getElementById('scan-result');
const processedImage = document.getElementById('processed-image');

// ১. ক্যামেরা চালু করা
async function initCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' } 
        });
        video.srcObject = stream;
    } catch (err) {
        console.error("Camera error:", err);
    }
}

// ২. ডকুমেন্ট স্ক্যান ও ইমেজ প্রসেসিং
document.getElementById('scan-doc-btn').addEventListener('click', () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    
    // OpenCV প্রসেসিং
    let src = cv.imread(canvas);
    let dst = new cv.Mat();
    cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY); // গ্রে-স্কেল ফিল্টার
    cv.imshow(canvas, dst);
    
    // UI পরিবর্তন
    processedImage.src = canvas.toDataURL('image/jpeg');
    document.getElementById('camera-container').style.display = 'none'; // ক্যামেরা লুকানো
    scanResult.style.display = 'block'; // রেজাল্ট দেখানো
    
    src.delete(); dst.delete();
});

// ৩. পিডিএফ সেভ করা
document.getElementById('save-pdf-btn').addEventListener('click', async () => {
    const { PDFDocument } = PDFLib;
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]);
    const jpgImageBytes = await fetch(processedImage.src).then(res => res.arrayBuffer());
    const jpgImage = await pdfDoc.embedJpg(jpgImageBytes);
    
    page.drawImage(jpgImage, { x: 50, y: 50, width: 500, height: 700 });
    
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'SHM_Scan.pdf';
    link.click();
});

initCamera();
