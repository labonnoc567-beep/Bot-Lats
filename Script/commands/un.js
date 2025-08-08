// modules/commands/un.js

module.exports.config = {
  name: "un",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "💫Butterfly🦋 Sizu💟 & Maruf Billah",
  description: "Reply করে অথবা messageID দিয়ে মেসেজ আনসেন্ড করো",
  commandCategory: "utility",
  usages: "/un [reply/messageID]",
  cooldowns: 3
};

const BOT_OWNER_UID = "100070782965051";

module.exports.run = async function ({ api, event, args }) {
  try {
    const threadID = event.threadID;
    const senderID = event.senderID;
    const threadInfo = await api.getThreadInfo(threadID);
    const adminIDs = threadInfo.adminIDs.map(e => e.id);
    const groupCreatorID = threadInfo.threadOwner;

    let targetMsgID = null;
    let targetSender = null;

    if (event.type === "message_reply") {
      targetMsgID = event.messageReply.messageID;
      targetSender = event.messageReply.senderID;
    } else if (args[0]) {
      targetMsgID = args[0];
    }

    if (!targetMsgID) return;

    const isBotOwner = senderID === BOT_OWNER_UID;
    const isGroupAdmin = adminIDs.includes(senderID);
    const isGroupOwner = senderID === groupCreatorID;
    const isSelfUnsend = targetSender === senderID;

    if (!(isBotOwner || isGroupAdmin || isGroupOwner || isSelfUnsend)) return;

    api.unsendMessage(targetMsgID, err => {
      if (!err) api.setMessageReaction("✅", event.messageID, () => {}, true);
    });

  } catch (err) {
    api.sendMessage("❌ Error: " + err.message, event.threadID, event.messageID);
  }
};
