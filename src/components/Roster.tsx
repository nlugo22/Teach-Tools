import { useEffect, useRef, useState } from "react";
import { parseRosterUpload } from "../utils/parseRosterUpload";
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
  handleEditRoster: (
    oldName: string,
    newName: string,
    updatedRoster: string[],
  ) => void;
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
  const [showMenu, setShowMenu] = useState(false);
  const [editingName, setEditingName] = useState<string | null>(null);
  const [editedRoster, setEditedRoster] = useState<string[]>([...roster]);
  const [rosterEditMode, setRosterEditMode] = useState<boolean>(false);
  const [rosterHeaderValue, setRosterHeaderValue] = useState("");
  const [newStudent, setNewStudent] = useState<string>("");
  const addNameRef = useRef<HTMLInputElement>(null);
  const rosterContainerRef = useRef<HTMLDivElement>(null);
  const rosterListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setEditedRoster([...roster]);
  }, [roster]);

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
    setShowMenu(false);
  };

  const handleSave = (oldName: string, newName: string) => {
    const cleanedRoster = editedRoster.map((n) => n.trim()).filter(Boolean);
    handleEditRoster(oldName, newName, cleanedRoster);
    handleRosterChange(newName);
    setRosterEditMode(false);
    setEditingName(null);
    setShowMenu(false);
    setRosterHeaderValue("");
  };

  return (
    <div
      className="sm:w-[15vw] h-[80vh] overflow-y-auto text-center shadow"
      ref={rosterContainerRef}
    >
      {/* Header Name Button */}
      <div className="text-center sticky z-10 top-0 bg-blue-600 text-xs sm:text-2xl text-white rounded">
        {rosterEditMode ? (
          <input
            className="w-full text-white flex text-center items-center cursor-pointer justify-center gap-1 focus:outline-none"
            value={rosterHeaderValue}
            onChange={(e) => setRosterHeaderValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Tab") {
                e.stopPropagation();
              }
            }}
          />
        ) : (
          <button
            className="w-full text-white gap-2 flex items-center cursor-pointer justify-center gap-1 focus:outline-none"
            onClick={() => {
              setShowMenu(!showMenu);
              if (rosterListRef.current && rosterContainerRef.current) {
                rosterListRef.current.scrollTop = 0;
                rosterContainerRef.current.scrollTop = 0;
              }
            }}
          >
            <span className="truncate">{rosterName}</span>{" "}
            {showMenu ? "▲" : "▼"}
          </button>
        )}
      </div>

      {/* List of Rosters Menu */}
      {showMenu && (
        <div className="bg-white border border-gray-300 p-3 space-y-3">
          <ul className="space-y-2">
            {allRosters.map((name) => (
              <li
                key={name}
                className="flex justify-between items-center gap-1 text-xs sm:text-lg"
              >
                {editingName === name ? (
                  <input
                    type="text"
                    className="border border-gray-300 rounded px-1 py-1 text-xs sm:text-sm w-full"
                    value={rosterHeaderValue}
                    autoFocus
                    onChange={(e) => setRosterHeaderValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Tab") {
                        e.stopPropagation();
                      } else if (e.key === "Enter") {
                        handleSave(editingName, rosterHeaderValue);
                      } else if (e.key === "Escape") {
                        setEditedRoster([...roster]);
                        setRosterEditMode(false);
                        setEditingName(null);
                      }
                    }}
                  />
                ) : (
                  <span
                    className="truncate cursor-pointer sticky"
                    onClick={() => {
                      handleRosterChange(name);
                      setShowMenu(false);
                    }}
                  >
                    {name}
                  </span>
                )}

                {/* Save and delete buttons */}
                <div className="flex space-x-1 gap-2">
                  {rosterEditMode && editingName === name ? (
                    <div className="p-2 flex justify-center gap-2">
                      <button
                        type="button"
                        className="cursor-pointer bg-blue-500 text-white px-1 py-1 text-xs sm:text-sm rounded hover:bg-blue-600"
                        onClick={() =>
                          handleSave(editingName, rosterHeaderValue)
                        }
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        className="cursor-pointer bg-gray-400 text-white px-1 text-xs sm:text-sm py-1 rounded hover:bg-gray-500"
                        onClick={() => {
                          // Discard changes
                          setEditedRoster([...roster]);
                          setRosterEditMode(false);
                          setEditingName(null);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Edit roster button */}
                      <button
                        className="cursor-pointer text-blue-600 text-xs sm:text-sm"
                        onClick={() => {
                          const all = JSON.parse(
                            localStorage.getItem("allRosters") || "{}",
                          );
                          const targetRoster = all[name];

                          if (!targetRoster) {
                            console.error(
                              "Roster not found in localStorage:",
                              name,
                            );
                            return;
                          }

                          setEditingName(name);
                          setEditedRoster([...targetRoster.rosterList]);
                          setRosterEditMode(true);
                          setRosterHeaderValue(name);
                        }}
                      >
                        ✏️
                      </button>

                      {/* Delete roster button */}
                      <button
                        className="cursor-pointer text-red-600 text-xs sm:text-sm"
                        onClick={() => handleDeleteRoster(name)}
                      >
                        🗑️
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>

          {/* Add new roster */}
          <div className="flex mb-2">
            <input
              type="text"
              ref={addNameRef}
              className="border border-gray-300 rounded px-2 py-1 text-xs sm:text-sm w-full"
              placeholder="New roster for current class."
            />
            <button
              className="cursor-pointer bg-green-500 text-white text-xs sm:text-sm px-3 py-1 rounded hover:bg-green-600"
              onClick={handleAddClick}
            >
              Add
            </button>
          </div>

          {/* Upload roster */}
          <RosterUploadButton
            className={"flex flex-col"}
            onFileUpload={(content) => {
              const result = parseRosterUpload(content);
              if (!result) return;
              const { rosterName, names } = result;
              handleUploadRoster(rosterName, names);
              setShowMenu(false);
            }}
          />

          {/* Error message */}
          {errorMessage && (
            <div className="text-red-600 text-xs sm:text-sm">{errorMessage}</div>
          )}
        </div>
      )}

      {/* Roster Table */}
      <div ref={rosterListRef} className="flex flex-col">
        <table className="table-auto border border-gray-300 select-none">
          <thead className="bg-blue-500 text-white text-xs sm:text-base rounded">
            <tr>
              {isNumbered && (
                <th className="border-r text-center px-2 w-10">#</th>
              )}
              <th className="px-4 py-2 text-center">Name</th>
            </tr>
          </thead>
          <tbody>
            {editedRoster.map((name, index) => (
              <tr
                key={index}
                className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"} hover:bg-gray-200`}
              >
                {isNumbered && (
                  <td className="border-r px-2 text-center text-xs sm:text-base w-10">
                    {index + 1}
                  </td>
                )}

                {/* Mark absent or selected */}
                <td
                  onClick={() => {
                    if (!rosterEditMode) handleMarkAbsent(name);
                  }}
                  className={`px-4 py-2 text-center text-xs sm:text-lg cursor-pointer ${absentList.includes(name)
                      ? "bg-red-400 text-white"
                      : selectedNames.includes(name)
                        ? "bg-gray-400 text-white"
                        : ""
                    }`}
                >
                  {/* Edit the listed names */}
                  {rosterEditMode ? (
                    <div className="flex items-center justify-center gap-2">
                      <input
                        className="border rounded px-2 py-1 text-xs sm:text-sm w-full"
                        value={editedRoster[index]}
                        onChange={(e) => {
                          const updated = [...editedRoster];
                          updated[index] = e.target.value;
                          setEditedRoster(updated);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Tab") {
                            e.stopPropagation();
                          }
                        }}
                      />

                      {/* Delete a name */}
                      <button
                        className="cursor-pointer text-red-500 text-sm"
                        onClick={() => {
                          const updated = editedRoster.filter(
                            (_, i) => i !== index,
                          );
                          setEditedRoster(updated);
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  ) : (
                    // Name of the student if not editing
                    name
                  )}
                </td>
              </tr>
            ))}

            {rosterEditMode && (
              <tr className="bg-gray-50 hover:bg-gray-10">
                <td className="px-4 py-2">
                  <div className="flex items-center justify-center gap-2">
                    <input
                      placeholder="Add a new student"
                      className="border rounded px-2 py-1 text-sm w-full"
                      value={newStudent}
                      onChange={(e) => setNewStudent(e.target.value)}
                    />
                    <button
                      className="cursor-pointer"
                      onClick={() => {
                        if (newStudent.trim() !== "") {
                          setEditedRoster([...editedRoster, newStudent]);
                          setNewStudent("");
                        }
                      }}
                    >
                      +
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Roster;
