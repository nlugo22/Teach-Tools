import { useEffect, useRef, useState } from "react";
import "../styles/Roster.css";
import RosterUploadButton from "./RosterUploadButton"
import {listRosterNames, saveRoster} from "../utils/rosterStorage"

interface Props {
  isNumbered: boolean;
  roster: string[];
  rosterName: string;
  absentList: string[];
  setAbsentList: (absents: string[]) => void;
  onRosterChange: (newRoster: string) => void;
}

const Roster = ({
  isNumbered,
  rosterName,
  roster,
  absentList,
  setAbsentList,
  onRosterChange,
}: Props) => {
  const [uploadPrompted, setUploadPrompted] = useState<boolean>(false);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [currentRosterName, setCurrentRosterName] = useState<string>("");
  const [rosterList, setRosterList] = useState<string[]>([]);
  const [rosterListLoaded, setRosterListLoaded] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [nameToEdit, setNameToEdit] = useState<string>("");
  const [newName, setNewName] = useState<string>("");
  const [addName, setAddName] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load in the data
  useEffect(() => {
    const storedNames = listRosterNames();
    setRosterList(storedNames);
    const savedName = localStorage.getItem("currentRosterName");
    const nameToLoad = savedName ? JSON.parse(savedName) : "Roster";
    setCurrentRosterName(nameToLoad);
    setRosterListLoaded(true);
  }, []);

  // Save the data
  useEffect(() => {
    if (rosterListLoaded) {
      localStorage.setItem("rosterList", JSON.stringify(rosterList));
      localStorage.setItem("currentRosterName", JSON.stringify(currentRosterName));
    }
  }, [rosterList, rosterListLoaded, currentRosterName]);

  // Prompt for a roster upload if none exists on first use
  useEffect(() => {
    const savedRosters = listRosterNames();
    const hasRosterData = savedRosters && savedRosters.length > 0;
    if (!hasRosterData) {
      setUploadPrompted(true);
      fileInputRef.current?.click();
    }
  }, []);

  // Mark as absent
  const handleMarkAbsent = (name: string) => {
    let updatedAbsent: string[];

    if (absentList.includes(name)) {
      updatedAbsent = absentList.filter((n) => n !== name);
    } else {
      updatedAbsent = [...absentList, name];
    }

    setAbsentList(updatedAbsent);
  };

  const addItems = () => {
    if (!addName.trim()) {
      setErrorMessage("You need to enter a name!");
    } else if (rosterList.includes(addName)) {
      setErrorMessage("You need to enter a unique name!");
    } else {
      const updatedNames = [...rosterList, addName];
      setCurrentRosterName(addName);
      onRosterChange(addName);
      setErrorMessage("");
      saveRoster(addName, {
        rosterList: [],
        absentList: [],
        selectedNames: [],
        spinnerNames: [],
        spinnerCount: 1,
      });
      setRosterList(listRosterNames());
    }
  };

  const editItems = () => {
    if (newName && !rosterList.includes(newName)) {
      const updatedList = rosterList.map((name) =>
        name === nameToEdit ? newName : name,
      );

      setRosterList(updatedList);
    }

    setIsEditing(false);
    setCurrentRosterName(newName);
    setNameToEdit("");
    setNewName("");
  };

  const deleteItems = (rosterToDelete: string) => {
    if (rosterList.length === 1) {
      alert("At least one item must remain.");
      return;
    }

    const newRosterList = rosterList.filter(
      (rosterItem) => rosterItem !== rosterToDelete,
    );
    setRosterList(newRosterList);

    if (currentRosterName === rosterToDelete) {
      setCurrentRosterName(newRosterList[0]);
    }
  };

  return (
    <div className="roster-container">
      {/* The header */}
      <div className="roster-title">
        <button
          className="border-0 bg-transparent text-white fs-6"
          onClick={() => setShowMenu((prev) => !prev)}
        >
          {currentRosterName} ▼
        </button>

        {/* The list of roster names */}
      </div>
      {showMenu && (
        <div>
          {rosterList.map((roster) =>

            // Show edit input and save if editing
            isEditing && nameToEdit === roster ? (
              <div key={roster} className="d-flex align-items-center gap-2">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Enter item name."
                  className="form-control form-control-sm"
                />
                <button
                  className="btn btn-sm btn-success"
                  onClick={() => {
                    editItems();
                  }}
                >
                  Save
                </button>
              </div>
            ) : (
              // if not editing, show item, edit and delete button
              <div>
                <span
                  className="flex-grow-1"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setCurrentRosterName(roster);
                    setShowMenu(false);
                    onRosterChange(roster);
                  }}
                >
                  {roster}
                </span>
                <button
                  className="btn btn-sm btn-outline-light"
                  onClick={() => {
                    setIsEditing(true);
                    setNameToEdit(roster);
                    setNewName(roster);
                  }}
                >
                  ✏️
                </button>
                <RosterUploadButton 
                  onFileUpload={(content) => {
                    const rosterName = prompt("Enter a name for your roster.");
                    const storedNames = listRosterNames();
                    if (!rosterName || rosterName.trim() === "") {
                      alert("Roster name is required");
                      return;
                    } else if (storedNames.includes(rosterName)) {
                      alert("Roster name must be unique!");
                      return;
                    }

                    const names = content.split("\n").map((name) => name.trim()).filter(Boolean);

                    setRosterList(names);
                    setCurrentRosterName(rosterName);
                    onRosterChange(rosterName);
                    saveRoster(rosterName, {
                      rosterList: names,
                      absentList: [],
                      selectedNames: [],
                      spinnerNames: [],
                      spinnerCount: 1,
                    })
                  }}
                />
                <button
                  className="btn btn-sm btn-outline-light"
                  onClick={() => deleteItems(roster)}
                >
                  🗑️
                </button>
              </div>
            ),
          )}

          {/* Add an item */}
          <div className="d-flex">
            <input
              className="form-control form-control-sm"
              type="text"
              value={addName}
              onChange={(e) => setAddName(e.target.value)}
              placeholder="New Item"
            />
            <button
              onClick={() => {
                addItems();
                setAddName("");
              }}
            >
              +
            </button>
          </div>

          {/* Add item validation */}
          {errorMessage && (
            <div className="text-danger fs-6">{errorMessage}</div>
          )}
        </div>
      )}

      {/* Display the names in the table */}
      <div className="table-container">
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              {isNumbered && <th scope="col">#</th>}
              <th scope="col">Name</th>
            </tr>
          </thead>
          <tbody style={{ cursor: "pointer" }}>
            {roster.map((name, index) => {
              return (
                <tr key={index} className="roster-rows">
                  {isNumbered && <td>{index + 1}</td>}
                  <td
                    onClick={() => handleMarkAbsent(name)}
                    className={
                      (absentList).includes(name)
                        ? "bg-danger"
                        : ""
                    }
                  >
                    {name}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Roster;