import { JSX, useRef, useState } from "react";
import { uploadImage } from "../services/form-service";

export function Form({ onUpload }: Readonly<{ onUpload: () => void }>): JSX.Element {

  type uploadStatus = "" | "Uploading" | "Success" | "Error";
  const [status, setStatus] = useState<uploadStatus>("");
  
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : null;
    if (!files || files.length === 0) return;

    setStatus("Uploading");
    try {
      await uploadImage(files);
      setStatus("Success");
      onUpload();
    } catch (err) {
      setStatus("Error");
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="bg-blue-100 flex flex-col justify-center items-center p-2 rounded-md border border-blue-300">
      <span className="text-xl mb-1">Upload Images</span>

      <input
        id="files"
        ref={inputRef}
        type="file"
        accept="image/jpeg, image/png"
        multiple
        onChange={handleChange}
        className="hidden"
      />

      <label
        htmlFor="files"
        className="text-sm cursor-pointer bg-white p-2 rounded-md shadow-sm hover:bg-blue-50"
      >
        Select file(s)
      </label>

      <p className="mt-2 text-sm text-gray-700">{status}</p>
    </div>
  );
}
