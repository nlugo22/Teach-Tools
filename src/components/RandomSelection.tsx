import  { useEffect, useState } from "react";
import "../styles/RandomSelection.css";
import SpinNames from "./SpinNames";
import Roster from "./Roster";
import RandomSelectControls from "./RandomSelectControls";
import {
  loadRoster,
  saveRoster,
  resetAll,
} from '../utils/rosterStorage'

const RandomSelection = () => {
  /* ROSTER VARIABLES */
  const [rosterList, setRosterList] = useState<string[]>([]);
  const [selectedRoster, setSelectedRoster] = useState<string>("Roster");
  const [sortedRoster, setSortedRoster] = useState<string[]>([]);
  const [absentList, setAbsentList] = useState<string[]>([]);
  const [selectedNames, setSelectedNames] = useState<string[]>([]);
  const [numAvailableNames, setNumAvailableNames] = useState(0); // used to set select element for max num of spinners
  const [isNumbered, setIsNumbered] = useState<boolean>(false);
  const [isSorted, setIsSorted] = useState<boolean>(false);
  const [isRosterLoaded, setIsRosterLoaded] = useState<boolean>(false);
  const [isRosterDisplayed, setIsRosterDisplayed] = useState<boolean>(false);

  /* SPINNER VARIABLES */
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinnerCount, setSpinnerCount] = useState(1); // num of spinners on the screen
  const [spinnerNames, setSpinnerNames] = useState<string[]>([]); // manages the names assigned on each spinner

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
      })
    }
  }, [rosterList, absentList, selectedNames, spinnerNames, spinnerCount, selectedRoster, isRosterLoaded]);

  /*******************/
  /* ROSTER SECTION */
  /*******************/

  /* set number of names after the roster is set used for select element */
  useEffect(() => {
    setNumAvailableNames(
      rosterList.filter(
        (name) => !selectedNames.includes(name) && !absentList.includes(name),
      ).length,
    );
  }, [rosterList, selectedNames, absentList, selectedRoster]);

  useEffect(() => {
    const sorted = [...rosterList].sort()
    setSortedRoster(sorted)
  }, [rosterList])

  const handleRosterDisplayed = () => setIsRosterDisplayed((prev) => !prev);
  const handleIsNumbered = () => setIsNumbered((prev) => !prev);

  const handleSort = () => {
    setIsSorted((prev) => !prev)
  };


  /*******************/
  /* SPINNER SECTION */
  /*******************/
  const handleSpinnerCountChange = (newCount: number) => {
    if (isSpinning) return;

    setSpinnerCount(newCount);
    setSpinnerNames([]);
  };

  const handleSpinning = () => {
    const availableNamesCount = rosterList.filter(
      (name) => !selectedNames.includes(name) && !absentList.includes(name),
    ).length;
    if (isSpinning || spinnerCount > availableNamesCount) return;

    setIsSpinning(true);
    const tempSpinnerNames = Array(spinnerCount).fill("");
    const intervals: number[] = [];

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
      const remainingNamesCount = rosterList.length - selectedNames.length;
      if (spinnerCount > remainingNamesCount) {
        setSpinnerCount(remainingNamesCount);
      }
    }, 3000);
  };

  const handleReset = () => {
    setSpinnerNames([]);
    setSelectedNames([]);
  };

  const handleClearAbsent = () => {
    if (confirm("Clear absences for this roster?")) {
      setAbsentList([]);
    }
  }

  /* RESET EVERYTHING FOR NEW ROSTER UPLOAD */
  const handleGoBack = () => {
    resetAll();
    setRosterList([]);
    setIsRosterDisplayed(false);
    setIsRosterLoaded(false);
    setSelectedNames([]);
    setSpinnerNames([]);
    setSpinnerCount(1);
    setAbsentList([]);
  };

  return (
    <>
      {/* MAIN CONTENT */}
      {isRosterLoaded && (
        <div className="main-container">
          {/* CONTROLS SECTION */}
          <RandomSelectControls
            numAvailableNames={numAvailableNames}
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
            {/* <div className="col-1"> */}
            {rosterList.length > 0 && isRosterDisplayed && (
              <div className="me-auto">
                <Roster
                    isNumbered={isNumbered}
                    roster={isSorted ? sortedRoster : rosterList}
                    rosterName={selectedRoster}
                    absentList={absentList}
                    setAbsentList={setAbsentList}
                    onRosterChange={setSelectedRoster}
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