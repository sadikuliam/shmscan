// OpenCV লোড হলে এই ফাংশনটি চলবে
function onOpenCvReady() {
    console.log("OpenCV.js is ready!");
}
// Initialize App
const video = document.getElementById('video-preview');

async function initCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment', width: { ideal: 4096 }, height: { ideal: 2160 } } 
        });
        video.srcObject = stream;
    } catch (err) {
        console.error("Camera access denied", err);
    }
}

// Logic for scanning
document.getElementById('scan-doc-btn').addEventListener('click', () => {
    // 1. Grab current frame from video
    const canvas = document.getElementById('hidden-canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    
    // 2. Perform Image Processing (OpenCV logic here)
   // ... (আপনার আগের কোড)

// 2. Perform Image Processing
// alert("Processing Document...");  <-- এই লাইনটি মুছে ফেলুন বা কমেন্ট করে দিন

// OpenCV লজিক এখানে শুরু হচ্ছে
try {
    let src = cv.imread('hidden-canvas'); // ক্যানভাস থেকে ছবি রিড করা
    let dst = new cv.Mat();
    
    // ছবিটিকে গ্রে-স্কেল (কালো-সাদা) করা
    cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
    
    // ছবিটিকে আবার ক্যানভাসে দেখানো
    cv.imshow('hidden-canvas', dst);
    
    // মেমরি পরিষ্কার করা (ভুল এড়ানোর জন্য জরুরি)
    src.delete(); 
    dst.delete();
    
    console.log("Image processed successfully!");
} catch (err) {
    console.error("OpenCV processing failed:", err);
    alert("স্ক্যানিং করার সময় সমস্যা হয়েছে। দয়া করে OpenCV চেক করুন।");
}

// ... (আপনার পরের কোড)
});

// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js');
}

initCamera();
async function saveAsPDF() {
    const { PDFDocument } = PDFLib;
    const canvas = document.getElementById('hidden-canvas');
    
    // ক্যানভাস থেকে ইমেজ ডাটা নেওয়া
    const imageBytes = await fetch(canvas.toDataURL('image/jpeg')).then(res => res.arrayBuffer());
    
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]); // A4 সাইজ
    
    // ইমেজটিকে পিডিএফ-এ এমবেড করা
    const jpgImage = await pdfDoc.embedJpg(imageBytes);
    page.drawImage(jpgImage, { x: 50, y: 50, width: 500, height: 700 });
    
    // পিডিএফ ডাউনলোড করা
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'SHM_Scan_' + new Date().getTime() + '.pdf';
    link.click();
}
