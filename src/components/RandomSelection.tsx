import React, { useState } from 'react'

interface Props {
};

const RandomSelection = ({ }: Props) => {
  const [roster, setRoster] = useState<string[]>([]);
  const [isNumbered, setIsNumbered] = useState(false);
  const [isRosterLoaded, setIsRosterLoaded] = useState(false);
  const [isRosterDisplayed, setIsRosterDisplayed] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
  };

  const handleFileUpload = () => {
    if (!selectedFile) {
      window.alert('No file input!');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const fileContent = e.target?.result;
      if (typeof fileContent === "string") {
        const names = fileContent
          .split('\n')
          .map((name) => name.trim())
          .filter((name) => name);
        setRoster(names);
      }
    };

    reader.onerror = () => {
      alert("Error reading file, try again!");
    };

    reader.readAsText(selectedFile);
    setIsRosterLoaded(true);
    setIsRosterDisplayed(true);
  }

  return (
    <div>
      {/* UPLOAD FILE INPUT AND BUTTONS FOR STUDENT ROSTER */}
      <h2>Upload Student Roster</h2>
      <input type="file" accept=".txt" onChange={handleFileChange} />
      <button onClick={handleFileUpload} disabled={!selectedFile}>Upload</button>
      <br />

      {/* OPTIONS FOR THE ROSTER */}
      {isRosterLoaded && (
        <label>
          <input
            type="checkbox"
            checked={isRosterDisplayed}
            onChange={(e) => setIsRosterDisplayed(e.target.checked)}
          />
          {isRosterDisplayed ? "Hide Roster" : "Show Roster"}
        </label>
      )}

      {isRosterDisplayed && (
        <label>
          <input type="checkbox" checked={isNumbered} onChange={() => setIsNumbered((prev) => !prev)} />
          {isNumbered ? "Hide roster numbers" : "Show roster numbers"}
        </label>
      )}

      {/* DISPLAY THE LIST OF NAMES */}
      <h2>Roster:</h2>
      {!isRosterLoaded ? (
        <p>No roster uploaded.</p>
      ) : (
      roster.length > 0 && isRosterDisplayed ? (
        <table>
          <thead>
            <tr>
              {isNumbered && <th>#</th>}
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {roster.map((name, index) => (
              <tr
                key={index}
                style={{
                  cursor: "pointer",
                }}
              >
                {isNumbered && <td>{index + 1}</td>}
                <td>{name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) :
       null
      )}

      {/* SPACE FOR FUTURE OPTIONS */}
    </div>
  )
};

export default RandomSelection
