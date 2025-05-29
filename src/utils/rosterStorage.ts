export type RosterData = {
    rosterList: string[],
    absentList?: string[],
    selectedNames?: string[],
    spinnerNames?: string[],
    spinnerCount?: number
}

export const saveRoster = (name: string, partialData: RosterData) => {
    const allRosters = JSON.parse(localStorage.getItem("allRosters") || "{}");

    const fullData: RosterData = {
        rosterList: partialData.rosterList,
        absentList: partialData.absentList ?? [],
        selectedNames: partialData.selectedNames ?? [],
        spinnerNames: partialData.spinnerNames ?? [],
        spinnerCount: partialData.spinnerCount ?? 1,
    }

    allRosters[name] = fullData;
    localStorage.setItem("allRosters", JSON.stringify(allRosters));
};

export const loadRoster = (name: string) => {
    const allRosters = JSON.parse(localStorage.getItem("allRosters") || "{}");
    return allRosters[name] || null;
}

export const deleteRoster = (name: string) => {
    const allRosters = JSON.parse(localStorage.getItem("allRosters") || "{}");
    delete allRosters[name];
    localStorage.setItem("allRosters", JSON.stringify(allRosters));
}

export const listRosterNames = () => {
    const allRosters = JSON.parse(localStorage.getItem("allRosters") || "{}");
    return Object.keys(allRosters);
}

export const resetAll = () => {
    if (confirm("You want to delete all data for every roster?")) {
        localStorage.removeItem("allRosters");
        localStorage.removeItem("lastUsedRoster");
    }
}
