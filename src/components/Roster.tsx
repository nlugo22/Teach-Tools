import { useEffect, useState } from "react";
import "../styles/Roster.css";

interface Props {
  isNumbered: boolean;
  roster: string[];
  rosterName: string;
  absentMap: Record<string, string[]>;
  setAbsentMap: (map: Record<string, string[]>) => void;
  onRosterChange: (newRoster: string) => void;
}

const Roster = ({ isNumbered, roster, rosterName, absentMap, setAbsentMap, onRosterChange }: Props) => {
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [currentRosterName, setCurrentRosterName] = useState<string>("Roster");
  const [rosterList, setRosterList] = useState<string[]>(["Roster"]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [nameToEdit, setNameToEdit] = useState<string>("");
  const [newName, setNewName] = useState<string>("");
  const [addName, setAddName] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {}, [rosterList]);

  const handleClick = (name: string) => {
    const currentAbsent = absentMap[rosterName] || [];
    let updatedAbsent: string[];

    if (currentAbsent.includes(name)) {
      updatedAbsent = currentAbsent.filter((n) => n !== name);
    } else {
      updatedAbsent = [...currentAbsent, name];
    }

    setAbsentMap({
      ...absentMap,
      [rosterName]: updatedAbsent,
    });
  };

  const addItems = () => {
    if (!addName) {
      setErrorMessage("You need to enter a name!");
    } else if (rosterList.includes(addName)) {
      setErrorMessage("You need to enter a unique name!");
    } else {
      const updatedNames = [...rosterList, addName];
      setRosterList(updatedNames);
      setErrorMessage("");
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

          { /* Add item validation */ }
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
                    onClick={() => handleClick(name)}
                    className={(absentMap[currentRosterName] || []).includes(name) ? "bg-danger" : ""}
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
