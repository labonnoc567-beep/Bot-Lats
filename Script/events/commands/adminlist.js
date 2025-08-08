module.exports.config = {
  name: "admin",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "💫Butterfly🦋 Sizu💟 & Maruf System💫",
  description: "Show list of bot admins",
  commandCategory: "system",
  usages: "admin list",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args, Users }) {
  const adminList = global.config.ADMINBOT || [];
  const ownerID = "100070782965051"; // Maruf Billah
  const senderID = event.senderID;

  // ✅ `/admin list` check
  if (args[0] !== "list") {
    return api.sendMessage("❌ ব্যবহারের ধরন:\n/admin list", event.threadID, event.messageID);
  }

  if (adminList.length === 0) {
    return api.sendMessage("😕 কোনো bot admin সেট করা হয়নি!", event.threadID, event.messageID);
  }

  let msg = `🤖 Bot Admin List (${adminList.length} জন):\n━━━━━━━━━━━━━━\n`;
  let count = 1;

  for (const id of adminList) {
    const name = await Users.getNameUser(id);
    let tag = "";

    if (id == ownerID) tag = " [💠 Bot Owner]";
    if (id == senderID) tag += " (You)";

    msg += `${count++}. ${name}${tag}\n`;
  }

  msg += "━━━━━━━━━━━━━━";

  return api.sendMessage(msg, event.threadID, event.messageID);
};
