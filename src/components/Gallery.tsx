import { getAllData } from "../services/indexdb-service";
import { imageData } from "../types/image";
import { useEffect, useState } from "react";

type GalleryProps = {
    refresh: boolean;
    onDelete: (id: string) => void;
}

/*
    Here we will use the thumbnails saved in IndexedDB to show a gallery of images.
    Because the thumbnails are smaller in size, the gallery will load faster and use less memory.
*/
export function Gallery({ refresh, onDelete }: Readonly<GalleryProps>) {

    const [gallery, setGallery] = useState<imageData[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchGalleryData = async () => {
            try {
                const data = await getAllData();
                setGallery(data);
            } catch (error) {
                setError("Error fetching gallery data");
                setGallery([]);
            }
        };
        fetchGalleryData();
    }, [refresh]);

    return (
        <div className="overflow-auto h-[50dvh] w-full grid grid-cols-2 gap-2 auto-rows-[11rem]">
            {error && <p className="col-span-2 text-red-500">{error}</p>}
            {gallery.map((element) => (
                <div key={element.id} className="flex justify-center items-center relative group">
                    <img
                        src={URL.createObjectURL(element.thumbnail)}
                        alt={element.name}
                        className="w-[11rem] h-[11rem] object-cover rounded-md group-hover:brightness-75"
                    />
                    <button
                        onClick={() => onDelete(element.id)}
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
             hidden group-hover:block bg-red-500 text-white p-1 rounded hover:cursor-pointer"
                    >
                        Delete
                    </button>
                </div>
            ))}
        </div>
    );
}