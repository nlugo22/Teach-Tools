import { useRef, useState } from "react";
import { parseRosterUpload } from "../utils/parseRosterUpload";
import "../styles/Roster.css";
import RosterUploadButton from "./RosterUploadButton";

interface Props {
  isNumbered: boolean;
  allRosters: string[];
  roster: string[];
  rosterName: string;
  selectedNames: string[];
  absentList: string[];
  setAbsentList: (absents: string[]) => void;
  handleRosterChange: (newRoster: string) => void;
  handleAddRoster: (newRosterName: string) => void;
  handleUploadRoster: (newRosterName: string, newRosterList: string[]) => void;
  handleEditRoster: (oldName: string, newName: string) => void;
  handleDeleteRoster: (rosterName: string) => void;
  errorMessage: string;
}

const Roster = ({
  isNumbered,
  allRosters,
  roster,
  rosterName,
  selectedNames,
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
  const [editingName, setEditingName] = useState<string | null>(null);
  const [newNameValue, setNewNameValue] = useState<string>("");
  const addNameRef = useRef<HTMLInputElement>(null);

  // Mark as absent
  const handleMarkAbsent = (name: string) => {
    const updated = absentList.includes(name)
      ? absentList.filter((n) => n !== name)
      : [...absentList, name];

    setAbsentList(updated);
  };

  const handleAddClick = () => {
    const value = addNameRef.current?.value.trim();
    if (!value) return;

    handleAddRoster(value);
    if (addNameRef.current) {
      addNameRef.current.value = "";
    }

    // setRosterNames(listRosterNames());
    setShowMenu(false);
  };

  return (
    <div className="roster-container">
      {/* The header */}
      <div className="text-center bg-dark text-white py-2 px-3">
        <button
          className="border-0 bg-transparent text-white fs-6 d-flex align-items-center justify-content-center w-100"
          onClick={() => setShowMenu((prev) => !prev)}
        >
          <span className="text-truncate" style={{ textOverflow: "ellipsis"}}>{rosterName}</span>▼
        </button>
      </div>

      { /* The list of stored rosters */ }
      {showMenu && (
        <div className="roster-menu">
          <ul className="list-group mb-2">
            {allRosters.map((name) => (
              <li
                key={name}
                className="d-flex justify-content-between align-items-center"
              >
                { /* Where the roster name is displayed */}
                {editingName === name ? (
                  <input
                    type="text" 
                    className="form-control form-control-sm"
                    value={newNameValue}
                    autoFocus
                    onChange={(e) => setNewNameValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const trimmed = newNameValue.trim();
                        if (trimmed && trimmed !== name) {
                          handleEditRoster(name, trimmed)
                        }
                        setShowMenu(false);
                        setEditingName(null);
                        setNewNameValue("");
                      } else if (e.key === "Escape") {
                        setEditingName(null);
                      }
                    }}
                    onBlur={() => setEditingName(null)}
                  / >
                ) : (
                  <span
                    className="text-truncate w-100"
                    style={{ cursor: "pointer", userSelect: "none" }}
                    onClick={() => {
                      handleRosterChange(name);
                      setShowMenu(false);
                    }}
                  >
                    {name}
                  </span>
                )
                }
                
                <div className="btn-group btn-group-sm">
                { /* Edit the name */ }
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => {
                      setEditingName(name)
                      setNewNameValue(name)
                    }
                    }
                  >
                    ✏️
                  </button>

                  { /* Delete the roster */ }
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => handleDeleteRoster(name)}
                  >
                    🗑️
                  </button>
                </div>
              </li>
            ))}
          </ul>

          { /* Add a new roster */ }
          <div className="d-flex mb-2">
            <input
              className="form-control form-control-sm me-2"
              type="text"
              ref={addNameRef}
              placeholder="New roster for current class."
            />
            <button className="btn btn-sm btn-success" onClick={handleAddClick}>
              Add
            </button>
          </div>

          { /* Upload a roster */}
          <RosterUploadButton
            onFileUpload={(content) => {
              const result = parseRosterUpload(content);
              if (!result) return;

              const { rosterName, names } = result;

              handleUploadRoster(rosterName, names);
              setShowMenu(false);
            }}
          />

          { /* Validation for roster naming */ }
          {errorMessage && (
            <div className="text-danger fs-6 mt-1">{errorMessage}</div>
          )}
        </div>
      )}

      { /* Where the list of names is displayed */ }
      <div className="table-container">
        <table className="table table-striped table-bordered" style={{userSelect: "none"}}>
          <thead className="table-dark">
            <tr>
              {isNumbered && <th scope="col">#</th>}
              <th scope="col">Name</th>
            </tr>
          </thead>
          <tbody style={{ cursor: "pointer"}}>
            {roster.map((name, index) => (
              <tr key={index} className="roster-rows">
                {isNumbered && <td>{index + 1}</td>}
                <td
                  onClick={() => handleMarkAbsent(name)}
                  className={
                    (absentList.includes(name) ? "bg-danger text-white" : "") +
                    (selectedNames.includes(name) ? "bg-secondary" : "")
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
