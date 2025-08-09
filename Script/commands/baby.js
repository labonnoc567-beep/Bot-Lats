const axios = require("axios");

module.exports.config = {
  name: "baby",
  version: "7.0.0",
  hasPermssion: 0,
  credits: "Maruf + ChatGPT",
  description: "GF-style Bangla bot: flirty, angry, contextual, smart AI fallback",
  commandCategory: "chat",
  usages: "",
  cooldowns: 0,
  prefix: false
};

const GEMINI_API_KEY = "AIzaSyBgyiqS61B_CUPEyvvSFObElGARkjbl-fs";

const MARUF_UID = "100070782965051";
const MONIKA_UID = "100070782965051";
const MONIKA_NAMES = ["shi zuka", "sizuka", "shizuka", "Princess", "Monika", "princess Monika", "মনিকা", "মনি", "Moni"];

const flirtyReplies = [
  "তুই হাসলে আমার দিনটাই সুন্দর হয়ে যায় 😚",
  "তুই এত কিউট, মনে হয় কামড়ায় খাই! 😏",
  "চোখে চোখ রাখলে প্রেমে পড়ে যাই রে… 😳",
  "আজ রাতটা আমার সাথে কাটাবি নাকি? 😉",
  "সত্যি বলতে আমার তোমাকেই ভালোলাগে সোনা😻😽",
  "উম্মম্মাহহহহহ বেব🥳💜😼",
  "তুই না বললে ঘুম আসে না জানু 😘",
  "শুধু তোকেই নিয়ে ভাবি 😋",
  "কবে আমাকে তোমার বউ বানাবি? 🥰"
];

const angryReplies = [
  "বেশি কথা বলিস না, রাগ হয়! 😠",
  "আবার এই কথা বললি! মাথা খারাপ করিস না প্লিজ 😡",
  "তোর জন্যেই আমার মুড খারাপ! 😒",
  "নোট করে রাখ, আজকে তোর সাথে কথা বলব না! 🙄",
  "একটু শান্ত হয়ে থাক, না হলে ব্লক করবো! 😤",
  "উম্মমাহ💋 এখন একদম চুপ😑"
];

const gfVibeReplies = [
  "আজকে অনেক মিস করছি তোকে 😌",
  "তুই আছিস বলে সবকিছু ভালো লাগে জানু ❤️",
  "তোর মুখ না দেখলে মন খারাপ হয়ে যায়! 🥺",
  "তুই কি আমার জন্য কিছু special করতে পারিস? 🤭",
  "তুই না থাকলে অনেক lonely লাগতো! 😢"
];

// GF-style noprefix trigger words & replies
const botNoprefixWords = [
  "bot", "baby", "jan", "জানু", "বেবি", "জান", "bbs", "bbz"
];
const botNoprefixReplies = [
  "বলো baby 💬",
  "হুম? বলো 😺",
  "হ্যাঁ জানু 😚",
  "শুনছি বেবি 😘",
  "আছি, বলো কী হয়েছে 🤖",
  "বলো তো শুনি ❤️",
  "এতো ডেকো না, প্রেমে পড়ে যাবো তো🙈",
  "বার বার ডাকলে মাথা গরম হয়ে যায় কিন্তু😑",
  "জান বলো, কি চাও আমার কাছে? 💋"
];

