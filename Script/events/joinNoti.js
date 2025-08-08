module.exports.config = {
  name: "joinNoti",
  eventType: ["log:subscribe"],
  version: "1.0.2",
  credits: "𓆩𝑴𝒂𝒓𝒖𝒇 𝑺𝒚𝒔𝒕𝒆𝒎𓆪",
  description: "Welcome new members"
};

module.exports.run = async function ({ api, event }) {
  const { threadID } = event;

  // যদি বট নিজে গ্রুপে এড হয়
  if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
    const threadInfo = await api.getThreadInfo(threadID);
    const groupName = threadInfo?.threadName?.trim() || "𓆩𝙎𝙪𝙯𝙪𓆪🥰(すず)💋";
    const nickname = `[ ${global.config.PREFIX} ] • ${groupName} Bot`;

    await api.changeNickname(nickname, threadID, api.getCurrentUserID());

    const msg = `আসসালামু আলাইকুম-!!🖤
𝐓𝐡𝐚𝐧𝐤 𝐲𝐨𝐮 𝐬𝐨 𝐦𝐮𝐜𝐡 𝐟𝐨𝐫 𝐚𝐝𝐝𝐢𝐧𝐠 𝐦𝐞 𝐭𝐨 𝐲𝐨𝐮𝐫 𝐠𝐫𝐨𝐮𝐩-🖤🤗
𝐈 𝐰𝐢𝐥𝐥 𝐚𝐥𝐰𝐚𝐲𝐬 𝐬𝐞𝐫𝐯𝐞 𝐲𝐨𝐮 𝐢𝐧𝐬𝐡𝐚𝐥𝐥𝐚𝐡 🌺❤️
𝐓𝐨 𝐯𝐢𝐞𝐰 𝐜𝐨𝐦𝐦𝐚𝐧𝐝𝐬:
${global.config.PREFIX}help
${global.config.PREFIX}menu

𝐁𝐎𝐓 𝐍𝐀𝐌𝐄 : ${groupName} Bot

⋆✦⋆⎯⎯⎯⎯⎯⎯⎯⎯⋆✦⋆`;

    return api.sendMessage(msg, threadID);
  }

  // অন্য কেউ join করলে
  try {
    const threadInfo = await api.getThreadInfo(threadID);
    const groupName = threadInfo?.threadName?.trim() || "𓆩𝙎𝙪𝙯𝙪𓆪🥰(すず)💋";
    const memberCount = threadInfo.participantIDs.length;
    const newUsers = event.logMessageData.addedParticipants;

    let mentions = [], nameArray = [];
    for (const user of newUsers) {
      nameArray.push(user.fullName);
      mentions.push({ tag: user.fullName, id: user.userFbId });
    }

    const msg = `𝚆𝚎𝚕𝚌𝚘𝚖𝚎 𝙼𝚛/𝙼𝚒𝚜𝚜 [ ${nameArray.join(', ')} ]! 🎉 
 𝙵𝚛𝚘𝚖 ouR『${groupName}』
 𝚆𝚎'𝚛𝚎 𝚜𝚘 𝚐𝚕𝚊𝚍 𝚝𝚘 𝚑𝚊𝚟𝚎 𝚢𝚘𝚞 𝚠𝚒𝚝𝚑 𝚞𝚜 💫
 You are the ${memberCount} No. Member 💫`;

    return api.sendMessage({ body: msg, mentions }, threadID);
  } catch (err) {
    console.log("❌ joinNoti Error:", err);
  }
};
