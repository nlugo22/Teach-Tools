import { useEffect, useState } from "react";
import {
  loadRoster,
  saveRoster,
  resetAll,
  deleteRoster,
  listRosterNames,
} from "../utils/rosterStorage";
import { parseRosterUpload } from "../utils/parseRosterUpload";
import SpinNames from "./SpinNames";
import Roster from "./Roster";
import RandomSelectControls from "./RandomSelectControls";
import RosterUploadButton from "./RosterUploadButton";

const RandomSelection = () => {
  // Shared state
  const [rosterList, setRosterList] = useState<string[]>([]);
  const [absentList, setAbsentList] = useState<string[]>([]);
  const [allRosters, setAllRosters] = useState<string[]>([]);

  const [spinnerCount, setSpinnerCount] = useState(1);
  const [spinnerNames, setSpinnerNames] = useState<string[]>([]);
  const [selectedNames, setSelectedNames] = useState<string[]>([]);
  const [selectedRoster, setSelectedRoster] = useState<string>("");
  const [sortedRoster, setSortedRoster] = useState<string[]>([]);

  const [isRosterLoaded, setIsRosterLoaded] = useState<boolean>(false);
  const [isRosterDisplayed, setIsRosterDisplayed] = useState<boolean>(true);
  const [isNumbered, setIsNumbered] = useState<boolean>(false);
  const [isSorted, setIsSorted] = useState<boolean>(false);
  const [isSpinning, setIsSpinning] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string>("");

  // Initial check for existing roster
  useEffect(() => {
    if (allRosters.length > 0) {
      const lastUsed = localStorage.getItem("lastUsedRoster");
      let rosterToLoad = "";
      if (lastUsed && allRosters.includes(lastUsed)) {
        rosterToLoad = lastUsed;
      } else {
        rosterToLoad = allRosters[0];
      }

      setSelectedRoster(rosterToLoad);
    }
  }, [allRosters]);

  // Load when the selectedRoster changes
  useEffect(() => {
    if (selectedRoster) {
      const data = loadRoster(selectedRoster);
      if (data) {
        setRosterList(data.rosterList);
        setAbsentList(data.absentList);
        setSelectedNames(data.selectedNames);
        setSpinnerCount(data.spinnerCount);
        setSpinnerNames(data.spinnerNames);
        setIsRosterLoaded(true);

        localStorage.setItem("lastUsedRoster", selectedRoster);
      }
    }
  }, [selectedRoster]);

  useEffect(() => {
    if (isRosterLoaded) {
      setTimeout(() => {
        saveRoster(selectedRoster, {
          rosterList: rosterList,
          absentList: absentList,
          selectedNames: selectedNames,
          spinnerNames: spinnerNames,
          spinnerCount: spinnerCount,
        });
      }, 1000);
    }
  }, [absentList, selectedNames, spinnerCount]);

  useEffect(() => {
    setAllRosters(listRosterNames());
  }, []);

  // Sort the roster
  useEffect(() => {
    const sorted = [...rosterList].sort();
    setSortedRoster(sorted);
  }, [rosterList]);

  const handleRosterDisplayed = () => setIsRosterDisplayed((prev) => !prev);
  const handleIsNumbered = () => setIsNumbered((prev) => !prev);
  const handleSort = () => setIsSorted((prev) => !prev);
  const refreshAllRosters = () => {
    const storedRosters = listRosterNames();
    setAllRosters(storedRosters);
  };

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

  const handleAddRoster = (newRosterName: string) => {
    const error = validateRosterName(newRosterName);
    if (error) {
      setErrorMessage(error);
      return;
    }

    localStorage.setItem("lastUsedRoster", newRosterName);

    saveRoster(newRosterName, { rosterList: rosterList });
    setSelectedRoster(newRosterName);
    refreshAllRosters();
    restoreDefaultValues();
  };

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

    refreshAllRosters();

    setTimeout(() => {
      setSelectedRoster(newRosterName);
      localStorage.setItem("lastUsedRoster", newRosterName);
      restoreDefaultValues();
    }, 1000);
  };

  const handleEditRoster = (oldName: string, newName: string) => {
    if (!newName) return;
    const error = validateRosterName(newName);
    if (error) {
      setErrorMessage(error);
      return;
    }

    const data = loadRoster(oldName);
    if (!data) {
      setErrorMessage("Roster could not be found!");
      return;
    }
    saveRoster(newName, data);
    deleteRoster(oldName);

    const updated = listRosterNames();
    if (updated.includes(newName)) {
      setSelectedRoster(newName);
      localStorage.setItem("lastUsedRoster", newName);
    }

    refreshAllRosters();
  };

  const handleDeleteRoster = (deleteName: string) => {
    if (allRosters.length === 1) {
      alert("At least one roster must remain.");
      return;
    }

    if (!confirm(`Are you sure you want to delete ${deleteName}`)) return;
    deleteRoster(deleteName);
    refreshAllRosters();

    const newSelected = selectedRoster;

    if (newSelected === deleteName) {
      setSelectedRoster(allRosters[0] || "");
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

  const handleGoBack = () => {
    resetAll();
    setRosterList([]);
    setSelectedRoster("");
    setIsRosterDisplayed(true);
    setIsRosterLoaded(false);
    restoreDefaultValues();
    refreshAllRosters();
  };

  return (
    <div className="flex h-screen">
      {allRosters.length === 0 && (
        <div className="flex justify-center items-center flex-grow">
          <div className="bg-white shadow-md rounded-md p-6 max-w-sm w-full space-y-4">
            <h2 className="text-xl font-semibold mb-4 text-center">Upload Student Roster</h2>
            <RosterUploadButton
              onFileUpload={(content) => {
                const result = parseRosterUpload(content);
                if (!result) return;
                handleUploadRoster(result.rosterName, result.names);
              }}
            />
          </div>
        </div>
      )}

      {allRosters.length > 0 && (
        <>
          <div className="p-2">
            <RandomSelectControls
              spinnerCount={spinnerCount}
              handleSpinnerCountChange={handleSpinnerCountChange}
              handleSpinning={handleSpinning}
              isSpinning={isSpinning}
              handleRosterDisplayed={handleRosterDisplayed}
              isRosterDisplayed={isRosterDisplayed}
              isNumbered={isNumbered}
              numAvailableNames={calculateNumAvailableNames()}
              handleIsNumbered={handleIsNumbered}
              isSorted={isSorted}
              handleSort={handleSort}
              handleReset={handleReset}
              handleClearAbsent={handleClearAbsent}
              handleGoBack={handleGoBack}
              selectedNames={selectedNames}
            />
          </div>

          {isRosterDisplayed && (
            <div className="">
              <Roster
                isNumbered={isNumbered}
                allRosters={allRosters}
                roster={isSorted ? sortedRoster : rosterList}
                rosterName={selectedRoster}
                selectedNames={selectedNames}
                absentList={absentList}
                setAbsentList={setAbsentList}
                errorMessage={errorMessage}
                handleRosterChange={handleRosterChange}
                handleAddRoster={handleAddRoster}
                handleUploadRoster={handleUploadRoster}
                handleEditRoster={handleEditRoster}
                handleDeleteRoster={handleDeleteRoster}
              />
            </div>
          )}

          {/* SpinNames */}
          <div className="m-auto">
            <SpinNames
              spinnerNames={spinnerNames}
              spinnerCount={spinnerCount}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default RandomSelection;
