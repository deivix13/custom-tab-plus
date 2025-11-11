import { ReactElement, useEffect, useState } from "react";
import { Gallery } from "../../components/Gallery";
import { Form } from "../../components/Form";
import { deleteData, getRandomData } from "../../services/indexdb-service";
import Logo from "../../assets/logo.svg";
import Setting from "../../assets/settings-icon.svg";
import Close from "../../assets/close-icon.svg";
import { imageData } from "../../types/image";

export function App(): ReactElement {
    const [isVisible, setIsVisible] = useState(false);
    const togglePanel = () => setIsVisible(prev => !prev);

    const [refreshGallery, setRefreshGallery] = useState(false);
    const handleGallery = () => setRefreshGallery(prev => !prev);

    const [randomImage, setRandomImage] = useState<imageData | null>(null)

    // Get random image from IndexedDB
    useEffect(() => {
        const fetchRandom = async () => {
            const data = await getRandomData();
            setRandomImage(data);
        }
        fetchRandom();
    }, [])

    // Set random image as background
    useEffect(() => {
        if (!randomImage) return;

        const url = URL.createObjectURL(randomImage.blob);

        document.body.style.backgroundImage = `url(${url})`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundRepeat = 'no-repeat';
        document.body.style.backgroundAttachment = 'fixed';

        return () => {
            document.body.style.backgroundImage = '';
            URL.revokeObjectURL(url);
        };
    }, [randomImage]);

    // Delete image
    const handleDelete = async (id: string) => {
        await deleteData(id);
        handleGallery();
    }

    const iconStyle = "w-[2rem] h-[2rem] absolute top-0 left-0 transition-opacity transition-transform duration-300 ease-in-out z-100";

    return (
        <>
            {/* Button to open and close side panel */}
            <div className="fixed top-0 left-0 z-50 p-2">
                <button
                    onClick={togglePanel}
                    className="bg-transparent border-0 cursor-pointer p-0 relative w-8 h-8"
                >
                    {/*Setting button*/}
                    <img src={Setting} alt="Settings"
                        className={`${iconStyle} ${!isVisible
                            ? "opacity-100 rotate-0 scale-100"
                            : "opacity-0 rotate-[180deg] scale-50 pointer-events-none"
                            }`}
                    />

                    {/*Close button*/}
                    <img src={Close} alt="Close"
                        className={`${iconStyle} ${isVisible
                            ? "opacity-100 rotate-0 scale-100"
                            : "opacity-0 rotate-[180deg] scale-50 pointer-events-none"
                            }`}
                    />
                </button>
            </div>

            {isVisible && (
                <div
                    className={`overflow-auto fixed top-0 left-0 m-2 h-[95dvh] w-[40dvh] rounded-md bg-gray-100 transition-transform duration-300 
                        ease-in-out ${isVisible ? "translate-x-0" : "-translate-x-full"}`}
                >
                    <div className="flex flex-col items-center gap-4 p-4">
                        <img src={Logo} alt="Logo" className="w-[6.9rem] h-[6.9rem]" />
                        <h1 className="text-3xl font-bold">CustomTabs</h1>
                        <Form onUpload={handleGallery} />
                        <Gallery refresh={refreshGallery} onDelete={handleDelete} />
                    </div>
                </div>
            )}
        </>
    );
}
