const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "flagreset",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "💫Butterfly🦋 Sizu💟 & Maruf System💫",
  description: "Reset all flag game scores",
  commandCategory: "admin",
  usages: "[flagreset]",
  cooldowns: 5
};

const scoreFile = path.join(__dirname, "flagdata.json");

module.exports.run = async ({ api, event }) => {
  fs.writeFileSync(scoreFile, JSON.stringify({}, null, 2));
  return api.sendMessage("🧹 ফ্ল্যাগ গেম স্কোর রিসেট করা হয়েছে!", event.threadID);
};
