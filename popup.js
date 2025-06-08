function formatTime(ms) {
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000);
    return `${min}m ${sec}s`;
}

// Show tracked time per origin
chrome.storage.local.get(["origins"], (result) => {
    const storedOrigins = result.origins || {};
    const urlList = document.getElementById("urlList");
    urlList.innerHTML = "";
    for (const origin in storedOrigins) {
        const originInfo = storedOrigins[origin];
        const li = document.createElement("li");
        li.innerHTML = `<strong>${origin}</strong> - Total Time: ${formatTime(originInfo.totalTime)}`;
        urlList.appendChild(li);
    }
});

// Show existing site limits
function renderLimits() {
    chrome.storage.local.get(["siteLimits"], (result) => {
        const siteLimits = result.siteLimits || {};
        const limitList = document.getElementById("limitList");
        limitList.innerHTML = "";
        for (const origin in siteLimits) {
            const li = document.createElement("li");
            li.textContent = `${origin}: ${Math.round(siteLimits[origin] / 60000)} min`;
            limitList.appendChild(li);
        }
    });
}
renderLimits();

// Save new limit
document.getElementById("saveLimitBtn").addEventListener("click", () => {
    const origin = document.getElementById("siteInput").value.trim().replace(/\/$/, '');
    const minutes = parseInt(document.getElementById("minutesInput").value, 10);
    if (!origin || isNaN(minutes) || minutes < 1) {
        alert("Please enter a valid site and time.");
        return;
    }
    chrome.storage.local.get(["siteLimits"], (result) => {
        const siteLimits = result.siteLimits || {};
        siteLimits[origin] = minutes * 60 * 1000;
        chrome.storage.local.set({ siteLimits }, () => {
            alert("Limit saved!");
            renderLimits();
        });
    });
});
