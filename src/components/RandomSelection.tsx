import React, { useState } from 'react'
import '../styles/RandomSelection.css'
import SpinNames from './SpinNames';

interface Props {
};

const RandomSelection = ({ }: Props) => {
  const [roster, setRoster] = useState<string[]>([]);
  const [selectedNames, setSelectedNames] = useState<string[]>([]);
  // const [absent, setAbsent] = useState<string[]>([]);
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
    {/* READ THE FILE AND SET THE NAMES INTO ROSTER */ }
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
  };

  const handleRosterDisplayed = () => {
    setIsRosterDisplayed((prevState) => !prevState);
  }

  const pickRandomName = (count: number) => {
    let remainingNames: string[] = roster.filter((name) => !selectedNames.includes(name));
    let chosenNames: string[] = [];

    for (let i = 0; i < count; i++) {
      if (remainingNames.length === 0) break;
      const randIdx = Math.floor(Math.random() * remainingNames.length);
      const currName = remainingNames[randIdx];
      chosenNames.push(currName);
      remainingNames = remainingNames.filter((name) => name !== currName);
    }

    setSelectedNames((prevNames: string[]) => [...prevNames, ...chosenNames]);
  };

  const resetSelection = () => { setSelectedNames([]); }

  return (
    <>
      {/* UPLOAD FILE INPUT */}
      {!isRosterLoaded && (
        <div className="upload-container">
          <h2>Upload Student Roster</h2>
          <input className="btn text-white" type="file" accept=".txt" onChange={handleFileChange} />
          <button className="btn btn-primary text-white" onClick={handleFileUpload} disabled={!selectedFile}>Upload</button>
        </div>)
      }

      {/* MAIN CONTENT */}
      {isRosterLoaded && (
        <div className="main-container">

          {/* CONTROLS SECTION */}
          <div className="random-select-controls">

            {/* HIDE/SHOW ROSTER */}
            <button className="btn btn-primary" onClick={handleRosterDisplayed}>
              {isRosterDisplayed ? "Hide Roster" : "Show Roster"}
            </button>

            {/* ADD NUMBERS TO ROSTER */}
            {isRosterDisplayed && (
              <label>
                <input type="checkbox" checked={isNumbered} onChange={() => setIsNumbered((prev) => !prev)} />
                {isNumbered ? "Hide roster numbers" : "Show roster numbers"}
              </label>
            )}

            {/* PICK RANDOM NAMES */}
            <button className="btn btn-primary" onClick={() => pickRandomName(3)}>
              Choose a name
            </button>

            {/* RESET SELECTED NAMES */}
            <button className="btn btn-danger" onClick={() => resetSelection()}>
              Reset
            </button>
          </div>
          {/* END CONTROLS SECTION */}

          {/* ROSTER AND NAME SPINNER */}
          <div className="random-container">

            {/* ROSTER */}
            {(roster.length > 0 && isRosterDisplayed) && (
              <div className="roster-container">
                <h2 className="roster-title">Roster:</h2>
                <table>
                  <thead>
                    <tr>
                      {isNumbered && <th>#</th>}
                      <th>Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roster.map((name, index) => (
                      <tr key={index} className="roster-rows">
                        {isNumbered && <td>{index + 1}</td>}
                        <td>{name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* SPIN COMPONENT */}
            <div className="spin-container">
              <SpinNames selectedNames={selectedNames} />
            </div>
          </div >
        </div >
      )}
    </>
  );
}

export default RandomSelection;
