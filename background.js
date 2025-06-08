import { saveOriginsToStorage, saveCurrentTabInfo } from "./functions/storage.js";
import { getTodayDateString, resetDailyIfNeeded } from "./functions/helpers.js";
import { initializeOrigin } from "./functions/origins.js";

let origins = {};

chrome.runtime.onStartup.addListener(() => {
    saveOriginsToStorage(origins).then(() => {
        console.log("Extension loaded during browser startup.");
    });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete") {
        const newTabUrl = tab.url;
        const newTabOrigin = new URL(newTabUrl).origin;
        const newTabId = tab.id;

        console.log("\nTab loaded: ", newTabOrigin);

        if (!origins || !origins[newTabOrigin]) {
            initializeOrigin(origins, newTabOrigin, newTabId);
            const currentTabInfo = {
                url: newTabUrl,
                origin: newTabOrigin,
                tabId: newTabId,
                startTime: Date.now(),
            };
            saveCurrentTabInfo(currentTabInfo);
        }

        checkAndBlock(tabId, tab.url);
    }
});

chrome.tabs.onActivated.addListener((activeInfo) => {
    const activeTabId = activeInfo.tabId;
    chrome.storage.local.get(["currentTabInfo", "origins", "siteLimits"], (result) => {
        origins = result.origins || {};

        const previousTabInfo = result.currentTabInfo;
        if (previousTabInfo) {
            const prevOrigin = previousTabInfo.origin;
            let originInfo = origins[prevOrigin];
            if (!originInfo) {
                initializeOrigin(origins, prevOrigin, previousTabInfo.tabId);
                originInfo = origins[prevOrigin];
            } else {
                resetDailyIfNeeded(originInfo);
            }
            const timeSpent = Date.now() - previousTabInfo.startTime;
            originInfo.totalTime += timeSpent;
            originInfo.startTime = Date.now();
            saveOriginsToStorage(origins);
        }

        chrome.tabs.get(activeTabId, (activeTab) => {
            if (!activeTab.url || !activeTab.url.startsWith("http")) return;
            checkAndBlock(activeTabId, activeTab.url);
            const origin = new URL(activeTab.url).origin;
            const info = {
                url: activeTab.url,
                origin: origin,
                tabId: activeTabId,
                startTime: Date.now(),
            };
            saveCurrentTabInfo(info);
        });
    });
});

function checkAndBlock(tabId, url) {
    if (!url || !url.startsWith("http")) return;
    const origin = new URL(url).origin;
    chrome.storage.local.get(["origins", "siteLimits"], (result) => {
        origins = result.origins || {};
        let originInfo = origins[origin];
        if (!originInfo) {
            initializeOrigin(origins, origin, tabId);
            originInfo = origins[origin];
        } else {
            resetDailyIfNeeded(originInfo);
        }
        const siteLimits = result.siteLimits || {};
        const limit = siteLimits[origin];
        if (limit && originInfo.totalTime >= limit) {
            chrome.tabs.update(tabId, { url: chrome.runtime.getURL("blocked.html") });
            console.log(1);
            console.log(`Blocking ${origin} because ${originInfo.totalTime} >= ${limit}`);

        }
    });
}