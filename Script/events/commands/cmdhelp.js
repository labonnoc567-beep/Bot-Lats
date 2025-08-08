module.exports.config = {
    name: "cmdhelp",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "💫Butterfly🦋 Sizu💟 & Maruf Billah",
    description: "Show usage guide for .cmd command",
    commandCategory: "system",
    usages: "cmdhelp",
    cooldowns: 3
};

module.exports.run = function({ api, event }) {
    const msg = `
🌐 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗠𝗔𝗡𝗔𝗚𝗘𝗠𝗘𝗡𝗧 𝗛𝗘𝗟𝗣 🛠️
━━━━━━━━━━━━━━━
🔰 Format: .cmd [subcommand] [module name]

📚 Available Subcommands:

🔹 .cmd load [name]
➤ এক বা একাধিক module চালু করো (reload)

🔹 .cmd unload [name]
➤ module বন্ধ করো (disable)

🔹 .cmd loadAll
➤ সব module একসাথে চালু করো

🔹 .cmd unloadAll
➤ সব module একসাথে বন্ধ করো (cmd বাদে)

🔹 .cmd info [name]
➤ module সম্পর্কে তথ্য দেখো (version, credits, permission)

🔹 .cmd count
➤ বর্তমানে কতগুলো module লোড আছে জানো

📌 Only admin (Maruf) can use this command
🧠 Use this carefully to manage bot live!
━━━━━━━━━━━━━━━
💫Bot: 💫Butterfly🦋 Sizu💟
🔐Owner: Maruf Billah (UID: 100070782965051)
    `.trim();

    return api.sendMessage(msg, event.threadID, event.messageID);
};
