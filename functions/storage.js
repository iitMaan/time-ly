export const saveOriginsToStorage = (origins) => {
    return new Promise((resolve) => {
        chrome.storage.local.set({ origins }, () => {
            console.log("origins object stored in local storage");
            resolve();
        });
    });
};

export const saveCurrentTabInfo = (currentTabInfo) => {
    return new Promise((resolve) => {
        chrome.storage.local.set({ currentTabInfo }, () => {
            console.log("currentTabInfo object stored in local storage");
            resolve();
        });
    });
};