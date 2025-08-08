const fs = require("fs");
const OWNER_ID = "100070782965051";

module.exports.config = {
  name: "addfile",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "𓆩𝑴𝒂𝒓𝒖𝒇 𝑺𝒚𝒔𝒕𝒆𝒎𓆪",
  description: "Create a new file with content (Owner only)",
  commandCategory: "System",
  usages: ".addfile <path> | <content>",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  if (event.senderID !== OWNER_ID)
    return api.sendMessage("⛔️ Owner only command.", event.threadID, event.messageID);

  const input = args.join(" ").split("|");
  if (input.length < 2)
    return api.sendMessage("📌 Usage:\n.addfile <path> | <content>", event.threadID, event.messageID);

  const filePath = input[0].trim();
  const content = input.slice(1).join("|").trim();

  try {
    fs.writeFileSync(filePath, content, { flag: "wx" }); // Don't overwrite
    api.sendMessage(`✅ File created: ${filePath}`, event.threadID, event.messageID);
  } catch (err) {
    api.sendMessage(`❌ Error: ${err.message}`, event.threadID, event.messageID);
  }
};
