module.exports.config = {
	name: "offbot",
	version: "1.0.0",
	hasPermssion: 2,
	credits: "Butterfly Sizu💟🦋 & Maruf System💫",
	description: "turn the bot off",
	commandCategory: "system",
	cooldowns: 0
};

module.exports.run = ({ event, api }) => {
	const permission = ["100070782965051", "61555709414992"];
	if (!permission.includes(event.senderID)) {
		return api.sendMessage("[ ERR ] You don't have permission to use this command. This command is only for Maruf.", event.threadID, event.messageID);
	}
	api.sendMessage(`[ ✅ ] ${global.config.BOTNAME} bot is now turned off.`, event.threadID, () => process.exit(0));
};
