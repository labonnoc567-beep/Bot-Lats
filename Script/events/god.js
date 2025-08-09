// events/god.js
module.exports.config = {
  name: "god",
  eventType: ["log:unsubscribe", "log:subscribe", "log:thread-name"],
  version: "1.0.1",
  credits: "Maruf Billah",
  description: "Send admin a DM when bot is added/kicked or name changes",
  envConfig: { enable: true }
};

const ADMIN_UID = "100070782965051";

module.exports.run = async function ({ api, event, Threads }) {
  const logger = require("../../utils/log");

  // Safe enable check
  const enabled = global.configModule?.[this.config.name]?.enable ?? this.config.envConfig.enable;
  if (!enabled) return;

  let task = "";
  try {
    switch (event.logMessageType) {
      case "log:thread-name": {
        const data = await Threads.getData(event.threadID).catch(() => ({})) || {};
        const oldName = data.name || "N/A";
        const newName = event.logMessageData?.name || "N/A";
        task = `📝 গ্রুপের নাম বদলানো হয়েছে:\nপুরনো: ${oldName}\nনতুন: ${newName}`;
        await Threads.setData(event.threadID, { name: newName }).catch(() => {});
        break;
      }

      case "log:subscribe": {
        const added = event.logMessageData?.addedParticipants || [];
        if (added.some(p => String(p.userFbId) === String(api.getCurrentUserID()))) {
          const info = await api.getThreadInfo(event.threadID).catch(() => ({}));
          task = `✅ বটকে নতুন গ্রুপে যোগ করা হয়েছে\nনাম: ${info.threadName || "N/A"}\nমেম্বার: ${info.participantIDs?.length || "N/A"}`;
        }
        break;
      }

      case "log:unsubscribe": {
        if (String(event.logMessageData?.leftParticipantFbId) === String(api.getCurrentUserID()))) {
          task = `❌ বটকে গ্রুপ থেকে রিমুভ করা হয়েছে`;
        }
        break;
      }
    }

    if (!task) return;

    const report =
      `=== Bot Activity Notification ===\n` +
      `🔗 Thread ID: ${event.threadID}\n` +
      `👤 By: ${event.author}\n` +
      `⏰ ${new Date().toLocaleString("en-GB")}\n\n` +
      `${task}`;

    return api.sendMessage(report, ADMIN_UID, (err) => {
      if (err) logger(report, "[Logging Event]");
    });
  } catch (e) {
    logger(e, "[god event error]");
  }
};
