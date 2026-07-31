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
    alert("Processing Document...");
});

// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js');
}

initCamera();