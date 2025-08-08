const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "flagme",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "💫Butterfly🦋 Sizu💟 & Maruf System💫",
  description: "Check your flag game score",
  commandCategory: "game",
  usages: "[flagme]",
  cooldowns: 3
};

const scoreFile = path.join(__dirname, "flagdata.json");

module.exports.run = async ({ api, event, Users }) => {
  const { senderID, threadID } = event;
  let scores = {};
  try { scores = JSON.parse(fs.readFileSync(scoreFile)); } catch (e) {}

  const score = scores[senderID] || 0;
  const name = await Users.getNameUser(senderID);

  return api.sendMessage(`🧍‍♂️ ${name}, তোমার স্কোর: ${score} পয়েন্ট 🏅`, threadID);
};
