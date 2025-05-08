export type RosterData = {
    rosterList: string[],
    absentList: string[],
    selectedNames: string[],
    spinnerNames: string[],
    spinnerCount: number
}

export const saveRoster = (name: string, data: RosterData) => {
    const allRosters = JSON.parse(localStorage.getItem("allRosters") || "{}");
    allRosters[name] = data;
    localStorage.setItem("allRosters", JSON.stringify(allRosters));
    console.log(`Saved roster: ${name} with data: ${data}`);
};

export const loadRoster = (name: string) => {
    const allRosters = JSON.parse(localStorage.getItem("allRosters") || "{}");
    console.log(`Loading: ${allRosters[name]}`);
    return allRosters[name] || null;
}

export const deleteRoster = (name: string) => {
    const allRosters = JSON.parse(localStorage.getItem("allRosters") || "{}");
    delete allRosters[name];
    console.log(`Deleted ${name}`);
}

export const listRosterNames = () => {
    const allRosters = JSON.parse(localStorage.getItem("allRosters") || "{}");
    return Object.keys(allRosters);
}

export const resetAll = () => {
    if (confirm("You want to delete all data for every roster?")) {
        localStorage.removeItem("allRosters");
    }
}