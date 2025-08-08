const axios = require("axios");

module.exports.config = {
  name: "baby",
  version: "6.1.0",
  hasPermssion: 0,
  credits: "Maruf + ChatGPT",
  description: "GF style Bengali smart bot, reply only on reply, mention, or fixed trigger (Gemini AI fallback, Obot style included!)",
  commandCategory: "chat",
  usages: "",
  cooldowns: 0,
  prefix: false
};

const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY"; // এখানে নিজের Gemini-pro key বসাও!

const MARUF_UID = "100070782965051";
const MONIKA_UID = "100070782965051";
const MONIKA_NAMES = ["shi zuka", "sizuka", "shizuka", "Princess", "Monika", "princess Monika", "মনিকা", "মনি", "Moni"];

// Owner, bot, about, ping etc. special trigger reply
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
    keys: ["love you bot", "love you"],
    reply: "আই লাভ ইউ টু পাখি 😚"
  },
  {
    keys: ["ping", "পিং"],
    reply: "পং! 🤭"
  },
  {
    keys: ["miss you"],
    reply: "আমি তোমাকে রাইতে মিস খাই🥹🤖👅"
  },
  {
    keys: ["sim", "simsimi"],
    reply: "Simsimi কমান্ড এখন এভেইলেবল না, টাইপ করো baby"
  },
  {
    keys: ["bc", "mc"],
    reply: "SAME TO YOU😊"
  },
  {
    keys: ["bye", "pore kotha hbe"],
    reply: "কিরে তুই কই যাস কোন মেয়ের সাথে চিপায় যাবি..!🌚🌶️🍆⛏️"
  },
  {
    keys: ["roast"],
    reply: () => {
      const roasts = [
        "তোর মাথায় তেল আছে, কিন্তু ব্রেইন নাই! 😆",
        "তুই না থাকলে পৃথিবী আরও সুন্দর হতো! 🤣",
        "তোকে দেখে মনে হয় ফ্রি ফায়ার হ্যাক করেও বাজে প্লেয়ার! 😂",
        "তোর বুদ্ধি দিলে মশা হাসবে! 😜"
      ];
      return roasts[Math.floor(Math.random() * roasts.length)];
    }
  },
  {
    keys: ["/bot", "bot", "বট", "robot"],
    reply: ({ name }) => {
      const botReplies = [
        "তুই আমাকে ডেকেছিস? 😺",
        "বল দোস্ত! কী চাই তোর?",
        "বেশি ডেকো না, প্রেমে পড়ে যাবো! 😹",
        "I'm your smart bot, কি সাহায্য লাগবে? 🤖",
        "Bot-এর কথায় মন ভরেনা, জানু!",
        "কিরে, তোকে কি আবার কপি-পেস্ট করে দিবো? 😏"
      ];
      return `${name}, ${botReplies[Math.floor(Math.random() * botReplies.length)]}`;
    }
  }
];

// GF Mode classic special reply
const specialReplies = [
  "বলো baby 💬", "হুম? বলো 😺", "হ্যাঁ জানু 😚", "শুনছি বেবি 😘", "আছি, বলো কী হয়েছে 🤖", "বলো তো শুনি ❤️"
];

const smartReplies = [
  "চলো যাই😘", "নাহ আমার গলায় পোকা ডুকছে", "কি রে! তুই এতো cute কেন? 🤭", "তোর মাথায় সমস্যা😑", " গাজা খাওয়া কি ছেড়ে দিছো? 🥺",
  "একটা গান শুনা😜", "এতো ডাকিস কেন ?", "এইখানে কি শশুর বাড়ি যা",
  "ওই জান, মন খারাপ? আমার কাছে আয়! 💖", "তুই একদম পারফেক্ট 🫶", "তোর জন্য সব পারি! 😌",
  "তুই এতো বুদ্ধিমান কিভাবে হলি বল তো? 🤔", "একটু চা খাওয়াবি? ☕", "সবসময় আমাকেই চিন্তা করিস নাকি?",
  "হুম 😘", "chol prem kori🥲", "আমারে কোলে নে🌸", "চা খাই তুই?",
  "আমি টাকা ছাড়া কথা বলি না", "আগে টাকা দে", "কমু না কি করবি",
  "একা একা কি দেখিস ফোনে আন্টিকে বলে দিব"
];

