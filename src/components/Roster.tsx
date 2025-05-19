import { useRef, useState } from "react";
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
  const [showMenu, setShowMenu] = useState(false);
  const [editingName, setEditingName] = useState<string | null>(null);
  const [newNameValue, setNewNameValue] = useState("");
  const addNameRef = useRef<HTMLInputElement>(null);

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

  return (
    <div className="relative w-[15vw] text-center shadow">
      {/* Header Dropdown */}
      <div className="text-center top-0 bg-blue-600 text-2xl text-white rounded ">
        <button
          className="w-full text-white flex items-center cursor-pointer justify-center gap-1 focus:outline-none"
          onClick={() => setShowMenu((prev) => !prev)}
        >
          <span className="truncate">{rosterName}</span>▼
        </button>
      </div>

      {/* Roster Menu */}
      {showMenu && (
        <div className="bg-white border border-gray-300 p-3 space-y-3">
          <ul className="space-y-2">
            {allRosters.map((name) => (
              <li
                key={name}
                className="flex justify-between items-center gap-2 text-lg"
              >
                {editingName === name ? (
                  <input
                    type="text"
                    className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                    value={newNameValue}
                    autoFocus
                    onChange={(e) => setNewNameValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const trimmed = newNameValue.trim();
                        if (trimmed && trimmed !== name) {
                          handleEditRoster(name, trimmed);
                        }
                        setShowMenu(false);
                        setEditingName(null);
                        setNewNameValue("");
                      } else if (e.key === "Escape") {
                        setEditingName(null);
                      }
                    }}
                    onBlur={() => setEditingName(null)}
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
                <div className="flex space-x-1 gap-2">
                  <button
                    className="text-blue-600 text-sm"
                    onClick={() => {
                      setEditingName(name);
                      setNewNameValue(name);
                    }}
                  >
                    ✏️
                  </button>
                  <button
                    className="text-red-600 text-sm"
                    onClick={() => handleDeleteRoster(name)}
                  >
                    🗑️
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* Add new roster */}
          <div className="flex mb-2">
            <input
              type="text"
              ref={addNameRef}
              className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
              placeholder="New roster for current class."
            />
            <button
              className="bg-green-500 text-white text-sm px-3 py-1 rounded hover:bg-green-600"
              onClick={handleAddClick}
            >
              Add
            </button>
          </div>

          {/* Upload roster */}
          <RosterUploadButton
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
            <div className="text-red-600 text-sm">{errorMessage}</div>
          )}
        </div>
      )}

      {/* Roster Table */}
      <div className="h-[84vh] flex flex-col">
        <table className="table-auto border border-gray-300 select-none">
          <thead className="bg-blue-500 text-white rounded">
            <tr>
              {isNumbered && <th className="border-r text-center px-2 w-10">#</th>}
              <th className="px-4 py-2 text-center">Name</th>
            </tr>
          </thead>
        </table>
        <div className="overflow-auto">
          <table className="w-full table-auto">
            <tbody>
              {roster.map((name, index) => (
                <tr key={index} className={`${index % 2 === 0 ? "bg-gray-00" : "bg-white"} hover:bg-gray-200`}>
                  {isNumbered && (
                    <td className="border-r px-2 text-center w-10">{index + 1}</td>
                  )}
                  <td
                    onClick={() => handleMarkAbsent(name)}
                    className={`px-4 py-2 text-center cursor-pointer ${
                      absentList.includes(name)
                        ? "bg-red-400 text-white"
                        : selectedNames.includes(name)
                          ? "bg-gray-400 text-white"
                          : ""
                    }`}
                  >
                    {name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Roster;
