module.exports.config = {
  name: "u",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𓆩𝑴𝒂𝒓𝒖𝒇 𝑺𝒚𝒔𝒕𝒆𝒎𓆪",
  description: "Unsend replied message with 😚 react only",
  commandCategory: "Utility",
  usages: "[reply a message]",
  cooldowns: 3,
};

module.exports.run = async function({ api, event }) {
  const { messageReply, threadID, messageID } = event;
  if (!messageReply || !messageReply.messageID) return;

  try {
    await api.unsendMessage(messageReply.messageID);
    api.setMessageReaction("😚", messageID, () => {}, true);
  } catch (e) {
    api.setMessageReaction("❌", messageID, () => {}, true);
  }
};
