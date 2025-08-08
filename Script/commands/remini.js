const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const REMINI_API = "https://remini-api.vercel.app/enhance"; // Public Remini-style API

module.exports.config = {
  name: "remini",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "Maruf Billah",
  description: "Enhance low quality image like Remini Pro",
  commandCategory: "image",
  usages: "Reply to a photo with .remini",
  cooldowns: 5
};

module.exports.onStart = async ({ api, event }) => {
  try {
    if (
      !event.messageReply ||
      !event.messageReply.attachments ||
      !event.messageReply.attachments[0] ||
      event.messageReply.attachments[0].type !== "photo"
    ) {
      return api.sendMessage("📸 অনুগ্রহ করে কোনো ছবিতে রিপ্লাই দিয়ে `.remini` কমান্ড দিন!", event.threadID, event.messageID);
    }

    const imageUrl = event.messageReply.attachments[0].url;
    const msg = await api.sendMessage("⏳ আপনার ছবিটি প্রসেস করা হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...", event.threadID);

    const response = await axios.get(`${REMINI_API}?url=${encodeURIComponent(imageUrl)}`, {
      responseType: "stream"
    });

    const tempPath = path.join(__dirname, "cache", `remini_${Date.now()}.jpg`);
    const writer = fs.createWriteStream(tempPath);
    response.data.pipe(writer);

    writer.on("finish", () => {
      api.sendMessage({
        body: "✨ এই নিন, আপনার উন্নতমানের ছবি (Remini Pro Style):",
        attachment: fs.createReadStream(tempPath)
      }, event.threadID, () => fs.unlinkSync(tempPath), msg.messageID);
    });

    writer.on("error", (err) => {
      console.error(err);
      api.sendMessage("❌ ছবি প্রসেস করতে সমস্যা হয়েছে। পরে আবার চেষ্টা করুন!", event.threadID, msg.messageID);
    });

  } catch (err) {
    console.error(err);
    api.sendMessage(`⚠️ ত্রুটি: ${err.message}`, event.threadID, event.messageID);
  }
};
