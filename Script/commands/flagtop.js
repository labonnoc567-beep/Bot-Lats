const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "flagtop",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "💫Butterfly🦋 Sizu💟 & Maruf System💫",
  description: "Show top scorers in flag game",
  commandCategory: "game",
  usages: "[flagtop]",
  cooldowns: 5
};

const scoreFile = path.join(__dirname, "flagdata.json");

module.exports.run = async ({ api, event, Users }) => {
  const { threadID } = event;
  let scores = {};
  try {
    scores = JSON.parse(fs.readFileSync(scoreFile));
  } catch (e) {
    return api.sendMessage("⚠️ কোনো স্কোর খুঁজে পাওয়া যায়নি!", threadID);
  }

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]).slice(0, 10);
  if (sorted.length === 0) return api.sendMessage("😔 এখনো কেউ কোনো পয়েন্ট পায়নি!", threadID);

  let msg = `🏆 ফ্ল্যাগ গেম লিডারবোর্ড:\n`;
  for (let i = 0; i < sorted.length; i++) {
    const [uid, point] = sorted[i];
    const name = await Users.getNameUser(uid);
    msg += `${i + 1}. ${name} — ${point} পয়েন্ট\n`;
  }

  return api.sendMessage(msg, threadID);
};