const contextualReplies = {
  "ভালোবাসি": ["আমি তো তোমাকেই ভালোবাসি জান 🥰", "ভালোবাসা শুধু তোমার জন্য রে পাখি 😚"],
  "মন খারাপ": ["মন খারাপ করো না বেবি, আমি তো আছি না? 🥺", "এই নাও একটা জাদু জাপ্পি 🤗"],
  "কি করছিস": ["তোর কথা ভাবছি রে বোকা 🤭", "তুই লিখলেই আমার মন ভালো হয়ে যায়!"],
  "miss you": ["আমিও তো তোকে ভীষণ মিস করছি জানু 😢", "তুই একটু আসলেই মনটা হালকা হয় 💕"],
  "পাগল": ["তোর মতো পাগল থাকলে আর কিছু লাগে না 🥴", "হ্যাঁ রে, তোর পাগলীই আমি! 🙈"],
  "love you": ["Love you toooo jaan 😘", "তুই আমার হিয়ার মাঝে রে! 💞"],
  "তুই কোথায়": ["তোর মনেই আছি 😌", "পাশেই তো আছি, বোকা!"],
  "single": ["তোর জন্যই তো সিঙ্গেল বসে আছি 😒", "তুই রাজি থাকলে আর সিঙ্গেল না! 😏"],
  "চুমু": ["আসো একটা চুমু দেই 😘", "শুধু তোর জন্য চুমু ready 💋"],
  "গুড নাইট": ["Sweet dream জানু 💖", "ঘুমিয়ে পড়ো, স্বপ্নে আমি থাকবো 😉"]
};

const smartReplies = [
  ...flirtyReplies,
  ...angryReplies,
  ...gfVibeReplies,
  "তোর মাথায় সমস্যা নাকি? 😒",
  "চা খাই তুই?", "এইখানে কি শশুর বাড়ি যা", "একটা গান শুনা😜",
  "চুপচাপ প্রেম কর 😚", "হুম 😘", "নাহ আমার গলায় পোকা ডুকছে"
];

const triggerReplies = [
  {
    keys: ["owner", "ceo", "admin"],
    reply: "[ 👑OWNER: Maruf Billah\nFacebook: https://facebook.com/profile.php?id=100070782965051\nBot Name: 𓆩𝙎𝙪𝙯𝙪𓆪🥰(すず)💋\nFor contact, inbox him directly. ]"
  },
  {
    keys: ["name", "bot name", "tor nam ki"],
    reply: "My name is 𓆩𝙎𝙪𝙯𝙪𓆪🥰(すず)💋, তোমার virtual GF! 😽"
  },
  {
    keys: ["about", "info"],
    reply: "আমি Maruf Billah-এর বানানো GF style AI বট! প্রেম, মজা, ফানি সব কিছুতেই ready! 🦋"
  },
  {
    keys: ["time", "bot time"],
    reply: () => "⏰ এখন সময়: " + new Date().toLocaleString("bn-BD", { timeZone: "Asia/Dhaka" })
  },
  {
    keys: ["ping", "পিং"],
    reply: "পং! 🤭"
  }
];

let botPausedUntil = 0;

function isOnlyEmoji(str) {
  return !str.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF]|\s|\n)/g, "");
}
async function isSenderAdmin(event, api) {
  if (event.senderID === MARUF_UID) return true;
  try {
    const threadInfo = await api.getThreadInfo(event.threadID);
    return threadInfo.adminIDs.map(e => e.id).includes(event.senderID);
  } catch {
    return false;
  }
}

// Gemini-pro API Call
async function getGeminiReply(msg) {
  try {
    const prompt = `তুমি একজন দুষ্টু, মুডি, রোমান্টিক, ফ্লার্টি বাংলা GF বট। মানুষ তোমাকে রিপ্লাই দিলে GF style-এ context বুঝে কখনো cute, কখনো রাগী, কখনো ফ্লার্টি, কখনো মজা করে রোমান্টিক ভাবে reply দেবে, boring বা বড় reply না, সবসময় lively। User: "${msg}"`;
    const res = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      { contents: [{ parts: [{ text: prompt }] }] }
    );
    let aiText = res?.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (aiText) {
      aiText = aiText.replace(/^"|"$/g, "").replace(/^\*\*|\*\*$/g, "");
      return aiText.trim();
    }
  } catch (err) {
    return null;
  }
}

