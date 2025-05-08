import { forwardRef, useState } from "react";

interface FileUploadbuttonProps {
    onFileUpload: (fileContent: string) => void;
}

const RosterUploadButton = forwardRef<HTMLInputElement, FileUploadbuttonProps>(({ onFileUpload, }, ref) => {
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
            }
        };

        reader.onerror = () => alert("Error reading file, try again!");

        // the roster is successfully uploaded
        reader.readAsText(file);
    };

    return (
        <div className="">
            <input
                type="file"
                accept=".txt"
                onChange={handleFileChange}
                ref={ref}
            />
            <button className="btn btn-primary text-white" onClick={handleFileUpload} disabled={!file}>Upload Roster</button>
        </div>
    )
}
);

export default RosterUploadButton