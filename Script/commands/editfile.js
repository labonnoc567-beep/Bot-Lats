const fs = require("fs");
const OWNER_ID = "100070782965051";

module.exports.config = {
  name: "editfile",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "𓆩𝑴𝒂𝒓𝒖𝒇 𝑺𝒚𝒔𝒕𝒆𝒎𓆪",
  description: "Edit a file's full content (overwrite)",
  commandCategory: "System",
  usages: ".editfile <path> | <new content>",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  if (event.senderID !== OWNER_ID)
    return api.sendMessage("⛔ Only owner can use this!", event.threadID, event.messageID);

  const input = args.join(" ").split("|");
  if (input.length < 2)
    return api.sendMessage("📌 Usage:\n.editfile <path> | <content>", event.threadID, event.messageID);

  const path = input[0].trim();
  const content = input.slice(1).join("|").trim();

  try {
    fs.writeFileSync(path, content, "utf-8");
    api.sendMessage(`✅ File edited: ${path}`, event.threadID, event.messageID);
  } catch (e) {
    api.sendMessage(`❌ Error: ${e.message}`, event.threadID, event.messageID);
  }
};
