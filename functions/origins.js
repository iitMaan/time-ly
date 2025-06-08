import { saveOriginsToStorage } from "./storage.js";
import { getTodayDateString } from "./helpers.js";

export const initializeOrigin = (origins, origin, tabId) => {
    console.log("initialization for : ", origin);
    const newOrigin = {
        startTime: Date.now(),
        totalTime: 0,
        tabId: tabId,
        lastReset: getTodayDateString(),
    };
    origins[origin] = newOrigin;
    return saveOriginsToStorage(origins).then(() => {
        console.log("after updating the object ", origins);
    });
};