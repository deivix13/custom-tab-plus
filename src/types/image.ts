export type imageType = "image/png" | "image/jpeg";

export type imageData = {
    id: string;
    blob: Blob;
    type: imageType;
    name: string;
    thumbnail: Blob;
    uploadedAt: Date;
}