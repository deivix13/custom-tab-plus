import { saveData } from "./indexdb-service";
import { generateThumbnail } from "./thumbnail-service";
import { imageData, imageType } from "../types/image";

export async function uploadImage(fileSource: File | File[]): Promise<void> {
  const files = Array.isArray(fileSource) ? fileSource : [fileSource];

  const dataFiles: imageData[] = await Promise.all(
    files
      .filter(file => file.type === "image/png" || file.type === "image/jpeg")
      .map(async file => {
        let thumbnail: Blob;
        try {
          thumbnail = await generateThumbnail(file);
        } catch {
          thumbnail = file;
        }

        return {
          id: "image_" + Date.now() + Math.random().toString(36).slice(2),
          blob: file,
          type: file.type as imageType,
          name: file.name,
          thumbnail,
          uploadedAt: new Date()
        };
      })
  );

  await saveData(dataFiles);
}
