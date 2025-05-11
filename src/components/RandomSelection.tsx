import { useEffect, useState } from "react";
import {
  loadRoster,
  saveRoster,
  resetAll,
  deleteRoster,
  listRosterNames,
} from "../utils/rosterStorage";
import { parseRosterUpload } from "../utils/parseRosterUpload";
import "../styles/RandomSelection.css";
import SpinNames from "./SpinNames";
import Roster from "./Roster";
import RandomSelectControls from "./RandomSelectControls";
import RosterUploadButton from "./RosterUploadButton";

const RandomSelection = () => {
  // Shared state
  const [rosterList, setRosterList] = useState<string[]>([]);
  const [absentList, setAbsentList] = useState<string[]>([]);

  const [spinnerCount, setSpinnerCount] = useState(1); // num of spinners on the screen
  const [spinnerNames, setSpinnerNames] = useState<string[]>([]); // manages the names assigned on each spinner

  const [selectedNames, setSelectedNames] = useState<string[]>([]);
  const [selectedRoster, setSelectedRoster] = useState<string>("Roster");
  const [sortedRoster, setSortedRoster] = useState<string[]>([]);

  const [isRosterLoaded, setIsRosterLoaded] = useState<boolean>(false);
  const [isRosterDisplayed, setIsRosterDisplayed] = useState<boolean>(true);
  const [isNumbered, setIsNumbered] = useState<boolean>(false);
  const [isSorted, setIsSorted] = useState<boolean>(false);
  const [isSpinning, setIsSpinning] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string>("");

  // Initial check for existing roster
  useEffect(() => {
    const savedRosters = listRosterNames();
    if (savedRosters.length > 0) {
      const lastUsed = localStorage.getItem("lastUsedRoster");
      let rosterToLoad = "";
      if (lastUsed && savedRosters.includes(JSON.parse(lastUsed))) {
        rosterToLoad = JSON.parse(lastUsed);
      } else {
        rosterToLoad = savedRosters[0];
      }

      setSelectedRoster(rosterToLoad);
    }
  }, []);

  /* load save data on component mount */
  useEffect(() => {
    const data = loadRoster(selectedRoster);
    if (data) {
      setRosterList(data.rosterList);
      setAbsentList(data.absentList);
      setSelectedNames(data.selectedNames);
      setSpinnerCount(data.spinnerCount);
      setIsRosterLoaded(true);
    }
  }, [selectedRoster]);

  /* save names and roster */
  useEffect(() => {
    if (isRosterLoaded) {
      saveRoster(selectedRoster, {
        rosterList,
        absentList,
        selectedNames,
        spinnerNames,
        spinnerCount,
      });
    }
  }, [
    rosterList,
    absentList,
    selectedNames,
    spinnerNames,
    spinnerCount,
    selectedRoster,
    isRosterLoaded,
  ]);

  useEffect(() => {
    const sorted = [...rosterList].sort();
    setSortedRoster(sorted);
  }, [rosterList]);

  const handleRosterDisplayed = () => setIsRosterDisplayed((prev) => !prev);
  const handleIsNumbered = () => setIsNumbered((prev) => !prev);
  const handleSort = () => setIsSorted((prev) => !prev);

  /*******************/
  /* SPINNER SECTION */
  /*******************/
  const calculateNumAvailableNames = () => {
    return rosterList.filter(
      (name) => !selectedNames.includes(name) && !absentList.includes(name),
    ).length;
  };

  const handleSpinnerCountChange = (newCount: number) => {
    if (isSpinning) return;
    setSpinnerCount(newCount);
    setSpinnerNames([]);
  };

  const handleSpinning = () => {
    const availableNamesCount = calculateNumAvailableNames();
    const tempSpinnerNames = Array(spinnerCount).fill("");
    const intervals: number[] = [];

    if (isSpinning || spinnerCount > availableNamesCount) return;
    setIsSpinning(true);

    /* Start spinning all spinners */
    tempSpinnerNames.forEach((_, index) => {
      let tempIdx = index % rosterList.length;
      const interval = setInterval(() => {
        tempSpinnerNames[index] = rosterList[tempIdx];
        tempIdx = (tempIdx + 1) % rosterList.length;
        setSpinnerNames([...tempSpinnerNames]);
      }, 100);
      intervals.push(interval);
    });

    /* Stop all spinners */
    setTimeout(() => {
      intervals.forEach(clearInterval);

      const availableNames: string[] = rosterList.filter(
        (name) => !selectedNames.includes(name) && !absentList.includes(name),
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
      // const remainingNamesCount = rosterList.length - selectedNames.length;
      const remainingNamesCount = calculateNumAvailableNames();
      if (spinnerCount > remainingNamesCount) {
        setSpinnerCount(remainingNamesCount);
      }
    }, 3000);
  };

  const validateRosterName = (rosterName: string) => {
    const trimmed = rosterName.trim();
    if (!trimmed) return "Roster name is required";
    if (listRosterNames().includes(trimmed))
      return "Roster name must be unique!";
    return null;
  };

  const restoreDefaultValues = () => {
    setAbsentList([]);
    setSelectedNames([]);
    setSpinnerNames([]);
    setSpinnerCount(1);
    setErrorMessage("");
  };

  const handleRosterChange = (nextRoster: string) =>
    setSelectedRoster(nextRoster);

  // Add a new roter using the current roster list
  const handleAddRoster = (newRosterName: string) => {
    const error = validateRosterName(newRosterName);
    if (error) {
      setErrorMessage(error);
      return;
    }

    saveRoster(newRosterName, { rosterList: rosterList });
    setSelectedRoster(newRosterName);
    restoreDefaultValues();
  };

  // Add a new roster using uploaded list
  const handleUploadRoster = (newRosterName: string, names: string[]) => {
    const error = validateRosterName(newRosterName);
    if (error) {
      setErrorMessage(error);
      return;
    }

    const cleanedNames = names.map((name) => name.trim()).filter(Boolean);

    saveRoster(newRosterName, {
      rosterList: cleanedNames,
    });

    setSelectedRoster(newRosterName);
    restoreDefaultValues();
  };

  const handleEditRoster = (newName: string, oldName: string) => {
    const error = validateRosterName(newName);
    if (error) {
      setErrorMessage(error);
      return;
    }

    // Update name in roster list
    const updatedRosterList = rosterList.map((name) =>
      name === oldName ? newName : name,
    );
    setRosterList(updatedRosterList);
    setSelectedRoster(newName);

    // Update local storage
    const data = loadRoster(oldName);
    if (data) {
      saveRoster(newName, data);
      deleteRoster(oldName);
    }
  };

  const handleDeleteRoster = (deleteName: string) => {
    if (rosterList.length === 1) {
      alert("At least one roster must remain.");
      return;
    }
    const updatedRosterList = rosterList.filter((name) => name !== deleteName);
    setRosterList(updatedRosterList);
    deleteRoster(deleteName);
    if (selectedRoster === deleteName) {
      setSelectedRoster(updatedRosterList[0] || "");
    }
  };

  const handleReset = () => {
    setSpinnerNames([]);
    setSelectedNames([]);
  };

  const handleClearAbsent = () => {
    if (confirm("Clear absences for this roster?")) {
      setAbsentList([]);
    }
  };

  /* RESET EVERYTHING FOR NEW ROSTER UPLOAD */
  const handleGoBack = () => {
    resetAll();
    setRosterList([]);
    setIsRosterDisplayed(true);
    setIsRosterLoaded(false);
    restoreDefaultValues();
  };

  return (
    <>
      {!isRosterLoaded && (
        <div className="upload-container">
          <h2>Upload Student Roster</h2>
          <RosterUploadButton
            onFileUpload={(content) => {
              const result = parseRosterUpload(content);
              if (!result) return;
              handleUploadRoster(result.rosterName, result.names);
            }}
          />
        </div>
      )}

      {/* MAIN CONTENT */}
      {isRosterLoaded && (
        <div className="main-container">
          {/* CONTROLS SECTION */}
          <RandomSelectControls
            numAvailableNames={calculateNumAvailableNames()}
            spinnerCount={spinnerCount}
            isRosterDisplayed={isRosterDisplayed}
            isNumbered={isNumbered}
            isSorted={isSorted}
            isSpinning={isSpinning}
            handleSpinnerCountChange={handleSpinnerCountChange}
            handleRosterDisplayed={handleRosterDisplayed}
            handleIsNumbered={handleIsNumbered}
            handleSort={handleSort}
            handleSpinning={handleSpinning}
            handleReset={handleReset}
            handleGoBack={handleGoBack}
            handleClearAbsent={handleClearAbsent}
          />
          {/* END CONTROLS SECTION */}

          {/* ROSTER AND NAME SPINNER */}
          <div className="d-flex justify-content-between">
            {isRosterDisplayed && (
              <div className="me-auto">
                <Roster
                  isNumbered={isNumbered}
                  roster={isSorted ? sortedRoster : rosterList}
                  rosterName={selectedRoster}
                  absentList={absentList}
                  setAbsentList={setAbsentList}
                  handleRosterChange={handleRosterChange}
                  handleAddRoster={handleAddRoster}
                  handleUploadRoster={handleUploadRoster}
                  handleEditRoster={handleEditRoster}
                  handleDeleteRoster={handleDeleteRoster}
                  errorMessage={errorMessage}
                />
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
