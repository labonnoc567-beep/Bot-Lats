// 💙 help.js | Pagination, Maruf Branding, Only Owner Name in Footer

const fs = require("fs");
const axios = require("axios");

module.exports.config = {
  name: "help",
  version: "3.0.1",
  hasPermssion: 0,
  credits: "𓆩𝙎𝙪𝙯𝙪𓆪🥰(すず)💋 & Maruf System💫",
  description: "Show commands with pagination, Maruf branding, owner name only",
  commandCategory: "system",
  usages: "[page]",
  cooldowns: 5
};

const OWNER_ID = "100070782965051";
const OWNER_NAME = "Maruf Billah";
const BOT_NAME = "𓆩𝙎𝙪𝙯𝙪𓆪🥰(すず)💋";
const PER_PAGE = 25;

function limitDesc(text, max=100) {
  if (!text) return "No description.";
  if (text.length <= max) return text;
  let lines = text.split('\n');
  if (lines.length > 2) lines = lines.slice(0,2);
  let joined = lines.join(' ');
  if (joined.length > max) return joined.slice(0, max-3) + "...";
  return joined;
}

module.exports.run = async function({ api, event, args, Threads, Users }) {
  const { threadID, messageID } = event;

  // Group Name
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

  // All commands
  const files = fs.readdirSync(__dirname);
  let commandLines = [];
  for (const file of files) {
    if (!file.endsWith(".js")) continue;
    try {
      const command = require(__dirname + "/" + file);
      if (command.config?.name) {
        let desc = limitDesc(command.config.description || "No description.", 100);
        commandLines.push(`🅲🅼🅳👏 **${command.config.name}**: ${desc}`);
      }
    } catch {}
  }

  // Pagination
  const totalPage = Math.ceil(commandLines.length / PER_PAGE);
  let page = parseInt(args[0]) || 1;
  if (page < 1) page = 1;
  if (page > totalPage) page = totalPage;

  const pagedCommands = commandLines.slice((page-1)*PER_PAGE, page*PER_PAGE);

  // Footer - Owner name only
  const footer = `\n━━━━━━━━━━━━━━━━━━\n👑 Owner: ${OWNER_NAME}\n🔖 ${BOT_NAME} & Maruf System💫\n━━━━━━━━━━━━━━━━━━\n`;

  // Build message
  let msg =
`${groupName}
━━━━━━━━━━━━━━━━━━
💠 𝗕𝗢𝗧: *${BOT_NAME}*
👑 𝗢𝗪𝗡𝗘𝗥: *${OWNER_NAME}*
━━━━━━━━━━━━━━━━━━

${pagedCommands.join('\n')}

━━━━━━━━━━━━━━━━━━\nPage: ${page}/${totalPage}${footer}`;

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
    } catch (e) {}
  }

  api.sendMessage(msg, threadID, messageID);
};
