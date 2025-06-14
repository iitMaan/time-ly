# ⏱️ Time-ly – Chrome Extension

A lightweight productivity-focused Chrome extension that tracks the time spent on different websites and helps you limit site usage by setting time limits per site.

## 🔍 Features
⏳ Track Time Spent on each website (based on origin like https://www.youtube.com)

📊 Daily Time Reset: Stats reset every new day automatically

🚫 Time Limmiter: Set a time limit for distracting sites (e.g., social media)

🔒 Auto-Block: Automatically redirects to a “Blocked” screen when time limit is exceeded

💾 Persistent Storage: Uses chrome.storage.local to remember tracked data even after browser restart

🧠 Minimal and Intuitive UI (via popup.html)


## 🛠️ How It Works
background.js listens for tab activity, calculates time spent per site, and stores it.

popup.js shows time stats and lets users set per-site limits (e.g., YouTube → 10 min).

When the time exceeds the limit, the tab is redirected to a blocked page (blocked.html).

Stats and limits are stored using chrome.storage.local.

## 🚀 Getting Started
Clone this repo

Go to chrome://extensions

Enable Developer Mode

Click “Load Unpacked” and select the project folder

Pin the extension and start tracking your time!

## 📷 Preview
![image](https://github.com/user-attachments/assets/442fa518-c3ef-4f60-a343-630e92a05e4a)
