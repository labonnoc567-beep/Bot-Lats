const fs = require("fs");
const OWNER_ID = "100070782965051";

module.exports.config = {
  name: "replacefile",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "𓆩𝑴𝒂𝒓𝒖𝒇 𝑺𝒚𝒔𝒕𝒆𝒎𓆪",
  description: "Replace entire content of a file (overwrite)",
  commandCategory: "System",
  usages: ".replacefile <file> | <new content>",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  if (event.senderID !== OWNER_ID)
    return api.sendMessage("⛔ You are not allowed!", event.threadID, event.messageID);

  const input = args.join(" ").split("|");
  if (input.length < 2)
    return api.sendMessage("📌 Usage:\n.replacefile <file> | <content>", event.threadID, event.messageID);

  const file = input[0].trim();
  const content = input.slice(1).join("|").trim();

  try {
    fs.writeFileSync(file, content, "utf8");
    api.sendMessage(`✅ File replaced: ${file}`, event.threadID, event.messageID);
  } catch (e) {
    api.sendMessage(`❌ Error: ${e.message}`, event.threadID, event.messageID);
  }
};
