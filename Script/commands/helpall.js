const fs = require("fs");
const axios = require("axios");

module.exports.config = {
  name: "helpall",
  version: "2.1.0",
  hasPermssion: 0,
  credits: "𓆩𝙎𝙪𝙯𝙪𓆪🥰(すず)💋 & Maruf System💫",
  description: "Show all commands (group name, branding, pp, 2-line desc)",
  commandCategory: "system",
  usages: "",
  cooldowns: 5
};

const OWNER_ID = "100070782965051";
const OWNER_NAME = "Maruf Billah";
const BOT_NAME = "𓆩𝙎𝙪𝙯𝙪𓆪🥰(すず)💋";

function limitDesc(text, max=100) {
  if (!text) return "No description.";
  if (text.length <= max) return text;
  let lines = text.split('\n');
  if (lines.length > 2) lines = lines.slice(0,2);
  let joined = lines.join(' ');
  if (joined.length > max) return joined.slice(0, max-3) + "...";
  return joined;
}

module.exports.run = async function({ api, event, Threads, Users }) {
  const { threadID, messageID } = event;

  // Get group name
  let groupName = "";
  try {
    const info = await Threads.getData(threadID);
    groupName = info.threadName ? `[${info.threadName} Bot]` : `[${BOT_NAME} Bot]`;
  } catch {
    groupName = `[${BOT_NAME} Bot]`;
  }

  // Owner pp fetch
  let avatar = "";
  try {
    let info = await Users.getInfo(OWNER_ID);
    avatar = info?.avatar || "";
  } catch {
    avatar = "";
  }

  // Load commands from current folder only
  const files = fs.readdirSync(__dirname);
  let commandLines = [];
  for (const file of files) {
    if (!file.endsWith(".js")) continue;
    try {
      const command = require(__dirname + "/" + file);
      if (command.config?.name) {
        let desc = limitDesc(command.config.description || "No description.", 100);
        commandLines.push(`𝗕𝗼𝗹𝗱 ⚡ **${command.config.name}**: ${desc}`);
      }
    } catch {}
  }

  // Build message
  let msg =
`${groupName}
━━━━━━━━━━━━━━━━━━
💠 𝗕𝗢𝗧: *${BOT_NAME}*
👑 𝗢𝗪𝗡𝗘𝗥: *${OWNER_NAME}*
🆔 UID: ${OWNER_ID}
━━━━━━━━━━━━━━━━━━

${commandLines.join('\n')}

━━━━━━━━━━━━━━━━━━
🔖 *${BOT_NAME}* & Maruf System💫
`;

  // Send with profile pic (if available)
  if (avatar) {
    try {
      const res = await axios.get(avatar, { responseType: "arraybuffer" });
      const ppPath = __dirname + "/_marufpp.jpg";
      fs.writeFileSync(ppPath, Buffer.from(res.data, "utf-8"));
      api.sendMessage({ body: msg, attachment: fs.createReadStream(ppPath) }, threadID, () => {
        fs.unlinkSync(ppPath);
      }, messageID);
      return;
    } catch (e) {
      // fallback to text only
    }
  }

  api.sendMessage(msg, threadID, messageID);
};
