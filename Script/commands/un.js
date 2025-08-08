module.exports.config = {
  name: "un",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "𓆩𝑴𝒂𝒓𝒖𝒇 𝑺𝒚𝒔𝒕𝒆𝒎𓆪",
  description: "Unsend replied message silently (no text, only 😚 react)",
  commandCategory: "Utility",
  usages: "[reply a message]",
  cooldowns: 3,
};

module.exports.run = async function({ api, event }) {
  const { messageReply, messageID } = event;
  if (!messageReply || !messageReply.messageID) return;

  try {
    await api.unsendMessage(messageReply.messageID);
  } catch (e) { }

  return api.setMessageReaction("😚", messageID, () => {}, true);
};
