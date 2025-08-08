module.exports.config = {
  name: "adminnotify",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "💫Butterfly🦋 Sizu💟 & Maruf System💫",
  description: "Send message to all threads or specific ID (admin only)",
  commandCategory: "admin",
  usages: "[all | id1,id2,...] | [message]",
  cooldowns: 3,
};

const ADMIN_ID = "100070782965051";

module.exports.run = async ({ api, event, args }) => {
  if (event.senderID !== ADMIN_ID) {
    return api.sendMessage("⛔ তুমি admin না! Permission denied.", event.threadID);
  }

  const full = args.join(" ");
  const [targetPart, message] = full.split("|").map(x => x.trim());

  if (!targetPart || !message) {
    return api.sendMessage("📌 Usage:\n.adminnotify all | তোমার ম্যাসেজ\n.adminnotify id1,id2 | ম্যাসেজ", event.threadID);
  }

  let targets = [];

  if (targetPart.toLowerCase() === "all") {
    targets = global.allThreadID || [];
  } else {
    targets = targetPart.split(",").map(x => x.trim());
  }

  const finalMsg = `🔔 Notification from Admin:\n\n${message}`;
  let success = 0, fail = 0;

  for (const tid of targets) {
    try {
      await api.sendMessage(finalMsg, tid);
      success++;
    } catch (e) {
      fail++;
    }
  }

  return api.sendMessage(`✅ Sent to ${success} thread(s), ❌ Failed: ${fail}`, event.threadID);
};
