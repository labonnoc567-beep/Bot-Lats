module.exports.config = {
  name: "unsend",
  version: "1.0.0",
  hasPermssion: 0, // সবাই ইউজ করতে পারবে
  credits: "Sizu💟🦋 & Maruf System💫",
  description: "Unsend any message by replying to it.",
  commandCategory: "utility",
  usages: "[reply a message]",
  cooldowns: 3,
};

module.exports.run = async function({ api, event }) {
  const messageID = event.messageReply?.messageID;
  if (!messageID)
    return api.sendMessage("⚠️ দয়া করে যেই মেসেজটা আনসেন্ড করতে চাও সেটা reply করো!", event.threadID, event.messageID);

  try {
    await api.unsendMessage(messageID);
    // Just react with 😚 without sending any message
    api.setMessageReaction("😚", event.messageID, () => {}, true);
  } catch (err) {
    api.sendMessage("❌ আনসেন্ড করতে সমস্যা হচ্ছে!", event.threadID, event.messageID);
  }
};
