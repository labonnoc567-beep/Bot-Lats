const fs = require("fs");
const path = __dirname + "/../../config.json"; // অথবা admin.json file যেটা তুমি use করো

module.exports.config = {
	name: "addadmin",
	version: "1.0.0",
	hasPermssion: 2,
	credits: "Butterfly Sizu💟🦋 & Maruf System💫",
	description: "Add new admin to the bot",
	commandCategory: "system",
	usages: "[reply/@mention/UID]",
	cooldowns: 5
};

module.exports.run = async function ({ event, api, args }) {
	const allowed = ["100070782965051"]; // শুধু Maruf পারবে
	if (!allowed.includes(event.senderID)) return api.sendMessage("⛔ এই কমান্ড শুধু Maruf চালাতে পারবে।", event.threadID);

	let targetID;
	if (event.type == "message_reply") {
		targetID = event.messageReply.senderID;
	} else if (Object.keys(event.mentions).length > 0) {
		targetID = Object.keys(event.mentions)[0];
	} else if (args[0]) {
		targetID = args[0];
	} else {
		return api.sendMessage("⚠️ কাকে admin বানাবো সেটা mention/reply/uid দিয়ে দাও।", event.threadID);
	}

	// ফাইল লোড করে id add করবো
	let config = JSON.parse(fs.readFileSync(path));
	if (!config.ADMIN) config.ADMIN = [];

	if (config.ADMIN.includes(targetID)) return api.sendMessage("ℹ️ এই ইউজার আগে থেকেই admin!", event.threadID);
	
	config.ADMIN.push(targetID);
	fs.writeFileSync(path, JSON.stringify(config, null, 4));

	api.sendMessage(`✅ ${targetID} কে সফলভাবে admin বানানো হয়েছে।`, event.threadID);
};
