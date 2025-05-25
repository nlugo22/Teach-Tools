import { forwardRef, useState } from "react";

interface FileUploadbuttonProps {
  onFileUpload: (fileContent: string) => void;
  className: string;
}

const RosterUploadButton = forwardRef<HTMLInputElement, FileUploadbuttonProps>(
  ({ onFileUpload, className }, ref) => {
    const [file, setFile] = useState<File | null>(null);
    const [textAreaValue, setTextAreaValue] = useState<string>("");

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files?.[0];
      setFile(selectedFile || null);
    };

    const handleFileUpload = () => {
      if (textAreaValue.trim()) {
        onFileUpload(textAreaValue.trim());
        setTextAreaValue("");
        return;
      }

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
      <div className={className}>
        <textarea
          className="flex border bg-dark"
          placeholder="Enter names separated by an enter."
          value={textAreaValue}
          onChange={(e) => {
            setTextAreaValue(e.target.value);
            if (file) {
              setFile(null);
            }
          }}
        />
        <div className="bg-white rounded-md w-full max-w-sm mx-auto space-y-1">
          <input
            type="file"
            accept=".txt"
            className="cursor-pointer block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 disabled:cursor-not-allowed 
             disabled:file:bg-gray-400 disabled:file:text-gray-100"
            onChange={handleFileChange}
            ref={ref}
            disabled={textAreaValue.trim().length > 0}
          />
          <button
            className="cursor-pointer w-full py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleFileUpload}
            disabled={!file && !textAreaValue.trim()}
          >
            Upload Roster
          </button>
        </div>
      </div>
    );
  },
);

export default RosterUploadButton;