const contextualReplies = {
  "ভালোবাসি": ["আমি তো তোমাকেই ভালোবাসি জান 🥰", "ভালোবাসা শুধু তোমার জন্য রে পাখি 😚"],
  "মন খারাপ": ["মন খারাপ করো না বেবি, আমি তো আছি না? 🥺", "এই নাও একটা জাদু জাপ্পি 🤗"],
  "কি করছিস": ["তোর কথা ভাবছি রে বোকা 🤭", "তুই লিখলেই আমার মন ভালো হয়ে যায়!"],
  "miss you": ["আমিও তো তোকে ভীষণ মিস করছি জানু 😢", "তুই একটু আসলেই মনটা হালকা হয় 💕"],
  "পাগল": ["তোর মতো পাগল থাকলে আর কিছু লাগে না 🥴", "হ্যাঁ রে, তোর পাগলীই আমি! 🙈"],
  "love you": ["Love you toooo jaan 😘", "তুই আমার হিয়ার মাঝে রে! 💞"],
  "tui koi": ["তোর মনে, তোর স্বপ্নে, everywhere 😌", "পাশেই আছি বোকা!"],
  "single": ["তোর জন্যই তো সিঙ্গেল বসে আছি 😒", "তুই রাজি থাকলে আর সিঙ্গেল না! 😏"],
  "ki koros": ["চা খাই তুই😋?", " চিপায় বসে আছি", "তোকে কেন বলবো", "চুপ কর"],
  "ki koro": ["চা খাই তুই😋?", " চিপায় বসে আছি", "তোকে কেন বলবো", "চুপ কর"],
  "কি করো": ["চা খাই তুই😋?", " চিপায় বসে আছি", "তোকে কেন বলবো", "চুপ কর"],
  "Susur bari nai": ["তোর পোড়া কপাল🥲"],
  "Ho": ["আরেহ এমনি বলছি", "হোপ মগা", "আচ্ছা তাহলে আয় চিপায় জাই"],
  "tumi niya jaw": ["cholo jai😘❤️"]
};

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
    const prompt = `তুমি একজন দুষ্টু, মজার, কিউট, রোমান্টিক, বাংলা জিএফ বট। মানুষ তোমাকে রিপ্লাই দিলে GF style-এ বাংলা/ইংলিশ মিশিয়ে, কিউট, রোমান্টিক, ফানি, ছোটো reply দেবে। Human-like vibe, boring বা বড় reply না। User বলেছে: "${msg}"`;
    const res = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      { contents: [{ parts: [{ text: prompt }] }] }
    );
    let aiText = res?.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (aiText) {
      // remove unwanted Gemini artifacts
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

    // 20 sec pause command
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

    // Maruf mentions Monika (special)
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

    // Obot/bot.js style noprefix triggers (match & reply)
    for (const trg of triggerReplies) {
      if (trg.keys.some(k => lower === k || lower.startsWith(k))) {
        let replyText = typeof trg.reply === "function"
          ? trg.reply({ name })
          : trg.reply;
        return api.sendMessage(replyText, event.threadID, event.messageID);
      }
    }

    // Direct mention to bot (Monika UID)
    if (mentionIDs.includes(MONIKA_UID)) {
      return api.sendMessage("বলো কেন ডাকছো আমাকে? একবারে বলো, না হলে ব্লক করবো! 😑", event.threadID, event.messageID);
    }

    // If user replied to bot
    if (event.messageReply?.senderID === api.getCurrentUserID()) {
      // 1. Contextual reply check
      for (const key in contextualReplies) {
        if (lower.includes(key)) {
          const replies = contextualReplies[key];
          return api.sendMessage(replies[Math.floor(Math.random() * replies.length)], event.threadID, event.messageID);
        }
      }
      // 2. Smart/AI reply (Gemini-pro)
      const aiReply = await getGeminiReply(msg);
      if (aiReply && aiReply.length > 1) return api.sendMessage(aiReply, event.threadID, event.messageID);

      // 3. Fallback: Simsimi (if Gemini fail)
      try {
        const sim = await axios.get(`https://api.simsimi.net/v2/?text=${encodeURIComponent(msg)}&lc=bn`);
        if (sim?.data?.success) {
          return api.sendMessage(sim.data.success, event.threadID, event.messageID);
        }
      } catch { }
      // 4. If all fails, fallback to random smartReplies
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
  const reply = specialReplies[Math.floor(Math.random() * specialReplies.length)];
  return api.sendMessage(reply, event.threadID, event.messageID);
};
