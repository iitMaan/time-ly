export const getTodayDateString = () => {
    return new Date().toISOString().split('T')[0];
};

export const resetDailyIfNeeded = (originInfo) => {
    const today = getTodayDateString();
    if (originInfo.lastReset !== today) {
        originInfo.totalTime = 0;
        originInfo.lastReset = today;
    }
};