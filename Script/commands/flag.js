const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const scoreFile = path.join(__dirname, "flagdata.json");

module.exports.config = {
  name: "flag",
  version: "1.2.0",
  hasPermssion: 0,
  credits: "💫Butterfly🦋 Sizu💟 & Maruf System💫",
  description: "Guess the country from flag image (with scoring)",
  commandCategory: "game",
  usages: "[flag]",
  cooldowns: 5
};

const flags = [
  { country: "Bangladesh", url: "https://flagcdn.com/w320/bd.png" },
  { country: "India", url: "https://flagcdn.com/w320/in.png" },
  { country: "Japan", url: "https://flagcdn.com/w320/jp.png" },
  { country: "United States", url: "https://flagcdn.com/w320/us.png" },
  { country: "Brazil", url: "https://flagcdn.com/w320/br.png" },
  { country: "Germany", url: "https://flagcdn.com/w320/de.png" },
  { country: "France", url: "https://flagcdn.com/w320/fr.png" },
  { country: "China", url: "https://flagcdn.com/w320/cn.png" },
  { country: "Italy", url: "https://flagcdn.com/w320/it.png" }
];

module.exports.run = async ({ api, event }) => {
  const { threadID, messageID, senderID } = event;
  const chosen = flags[Math.floor(Math.random() * flags.length)];
  const filePath = path.join(__dirname, "cache", `flag_${Date.now()}.jpg`);

  try {
    const res = await axios.get(chosen.url, { responseType: "arraybuffer" });
    fs.ensureDirSync(path.join(__dirname, "cache"));
    fs.writeFileSync(filePath, Buffer.from(res.data, "binary"));

    return api.sendMessage({
      body: `🌍 বলো তো, এই পতাকাটা কোন দেশের?`,
      attachment: fs.createReadStream(filePath)
    }, threadID, async (err, info) => {
      fs.unlinkSync(filePath);
      if (err) return;

      global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        author: senderID,
        threadID,
        correct: chosen.country.toLowerCase()
      });
    }, messageID);

  } catch (e) {
    console.error(e);
    return api.sendMessage("❌ পতাকার ছবি আনতে সমস্যা হয়েছে!", threadID, messageID);
  }
};

module.exports.handleReply = async ({ api, event, handleReply, Users }) => {
  const { threadID, messageID, senderID, body } = event;
  if (senderID !== handleReply.author) return;

  const userAnswer = body.trim().toLowerCase();
  const correctAnswer = handleReply.correct;

  try { await api.unsendMessage(handleReply.messageID); } catch (e) {}

  let scores = {};
  try { scores = JSON.parse(fs.readFileSync(scoreFile)); } catch (e) {}

  if (!scores[senderID]) scores[senderID] = 0;

  if (userAnswer === correctAnswer) {
    scores[senderID] += 1;
    fs.writeFileSync(scoreFile, JSON.stringify(scores, null, 2));
    const name = await Users.getNameUser(senderID);
    return api.sendMessage(`✅ শাবাশ ${name}! পয়েন্ট: ${scores[senderID]} 🎉`, threadID, messageID);
  } else {
    return api.sendMessage(`❌ ভুল বলেছো! ঠিক উত্তর ছিল: ${correctAnswer.charAt(0).toUpperCase() + correctAnswer.slice(1)}.`, threadID, messageID);
  }
};
