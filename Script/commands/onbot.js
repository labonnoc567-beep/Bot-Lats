module.exports.config = {
  name: "onbot",
  version: "1.0.0",
  credits: "Maruf Billah",
  description: "Bot is now active message",
  hasPermission: 0,
  commandCategory: "system",
  usages: "/onbot",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event }) {
  const botName = global.config.BOTNAME || "💫Butterfly🦋 Sizu💟";
  const msg = `${botName} is now active bbs🫣🥲`;

  return api.sendMessage(msg, event.threadID, event.messageID);
};
