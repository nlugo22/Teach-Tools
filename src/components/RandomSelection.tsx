import React, { useEffect, useState } from "react";
import "../styles/RandomSelection.css";
import SpinNames from "./SpinNames";
import Roster from "./Roster";
import RandomSelectControls from "./RandomSelectControls";

const RandomSelection = () => {
  /* ROSTER VARIABLES */
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [roster, setRoster] = useState<string[]>([]);
  /* const [absent, setAbsent] = useState<string[]>([]); */
  const [selectedNames, setSelectedNames] = useState<string[]>([]);
  const [numAvailableNames, setNumAvailableNames] = useState(0); // used to set select element for max num of spinners
  const [isNumbered, setIsNumbered] = useState(false);
  const [isRosterLoaded, setIsRosterLoaded] = useState(false);
  const [isRosterDisplayed, setIsRosterDisplayed] = useState(false);

  /* SPINNER VARIABLES */
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinnerCount, setSpinnerCount] = useState(1); // num of spinners on the screen
  const [spinnerNames, setSpinnerNames] = useState<string[]>([]); // manages the names assigned on each spinner

  /* load save data on component mount */
  useEffect(() => {
    const savedRoster = localStorage.getItem("roster");
    const savedSelectedNames = localStorage.getItem("selectedNames");
    const savedSpinnerNames = localStorage.getItem("spinnerNames");
    if (savedRoster && !isRosterLoaded) {
      setRoster(JSON.parse(savedRoster));
      setIsRosterLoaded(true);
      setIsRosterDisplayed(true);
    }

    if (savedSelectedNames) {
      setSelectedNames(JSON.parse(savedSelectedNames));
    }
    
    if (savedSpinnerNames) {
      setSpinnerNames(JSON.parse(savedSpinnerNames));
      setSpinnerCount(JSON.parse(savedSpinnerNames).length);
    }
  }, [isRosterLoaded]);

  /* save names and roster */
  useEffect(() => {
    if (isRosterLoaded) {
      localStorage.setItem("roster", JSON.stringify(roster));
      localStorage.setItem("selectedNames", JSON.stringify(selectedNames));
      localStorage.setItem("spinnerNames", JSON.stringify(spinnerNames));
      localStorage.setItem("spinCount", JSON.stringify(spinnerCount));
    }
  }, [roster, selectedNames, isRosterLoaded]);

  /*******************/
  /* ROSTER SECTION */
  /*******************/
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
  };

  const handleFileUpload = () => {
    if (!selectedFile) {
      window.alert("No file input!");
      return;
    }
    /* READ THE FILE AND SET THE NAMES INTO ROSTER  */
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const fileContent = e.target?.result;
      if (typeof fileContent === "string") {
        const names = fileContent
          .split("\n")
          .map((name) => name.trim())
          .filter((name) => name);
        setRoster(names);
      }
    };

    reader.onerror = () => {
      alert("Error reading file, try again!");
    };
    // the roster is successfully uploaded
    reader.readAsText(selectedFile);
    setIsRosterLoaded(true);
    setIsRosterDisplayed(true);
  };

  /* set number of names after the roster is set used for select element */
  useEffect(() => {
    // TODO: SET TO ROSTER MINUS SELECTED OR ABSENT NAMES
    setNumAvailableNames(roster.length - selectedNames.length);
  }, [roster, selectedNames]);

  const handleRosterDisplayed = () => setIsRosterDisplayed((prev) => !prev);
  const handleIsNumbered = () => setIsNumbered((prev) => !prev);

  /*******************/
  /* SPINNER SECTION */
  /*******************/
  const handleSpinnerCountChange = (newCount: number) => {
    if (isSpinning) return;

    /* const maxCount = Math.max(0, roster.length - selectedNames.length); */
    setSpinnerCount(newCount);
    setSpinnerNames([]);
  };

  const handleSpinning = () => {
    const availableNamesCount = roster.length - selectedNames.length;
    if (isSpinning || spinnerCount > availableNamesCount) return;

    setIsSpinning(true);
    const tempSpinnerNames = Array(spinnerCount).fill("");
    const intervals: number[] = [];

    /* Start spinning all spinners */
    tempSpinnerNames.forEach((_, index) => {
      let tempIdx = index % roster.length;
      const interval = setInterval(() => {
        tempSpinnerNames[index] = roster[tempIdx];
        tempIdx = (tempIdx + 1) % roster.length;
        setSpinnerNames([...tempSpinnerNames]);
      }, 100);
      intervals.push(interval);
    });

    /* Stop all spinners */
    setTimeout(() => {
      intervals.forEach(clearInterval);

      const availableNames: string[] = roster.filter(
        (name) => !selectedNames.includes(name),
      );
      const finalNames: string[] = [];

      for (let i = 0; i < spinnerCount; i++) {
        const randomIndex = Math.floor(Math.random() * availableNames.length);
        finalNames.push(availableNames.splice(randomIndex, 1)[0]); // pushes the chosen name into final and removes from available names
      }

      setSpinnerNames(finalNames);
      setSelectedNames((prevNames) => [...prevNames, ...finalNames]);
      setIsSpinning(false);

      /* Adjust spinner count */
      const remainingNamesCount = roster.length - selectedNames.length;
      if (spinnerCount > remainingNamesCount) {
        setSpinnerCount(remainingNamesCount);
      }
    }, 3000);
  };

  const handleReset = () => {
    setSpinnerNames([]);
    setSelectedNames([]);
  };

  /* RESET EVERYTHING FOR NEW ROSTER UPLOAD */
  const handleGoBack = () => {
    localStorage.removeItem("roster");
    localStorage.removeItem("selectedNames");

    setSelectedFile(null);
    setRoster([]);
    setIsRosterDisplayed(false);
    setIsRosterLoaded(false);
    setSelectedNames([]);
    setSpinnerNames([]);
    setSpinnerCount(1);
  };

  return (
    <>
      {/* UPLOAD FILE INPUT */}
      {!isRosterLoaded && (
        <div className="upload-container">
          <h2>Upload Student Roster</h2>
          <input
            className="btn text-white"
            type="file"
            accept=".txt"
            onChange={handleFileChange}
          />
          <button
            className="btn btn-primary text-white"
            onClick={handleFileUpload}
            disabled={!selectedFile}
          >
            Upload
          </button>
        </div>
      )}

      {/* MAIN CONTENT */}
      {isRosterLoaded && (
        <div className="main-container">
          {/* CONTROLS SECTION */}
          <RandomSelectControls
            numAvailableNames={numAvailableNames}
            spinnerCount={spinnerCount}
            isRosterDisplayed={isRosterDisplayed}
            isNumbered={isNumbered}
            isSpinning={isSpinning}
            handleSpinnerCountChange={handleSpinnerCountChange}
            handleRosterDisplayed={handleRosterDisplayed}
            handleIsNumbered={handleIsNumbered}
            handleSpinning={handleSpinning}
            handleReset={handleReset}
            handleGoBack={handleGoBack}
          />
          {/* END CONTROLS SECTION */}

          {/* ROSTER AND NAME SPINNER */}
          <div className="d-flex justify-content-between">
            {/* <div className="col-1"> */}
            {roster.length > 0 && isRosterDisplayed && (
              <div className="me-auto">
                <Roster isNumbered={isNumbered} roster={roster} />
              </div>
            )}

            {/* SPIN COMPONENT */}
            <div className="d-flex mx-auto">
              <SpinNames
                spinnerNames={spinnerNames}
                spinnerCount={spinnerCount}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RandomSelection;
