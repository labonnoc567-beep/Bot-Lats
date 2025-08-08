const math = require("mathjs");

module.exports.config = {
  name: "cal",
  version: "2.0.1",
  hasPermssion: 0,
  credits: "Maruf Billah",
  description: "Advanced calculator: + - * / sin cos log sqrt pi etc.",
  commandCategory: "Utility",
  usages: ".cal <expression>",
  cooldowns: 3,
  dependencies: {
    "mathjs": ""
  }
};

module.exports.run = async function ({ api, event, args }) {
  const input = args.join(" ");
  if (!input)
    return api.sendMessage("📌 উদাহরণ:\n.cal 2+3\n.cal sin(30 deg) + sqrt(16)", event.threadID, event.messageID);

  try {
    const result = math.evaluate(input);

    const reply = `
🧠 𝘾𝙖𝙡𝙘𝙪𝙡𝙖𝙩𝙤𝙧 𝙍𝙚𝙨𝙪𝙡𝙩
━━━━━━━━━━━━━━
📥 Expression: ${input}
📤 Answer: ${result}
━━━━━━━━━━━━━━
📘 উদাহরণ:
• .cal 5 + 2 * 3
• .cal sqrt(25)
• .cal sin(90 deg)
• .cal pi * 2^2
`.trim();

    return api.sendMessage(reply, event.threadID, event.messageID);
  } catch (err) {
    return api.sendMessage("❌ ভুল expression! শুধু সংখ্যায় + - * / ^ sqrt, sin, log ইত্যাদি দাও।", event.threadID, event.messageID);
  }
};
