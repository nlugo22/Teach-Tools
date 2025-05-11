import { listRosterNames } from "./rosterStorage";

export function parseRosterUpload(content: string) {
  const rosterName = prompt("Enter a name for your uploaded roster:");
  const storedNames = listRosterNames();

  if (!rosterName || rosterName.trim() === "") {
    alert("Roster name is required");
    return null;
  }

  if (storedNames.includes(rosterName)) {
    alert("Roster name must be unique!");
    return null;
  }

  const names = content
    .split("\n")
    .map((name) => name.trim())
    .filter(Boolean);

  return { rosterName, names };
}
