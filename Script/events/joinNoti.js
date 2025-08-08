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

    const msg = `𝐖𝐞𝐥𝐜𝐨𝐦𝐞 𝐌𝐫/𝐌𝐢𝐬𝐬.[ ${nameArray.join(', ')} ]! 🎉
𝐅𝐫𝐨𝐦 𝐎𝐮𝐫『${groupName}』𝗚𝗿𝗼𝘂𝗽
𝗪𝗲'𝗿𝗲 𝘀𝗼 𝗴𝗹𝗮𝗱 𝘁𝗼 𝗵𝗮𝘃𝗲 𝘆𝗼𝘂 𝘄𝗶𝘁𝗵 𝘂𝘀, 𝗕𝗲 𝗽𝗼𝗹𝗶𝘁𝗲💫
𝗬𝗼𝘂 𝗮𝗿𝗲 𝘁𝗵𝗲 ${memberCount} 𝗡𝗼. 𝗠𝗲𝗺𝗯𝗲𝗿 `;

    
    return api.sendMessage({ body: msg, mentions }, threadID);
  } catch (err) {
    console.log("❌ joinNoti Error:", err);
  }
};
