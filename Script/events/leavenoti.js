module.exports.config = {
  name: "leave",
  eventType: ["log:unsubscribe"],
  version: "1.0.2",
  credits: "𓆩𝑴𝒂𝒓𝒖𝒇 𝑺𝒚𝒔𝒕𝒆𝒎𓆪",
  description: "Different message for leave and admin kick"
};

module.exports.run = async function ({ api, event, Users, Threads }) {
  const leftID = event.logMessageData.leftParticipantFbId;
  if (leftID == api.getCurrentUserID()) return;

  const { threadID, author } = event;
  const moment = require("moment-timezone");
  const time = moment.tz("Asia/Dhaka").format("DD/MM/YYYY || hh:mm:ss A");
  const hours = moment.tz("Asia/Dhaka").hour();

  const data = global.data.threadData.get(parseInt(threadID)) || (await Threads.getData(threadID)).data;
  const name = global.data.userName.get(leftID) || await Users.getNameUser(leftID);

  const session =
    hours < 11 ? "🌅 শুভ সকাল" :
    hours < 15 ? "🌞 শুভ দুপুর" :
    hours < 19 ? "🌇 শুভ বিকাল" :
    "🌙 শুভ রাত্রি";

  let msg = "";

  if (author === leftID) {
    // নিজে নিজে ছেড়ে গেল
    msg = `😢 [ ${name} ]  
উনি ঠিক মতো না হাগার কারনে, 
গু সব মাথায় উঠে গেছে🥺
তাই গ্রুপ থেকে লিভ নিলেন...
🕒 সময়ঃ ${time}
𓆩𝑴𝒂𝒓𝒖𝒇 𝑺𝒚𝒔𝒕𝒆𝒎𓆪`;
  } else {
    // এডমিন কিক করলো
    msg = `🚨 ঘোষণা 🚨

🤨 অভদ্র [ ${name} ] এর অভদ্রতার কারণে  
💢 এডমিন তাকে গ্রুপ থেকে লাত্থি দিয়ে বের করে দিয়েছেন।
⏰ সময়ঃ ${time}
𓆩𝑴𝒂𝒓𝒖𝒇 𝑺𝒚𝒔𝒕𝒆𝒎𓆪`;
  }

  return api.sendMessage(msg, threadID);
};
