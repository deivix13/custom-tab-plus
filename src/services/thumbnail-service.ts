export async function generateThumbnail(imageBlob: Blob): Promise<Blob> {
    const img = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) throw new Error("Canvas not supported");

    const url = URL.createObjectURL(imageBlob);

    // Wait for the image to load
    await new Promise<void>((resolve, reject) => {
        img.onload = () => {
            URL.revokeObjectURL(url);
            resolve();
        };
        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error("Error loading image"));
        };
        img.src = url;
    });

    // Resize while maintaining aspect ratio
    const MAX_WIDTH = 370;
    const MAX_HEIGHT = 370;
    let width = img.width;
    let height = img.height;

    if (width > height) {
        if (width > MAX_WIDTH) {
            height = Math.round(height * MAX_WIDTH / width);
            width = MAX_WIDTH;
        }
    } else {
            width = Math.round(width * MAX_HEIGHT / height);
            height = MAX_HEIGHT;
    }

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, 0, 0, width, height);

    // Convert canvas to Blob
    return await canvasToBlob(canvas);
}

function canvasToBlob(canvas: HTMLCanvasElement, quality = 0.7): Promise<Blob> {
    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Error generating thumbnail"))), "image/jpeg", quality);
    });
}
