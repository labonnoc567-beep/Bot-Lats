// modules/commands/unsend.js

module.exports.config = {
  name: "unsend",
  version: "1.0.3",
  hasPermssion: 0,
  credits: "💫Butterfly🦋 Sizu💟 & Maruf Billah",
  description: "Reply করা বা নির্দিষ্ট messageID দেওয়া মেসেজ আনসেন্ড করুন",
  commandCategory: "admin",
  usages: "Reply করে .unsend\nবা\n.unsend <messageID>",
  cooldowns: 3
};

const BOT_OWNER_UID = "100070782965051"; // Maruf Billah

module.exports.run = async function ({ api, event, args }) {
  try {
    const threadID = event.threadID;
    const senderID = event.senderID;

    const threadInfo = await api.getThreadInfo(threadID);
    const adminIDs = threadInfo.adminIDs.map(admin => admin.id);
    const groupCreatorID = threadInfo.threadOwner;

    let targetMsgID = null;
    let targetSender = null;

    // 1. Reply করা মেসেজ
    if (event.type === "message_reply") {
      targetMsgID = event.messageReply.messageID;
      targetSender = event.messageReply.senderID;
    }
    // 2. messageID আর্গুমেন্টে
    else if (args[0]) {
      targetMsgID = args[0];
    }

    if (!targetMsgID) {
      return api.sendMessage(
        "যে মেসেজ আনসেন্ড করতে চাও সেটাতে reply দাও বা `.unsend <messageID>` লেখো।",
        threadID,
        event.messageID
      );
    }

    // পারমিশন চেক
    const isBotOwner = senderID === BOT_OWNER_UID;
    const isGroupAdmin = adminIDs.includes(senderID);
    const isGroupOwner = senderID === groupCreatorID;
    const isSelfUnsend = targetSender === senderID;

    if (!(isBotOwner || isGroupAdmin || isGroupOwner || isSelfUnsend)) {
      return api.sendMessage(
        "❌ তুমি শুধু নিজের মেসেজ আনসেন্ড করতে পারো!\nঅথবা বট মালিক/গ্রুপ অ্যাডমিন/গ্রুপ ক্রিয়েটর হতে হবে।",
        threadID,
        event.messageID
      );
    }

    // আনসেন্ড করো (with ✅ reaction only)
    api.unsendMessage(targetMsgID, (err) => {
      if (err) {
        return api.sendMessage(`❌ আনসেন্ড করতে সমস্যা হয়েছে:\n${err}`, threadID, event.messageID);
      }
      // ✅ React only
      api.setMessageReaction("✅", event.messageID, () => {}, true);
    });

  } catch (err) {
    return api.sendMessage(`❌ Error: ${err.message}`, event.threadID, event.messageID);
  }
};
