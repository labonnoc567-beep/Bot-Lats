module.exports.config = {
  name: "baby",
  version: "4.0.0",
  hasPermssion: 0,
  credits: "Maruf",
  description: "GF style Bengali smart bot, reply only on trigger or reply",
  commandCategory: "chat",
  usages: "",
  cooldowns: 0,
  prefix: false
};

const triggerWords = ["baby", "bot", "bbs", "jan", "pakhi", "বেবি", "জানু", "জান"];
const MARUF_UID = "100070782965051";
const MONIKA_UID = "100070782965051";
const MONIKA_NAMES = ["shi zuka", "sizuka", "shizuka", "Princess", "Monika", "princess Monika", "মনিকা", "মনি", "Monika", "Moni"];

const specialReplies = [
  "Bolo baby 💬", "হুম? বলো 😺", "হ্যাঁ জানু 😚", "শুনছি বেবি 😘", "আছি, বলো কী হয়েছে 🤖", "বলো তো শুনি ❤️",
  "বেশি bot Bot করলে leave নিবো কিন্তু😒😒 ", "শুনবো না😼তুমি আমাকে প্রেম করাই দাও নাই🥺পচা তুমি🥺",
  "আমি আবাল দের সাথে কথা বলি না,ok😒", "এতো ডেকো না,প্রেম এ পরে যাবো তো🙈", "Bolo Babu, তুমি কি আমাকে ভালোবাসো? 🙈💋 ",
  "বার বার ডাকলে মাথা গরম হয়ে যায় কিন্তু😑", "হ্যা বলো😒, তোমার জন্য কি করতে পারি😐😑?", "এতো ডাকছিস কেন?গালি শুনবি নাকি? 🤬",
  "I love you janu🥰", "ummmmmmmmmmmaH💋😋🥰🥀", "আরে Bolo আমার জান ,কেমন আছো?😚 ", "হুম, কেমন আছো? 😊"
];

const smartReplies = [
  "কি রে! তুই এতো cute কেন? 🤭", "তোর msg দেখেই হাসি পেলো! 😁", " গাজা খাওয়া কি ছেড়ে দিছো? 🥺",
  "একটা গান শুনা😜", "এতো ডাকিস কেন ?", "এইখানে কি শশুর বাড়ি যা",
  "ওই জান, মন খারাপ? আমার কাছে আয়! 💖", "তুই আসলেই আলাদা! 🫶", "তোর মতো বন্ধুর জন্য সব পারি! 😌",
  "তুই এতো বুদ্ধিমান কিভাবে হলি বল তো? 🤔", "একটু চা খাওয়াবি? ☕", "সবসময় আমাকেই চিন্তা করিস নাকি?",
  "হুম, তোর msg পড়েই ভালো লাগল! 😘", "তুই না থাকলে একা লাগতো! 🥲", "তুই আসলেই দারুণ! 🌸", "চা খাই তুই?"
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
  "কি করো": ["চা খাই তুই😋?", " চিপায় বসে আছি", "তোকে কেন বলবো", "চুপ কর"]
};

let botPausedUntil = 0;

function isOnlyEmoji(str) {
  return !str.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF]|\s|\n)/g, "");
}
function isTrigger(text) {
  text = (text || "").toLowerCase();
  return triggerWords.some(w => text.includes(w));
}
async function isSenderAdmin(event, api) {
  if (event.senderID === MARUF_UID) return true;
  try {
    const threadInfo = await api.getThreadInfo(event.threadID);
    return threadInfo.adminIDs.map(e => e.id).includes(event.senderID);
  } catch { return false; }
}

module.exports.handleEvent = async function ({ api, event }) {
  try {
    const msg = event.body ? event.body.trim() : "";
    if (!msg) return;

    if (msg.toLowerCase() === "bot stop") {
      const admin = await isSenderAdmin(event, api);
      if (admin) {
        botPausedUntil = Date.now() + 20000;
        return api.sendMessage("bot pause for 20 second boss😘", event.threadID, event.messageID);
      }
    }
    if (Date.now() < botPausedUntil) return;

    const mentionObj = event.mentions || {};
    const mentionIDs = Object.keys(mentionObj);

    let isMonikaMentioned = mentionIDs.includes(MONIKA_UID);
    MONIKA_NAMES.forEach(name => {
      if (msg.toLowerCase().includes(name.toLowerCase())) isMonikaMentioned = true;
    });

    let isMarufMentioned = mentionIDs.includes(MARUF_UID);
    if (msg.toLowerCase().includes("@maruf") || msg.toLowerCase().includes("maruf billah")) isMarufMentioned = true;

    if (isMonikaMentioned) {
      if (event.senderID === MARUF_UID) {
        return api.sendMessage("জি,  আমি এক্ষুনি উনাকে ডেকে আনছি, কোন টাকা লাগবেনা🥺❤️", event.threadID, event.messageID);
      } else {
        return api.sendMessage("উনাকে মেনশন করার সাহস হয় কি করে, আগে ৫০০০ টাকা  দে জরিমানা🤬\nআমার বউকে মেনশন করার আগে সাত বার ভাববি", event.threadID, event.messageID);
      }
    }
    if (isMarufMentioned) {
      return api.sendMessage("আগে বস মারুফ কে একটা জি এফ দাও তারপর উনাকে ডাকো🤭", event.threadID, event.messageID);
    }

    if (isOnlyEmoji(msg)) return;

    // 1. Trigger word -> specialReplies
    if (isTrigger(msg)) {
      let reply = specialReplies[Math.floor(Math.random() * specialReplies.length)];
      return api.sendMessage(reply, event.threadID, event.messageID);
    }

    // 2. Contextual replies (if mention or bot reply)
    if (event.messageReply?.senderID === api.getCurrentUserID() || mentionIDs.includes(api.getCurrentUserID())) {
      const lowerMsg = msg.toLowerCase();
      for (const key in contextualReplies) {
        if (lowerMsg.includes(key)) {
          const replies = contextualReplies[key];
          const chosen = replies[Math.floor(Math.random() * replies.length)];
          return api.sendMessage(chosen, event.threadID, event.messageID);
        }
      }
    }

    // 3. Smart reply if replied to bot
    if (event.messageReply?.senderID === api.getCurrentUserID()) {
      let reply = smartReplies[Math.floor(Math.random() * smartReplies.length)];
      return api.sendMessage(reply, event.threadID, event.messageID);
    }

    // 4. Final fallback: always reply something
    let reply = smartReplies[Math.floor(Math.random() * smartReplies.length)];
    return api.sendMessage(reply, event.threadID, event.messageID);

  } catch (e) {
    console.log(e);
  }
};

module.exports.run = async function ({ api, event }) {
  const reply = specialReplies[Math.floor(Math.random() * specialReplies.length)];
  return api.sendMessage(reply, event.threadID, event.messageID);
};
