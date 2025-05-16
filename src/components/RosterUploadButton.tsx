import { forwardRef, useState } from "react";

interface FileUploadbuttonProps {
  onFileUpload: (fileContent: string) => void;
}

const RosterUploadButton = forwardRef<HTMLInputElement, FileUploadbuttonProps>(
  ({ onFileUpload }, ref) => {
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files?.[0];
      setFile(selectedFile || null);
    };

    const handleFileUpload = () => {
      if (!file) {
        window.alert("No file input!");
        return;
      }

      /* READ THE FILE AND SET THE NAMES INTO ROSTER  */
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const fileContent = e.target?.result;
        if (typeof fileContent === "string") {
          onFileUpload(fileContent);
          setFile(null);
        }
      };

      reader.onerror = () => alert("Error reading file, try again!");

      // the roster is successfully uploaded
      reader.readAsText(file);
    };

    return (
      <div className="bg-white shadow-md rounded-md p-4 w-full max-w-sm mx-auto space-y-4">
        <input
          type="file"
          accept=".txt"
          className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
          onChange={handleFileChange}
          ref={ref}
        />
        <button
          className="w-full py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleFileUpload}
          disabled={!file}
        >
          Upload Roster
        </button>
      </div>
    );
  },
);

export default RosterUploadButton;
