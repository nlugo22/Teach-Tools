import { useEffect, useRef, useState } from "react";
import "../styles/Roster.css";
import RosterUploadButton from "./RosterUploadButton";
import { listRosterNames, saveRoster } from "../utils/rosterStorage";

interface Props {
  isNumbered: boolean;
  roster: string[];
  rosterName: string;
  absentList: string[];
  setAbsentList: (absents: string[]) => void;
  handleRosterChange: (newRoster: string) => void;
  handleAddRoster: (newRosterName: string) => void;
  handleUploadRoster: (newRosterName: string, newRosterList: string[]) => void;
  handleEditRoster: (newName: string, oldName: string) => void;
  handleDeleteRoster: (rosterName: string) => void;
  errorMessage: string;
}

const Roster = ({
  isNumbered,
  roster,
  rosterName,
  absentList,
  setAbsentList,
  handleRosterChange,
  handleAddRoster,
  handleUploadRoster,
  handleEditRoster,
  handleDeleteRoster,
  errorMessage,
}: Props) => {
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [rosterNames, setRosterNames] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [nameToEdit, setNameToEdit] = useState<string>("");
  const [newName, setNewName] = useState<string>("");

  const addNameRef = useRef<HTMLInputElement>(null);

  // Load in the data
  useEffect(() => {
    setRosterNames(listRosterNames());
  }, [rosterName]);

  // Mark as absent
  const handleMarkAbsent = (name: string) => {
    const updated = absentList.includes(name)
      ? absentList.filter((n) => n !== name)
      : [...absentList, name];

    setAbsentList(updated);
  };

  const handleAddclick = () => {
    const value = addNameRef.current?.value.trim();
    if (!value) return;

    handleAddRoster(value);
    if (addNameRef.current) {
      addNameRef.current.value = "";
    }

    setRosterNames(listRosterNames());
  };

  const startEdit = (oldName: string) => {
    const newName = prompt("Enter a new name: ", oldName);
    if (newName) {
      handleEditRoster(newName, oldName);
    }
  };

  const deleteRoster = (name: string) => {
    if (confirm(`Are you sure you want to delete ${name}`)) {
      handleDeleteRoster(name);
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
          {rosterName} ▼
        </button>
      </div>

      {showMenu && (
        <div className="roster-menu">
          <ul className="list-group mb-2">
            {rosterNames.map((name) => (
              <li
                key={name}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    handleRosterChange(name);
                    setShowMenu(false);
                  }}
                >
                  {name}
                </span>
                <div className="btn-group btn-group-sm">
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => startEdit(name)}
                  >
                    ✏️
                  </button>
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => handleDelete(name)}
                  >
                    🗑️
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="d-flex mb-2">
            <input
              className="form-control form-control-sm me-2"
              type="text"
              ref={addNameRef}
              placeholder="New roster name"
            />
            <button className="btn btn-sm btn-success" onClick={handleAddClick}>
              Add
            </button>
          </div>

          <RosterUploadButton
            onFileUpload={(content) => {
              const rosterName = prompt(
                "Enter a name for your uploaded roster:",
              );
              const storedNames = listRosterNames();

              if (!rosterName || rosterName.trim() === "") {
                alert("Roster name is required");
                return;
              } else if (storedNames.includes(rosterName)) {
                alert("Roster name must be unique!");
                return;
              }

              const names = content
                .split("\n")
                .map((name) => name.trim())
                .filter(Boolean);

              handleUploadRoster(rosterName, names);
              setRosterNames(listRosterNames());
              setShowMenu(false);
            }}
          />

          {errorMessage && (
            <div className="text-danger fs-6 mt-1">{errorMessage}</div>
          )}
        </div>
      )}

      <div className="table-container">
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              {isNumbered && <th scope="col">#</th>}
              <th scope="col">Name</th>
            </tr>
          </thead>
          <tbody style={{ cursor: "pointer" }}>
            {roster.map((name, index) => (
              <tr key={index} className="roster-rows">
                {isNumbered && <td>{index + 1}</td>}
                <td
                  onClick={() => handleMarkAbsent(name)}
                  className={
                    absentList.includes(name) ? "bg-danger text-white" : ""
                  }
                >
                  {name}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Roster;