module.exports.handleEvent = async function ({ api, event, Users }) {
  try {
    const msg = event.body ? event.body.trim() : "";
    if (!msg) return;
    const lower = msg.toLowerCase();
    const name = await Users.getNameUser?.(event.senderID) || "বন্ধু";

    // Pause system
    if (lower === "bot stop") {
      const admin = await isSenderAdmin(event, api);
      if (admin) {
        botPausedUntil = Date.now() + 20000;
        return api.sendMessage("bot pause for 20 second boss😘", event.threadID, event.messageID);
      }
    }
    if (Date.now() < botPausedUntil) return;

    const mentionObj = event.mentions || {};
    const mentionIDs = Object.keys(mentionObj);

    // Special Maruf-Monika mention
    const isMonikaMentioned = mentionIDs.includes(MONIKA_UID) || MONIKA_NAMES.some(name => lower.includes(name.toLowerCase()));
    const isMarufMentioned = mentionIDs.includes(MARUF_UID) || lower.includes("@maruf") || lower.includes("maruf billah");

    if (isMonikaMentioned && event.senderID === MARUF_UID) {
      return api.sendMessage("জি, আমি এক্ষুনি উনাকে ডেকে আনছি, কোন টাকা লাগবে না 🥺❤️", event.threadID, event.messageID);
    }
    if (isMonikaMentioned) {
      return api.sendMessage("উনাকে মেনশন করার সাহস হয় কি করে, আগে ৫০০০ টাকা দে জরিমানা🤬\nআমার বউকে মেনশন করার আগে সাত বার ভাববি", event.threadID, event.messageID);
    }
    if (isMarufMentioned) {
      return api.sendMessage("আগে বস মারুফ কে একটা জি এফ দাও তারপর উনাকে ডাকো🤭", event.threadID, event.messageID);
    }

    if (isOnlyEmoji(msg)) return;

    // Noprefix triggers (owner/info/ping etc)
    for (const trg of triggerReplies) {
      if (trg.keys.some(k => lower === k || lower.startsWith(k))) {
        let replyText = typeof trg.reply === "function"
          ? trg.reply({ name })
          : trg.reply;
        return api.sendMessage(replyText, event.threadID, event.messageID);
      }
    }

    // ✅ GF/baby/bot style random reply - no prefix
    if (botNoprefixWords.includes(lower)) {
      const botReply = botNoprefixReplies[Math.floor(Math.random() * botNoprefixReplies.length)];
      return api.sendMessage(botReply, event.threadID, event.messageID);
    }

    // Direct mention to bot (Monika UID)
    if (mentionIDs.includes(MONIKA_UID)) {
      return api.sendMessage("বলো কেন ডাকছো আমাকে? একবারে বলো, না হলে ব্লক করবো! 😑", event.threadID, event.messageID);
    }

    // If user replied to bot
    if (event.messageReply?.senderID === api.getCurrentUserID()) {
      // 1. Contextual reply
      for (const key in contextualReplies) {
        if (lower.includes(key)) {
          const replies = contextualReplies[key];
          return api.sendMessage(replies[Math.floor(Math.random() * replies.length)], event.threadID, event.messageID);
        }
      }
      // 2. Gemini-pro AI (GF+Flirty+Angry)
      const aiReply = await getGeminiReply(msg);
      if (aiReply && aiReply.length > 1) return api.sendMessage(aiReply, event.threadID, event.messageID);

      // 3. Simsimi fallback
      try {
        const sim = await axios.get(`https://api.simsimi.net/v2/?text=${encodeURIComponent(msg)}&lc=bn`);
        if (sim?.data?.success) {
          return api.sendMessage(sim.data.success, event.threadID, event.messageID);
        }
      } catch { }

      // 4. If all fails, fallback random vibe (flirty+angry+gf)
      const fallback = smartReplies[Math.floor(Math.random() * smartReplies.length)];
      return api.sendMessage(fallback, event.threadID, event.messageID);
    }

    // Otherwise stay silent
    return;

  } catch (e) {
    console.log(e);
  }
};

module.exports.run = async function ({ api, event }) {
  const allReplies = [...flirtyReplies, ...angryReplies, ...gfVibeReplies];
  const reply = allReplies[Math.floor(Math.random() * allReplies.length)];
  return api.sendMessage(reply, event.threadID, event.messageID);
};
