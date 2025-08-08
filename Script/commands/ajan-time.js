const fs = require("fs");
const path = require("path");
const moment = require("moment-timezone");

module.exports.config = {
  name: "azan",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "💫Butterfly🦋 Sizu💟 & Maruf System💫",
  description: "Auto-send Azan reminder using offline yearly timing",
  commandCategory: "utility",
  usages: "",
  cooldowns: 5
};

module.exports.run = async ({ api }) => {
  // Do nothing on command
};

module.exports.onLoad = async function ({ api }) {
  const TIMEZONE = "Asia/Dhaka";
  const CHECK_INTERVAL = 60 * 1000; // 1 minute
  const azanDataPath = path.join(__dirname, "..", "data", "azanTimes.json");

  if (!fs.existsSync(azanDataPath)) {
    console.error("❌ azanTimes.json not found!");
    return;
  }

  const azanTimes = JSON.parse(fs.readFileSync(azanDataPath, "utf-8"));
  let lastSent = "";

  const checkAzan = () => {
    const now = moment().tz(TIMEZONE);
    const dateKey = now.format("YYYY-MM-DD");
    const currentTime = now.format("HH:mm");

    const todayAzan = azanTimes[dateKey];
    if (!todayAzan) return;

    for (const [salah, time] of Object.entries(todayAzan)) {
      if (currentTime === time && lastSent !== dateKey + time) {
        const msg = `🚸নামাজের বিরতি🚸  
(${salah} ওয়াক্ত - ${time})

‼️--আযান হচ্ছে --‼️ 😊

°°মানে আল্লাহ তোমাকে ডাকছে°° 😍

°°সবাই নামাজ পড়ে আসো°° 🤲

‼️--হতেও তো পারে আল্লাহর সাথে এটাই তোমার শেষ যোগাযোগ --‼️ 💙🥀

📵 NO TEXT 🚫 @everyone  
🚸নামাজের বিরতি🚸`;

        for (const threadID of global.allThreadID || []) {
          api.sendMessage(msg, threadID);
        }
        lastSent = dateKey + time;
        console.log(`🔔 Azan sent for ${salah} at ${time}`);
      }
    }

    setTimeout(checkAzan, CHECK_INTERVAL);
  };

  checkAzan();
};
