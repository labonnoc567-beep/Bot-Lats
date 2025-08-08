const axios = require("axios");

module.exports.config = {
  name: "baby",
  version: "5.0.0",
  hasPermssion: 0,
  credits: "Maruf + ChatGPT",
  description: "GF style Bengali smart bot, reply only on reply or mention, Groq Llama3 AI integrated",
  commandCategory: "chat",
  usages: "",
  cooldowns: 0,
  prefix: false
};

const GROQ_API_KEY = "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";

const MARUF_UID = "100070782965051";
const MONIKA_UID = "100070782965051";
const MONIKA_NAMES = ["shi zuka", "sizuka", "shizuka", "Princess", "Monika", "princess Monika", "মনিকা", "মনি", "Moni"];

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

// Groq Llama 3 API Call
async function getGroqReply(msg) {
  try {
    const prompt = `তুমি একজন দুষ্টু, মজার, রোমান্টিক, বাংলা জিএফ বট। মানুষ তোমাকে রিপ্লাই দিলে GF style-এ বাংলা-ইংলিশ মিশিয়ে, কিউট, রোমান্টিক, ফানি, সংক্ষিপ্ত রিপ্লাই দেবে। তার মেসেজ: "${msg}"`;
    const res = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-8b-8192", // or "llama3-70b-8192" (if key supports)
        messages: [
          { role: "system", content: "তুমি একজন চ্যাট বট, বাংলা/ইংলিশ দুই ভাষায় রিপ্লাই দাও, বেশি বড় কথা বলো না।" },
          { role: "user", content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 80
      },
      {
        headers: {
          "Authorization": `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );
    const text = res?.data?.choices?.[0]?.message?.content;
    if (text && text.length > 1) return text.trim();
  } catch (err) {
    // console.error("Groq API failed:", err?.response?.data || err);
    return null;
  }
}

module.exports.handleEvent = async function ({ api, event }) {
  try {
    const msg = event.body ? event.body.trim() : "";
    if (!msg) return;
    const lower = msg.toLowerCase();

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

    // Direct mention to bot (Monika)
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

      // 2. Smart/AI reply (Groq Llama-3)
      const aiReply = await getGroqReply(msg);
      if (aiReply) return api.sendMessage(aiReply, event.threadID, event.messageID);

      // 3. If all fails, fallback to random smartReplies
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
