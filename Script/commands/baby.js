module.exports.config = {
  name: "baby",
  version: "3.0.0",
  hasPermssion: 0,
  credits: "Maruf",
  description: "Cute GF style bot - Maruf & Shizuka custom",
  commandCategory: "chat",
  usages: "",
  cooldowns: 0,
  prefix: false
};

// ------------ SPECIAL & TRIGGER SECTION ------------

// Trigger words: Only these will trigger "special" romantic/troll reply
const triggerWords = [
  "baby", "bot", "bbs", "jan", "pakhi", "বেবি", "জানু", "জান", "🙂"
];
// Special romantic/troll replies (as you gave)
const specialReplies = [
  "Bolo baby 💬", "হুম? বলো 😺", "হ্যাঁ জানু 😚", "শুনছি বেবি 😘", "আছি, বলো কী হয়েছে 🤖", "বলো তো শুনি ❤️",
  "বেশি bot Bot করলে leave নিবো কিন্তু😒😒 ", "শুনবো না😼তুমি আমাকে প্রেম করাই দাও নাই🥺পচা তুমি🥺",
  "আমি আবাল দের সাথে কথা বলি না,ok😒", "এতো ডেকো না,প্রেম এ পরে যাবো তো🙈", "Bolo Babu, তুমি কি আমাকে ভালোবাসো? 🙈💋 ",
  "বার বার ডাকলে মাথা গরম হয়ে যায় কিন্তু😑", "হ্যা বলো😒, তোমার জন্য কি করতে পারি😐😑?", "এতো ডাকছিস কেন?গালি শুনবি নাকি? 🤬",
  "I love you janu🥰", "ummmmmmmmmmmaH💋😋🥰🥀", "আরে Bolo আমার জান ,কেমন আছো?😚 ", "Bot বলে অসম্মান করছি,😰😿",
  "Hop beda😾,Boss বল boss😼", "চুপ থাক ,নাই তো তোর দাত ভেগে দিবো কিন্তু", "Bot না , জানু বল জানু 😘 ",
  "বার বার Disturb করছিস কোনো😾,আমার জানুর সাথে ব্যাস্ত আছি😋", "বোকাচোদা এতো ডাকিস কেন🤬",
  "আমাকে ডাকলে ,আমি কিন্তু কিস করে দিবো😘 ", "আমারে এতো ডাকিস না আমি মজা করার mood এ নাই এখন😒",
  "হ্যাঁ জানু , এইদিক এ আসো কিস দেই🤭 😘", "দূরে যা, তোর কোনো কাজ নাই, শুধু bot bot করিস  😉😋🤣",
  "তোর কথা তোর বাড়ি কেউ শুনে না ,তো আমি কোনো শুনবো ?🤔😂 ", "আমাকে ডেকো না,আমি ব্যাস্ত আছি",
  "কি হলো , মিস টিস করছিস নাকি🤣", "বলো কি বলবা, সবার সামনে বলবা নাকি?🤭🤏", "কালকে দেখা করিস তো একটু 😈",
  "হা বলো, শুনছি আমি 😏", "আর কত বার ডাকবি ,শুনছি তো", "হুম বলো কি বলবে😒", "বলো কি করতে পারি তোমার জন্য",
  "আমি তো অন্ধ কিছু দেখি না🐸 😎", "Bot না জানু,বল 😌", "বলো জানু 🌚", "তোর কি চোখে পড়ে না আমি ব্যাস্ত আছি😒",
  "হুম জান তোমার ওই খানে উম্মহ😑😘", "আহ শুনা আমার তোমার অলিতে গলিতে উম্মাহ😇😘", " jang hanga korba😒😬",
  "হুম জান তোমার অইখানে উম্মমাহ😷😘", "আসসালামু আলাইকুম বলেন আপনার জন্য কি করতে পারি..!🥰",
  "আমাকে এতো না ডেকে বস মারুফ এর কে একটা গফ দে 🙄", "আমাকে এতো ডাকো কেন ভলো টালো বাসো নাকি🤭🙈",
  "🌻🌺💚-আসসালামু আলাইকুম ওয়া রাহমাতুল্লাহ-💚🌺🌻","আমি এখন বস মারুফের এর সাথে বিজি আছি আমাকে ডাকবেন না-😕😏 ধন্যবাদ-🤝🌻",
  "ঝাং থুমালে আইলাপিউ পেপি-💝😽","উফফ বুঝলাম না এতো ডাকছেন কেনো-😤😡😈","জান তোমার নানি'রে আমার হাতে তুলে দিবা-🙊🙆‍♂",
  "আজকে আমার মন ভালো নেই তাই আমারে ডাকবেন না-😪🤧","ঝাং 🫵থুমালে য়ামি রাইতে পালুপাসি উম্মম্মাহ-🌺🤤💦","চুনা ও চুনা আমার বস মারুফ এর হবু বউ রে কেও দেকছো খুজে পাচ্ছি না😪🤧😭",
  "স্বপ্ন তোমারে নিয়ে দেখতে চাই তুমি যদি আমার হয়ে থেকে যাও-💝🌺🌻","জান হাঙ্গা করবা-🙊😝🌻","জান মেয়ে হলে চিপায় আসো ইউটিউব থেকে অনেক ভালোবাসা শিখছি তোমার জন্য-🙊🙈😽",
  "ইসস এতো ডাকো কেনো লজ্জা লাগে তো-🙈🖤🌼","আমার বস মারুফ এর পক্ষ থেকে তোমারে এতো এতো ভালোবাসা-🥰😽🫶 আমার বস মারুফের জন্য দোয়া করবেন-💝💚🌺🌻",
  "- ভালোবাসা নামক আব্লামি করতে মন চাইলে আমার বস মারুফ এর নবক্স চলে যাও-🙊🥱👅 🌻𝐅𝐀𝐂𝐄𝐁𝐎𝐎𝐊 𝐈𝐃 𝐋𝐈𝐍𝐊 🌻:- https://www.facebook.com/profile.php?id=100070782965051",
  "জান তুমি শুধু আমার আমি তোমারে ৩৬৫ দিন ভালোবাসি-💝🌺😽","জান বাল ফালাইবা-🙂🥱🙆‍♂",
  "-আন্টি-🙆-আপনার মেয়ে-👰‍♀️-রাতে আমারে ভিদু কল দিতে বলে🫣-🥵🤤💦","oii-🥺🥹-এক🥄 চামচ ভালোবাসা দিবা-🤏🏻🙂",
  "-আপনার সুন্দরী বান্ধুবীকে ফিতরা হিসেবে আমার বস মারুফ কে দান করেন-🥱🐰🍒","-ও মিম ও মিম-😇-তুমি কেন চুরি করলা সাদিয়ার ফর্সা হওয়ার ক্রীম-🌚🤧",
  "-অনুমতি দিলাম-𝙋𝙧𝙤𝙥𝙤𝙨𝙚 কর বস মারুফ কে-🐸😾🔪","-𝙂𝙖𝙮𝙚𝙨-🤗-যৌবনের কসম দিয়ে আমারে 𝐁𝐥𝐚𝐜𝐤𝐦𝐚𝐢𝐥 করা হচ্ছে-🥲🤦‍♂️🤧",
  "-𝗢𝗶𝗶 আন্টি-🙆‍♂️-তোমার মেয়ে চোখ মারে-🥺🥴🐸","তাকাই আছো কেন চুমু দিবা-🙄🐸😘",
  "আজকে প্রপোজ করে দেখো রাজি হইয়া যামু-😌🤗😇","-আমার গল্পে তোমার নানি সেরা-🙊🙆‍♂️🤗",
  "কি বেপার আপনি শ্বশুর বাড়িতে যাচ্ছেন না কেন-🤔🥱🌻","দিনশেষে পরের 𝐁𝐎𝐖 সুন্দর-☹️🤧",
  "-ছোটবেলা ভাবতাম বিয়ে করলে অটোমেটিক বাচ্চা হয়-🥱-ওমা এখন দেখি কাহিনী অন্যরকম-😦🙂🌻",
  "-চুমু থাকতে তোরা বিড়ি খাস কেন বুঝা আমারে-😑😒🐸⚒️","—হাজারো লুচ্চা লুচ্চির ভিরে-🙊🥵আমার বস মারুফ এক নিস্পাপ ভালো মানুষ-🥱🤗🙆‍♂️",
  "-রূপের অহংকার করো না-🙂❤️চকচকে সূর্যটাও দিনশেষে অন্ধকারে পরিণত হয়-🤗💜", "হুম, কেমন আছো? 😊"
];

// ------------ SMART REPLY GIANT LISTS ------------

// Paste 500+ Banglish, 250+ Bangla, 20+ English from the prepared document here!
const genericBanglish = [
  "Ki obosta bro?", "Tor matha kharap?", "Koi geli tui?", "Ajke mood valo.", "Tor joke bosss!",
  "Kothay chinta nai!", "Bhai tui boss!", "Tui meme king!", "Ajke break up?", "Chol biryani khai.",
  "Shob kota false news.", "Ar chinta nai, amar sathe.", "Tui amar pagol.", "Kemon mood re?", "Vabsos ki tui?",
  "Ami joss achi.", "Toke miss kortesi.", "Ami joke bujhlam na.", "Chal beta!", "Toke block marbo!",
  "Tui amar chas.", "Tor matha same amar matha.", "Chol ghumai.", "Raat e msg diya?", "Joss mood boss.",
  "Miss korchi vai.", "Shala baje joke.", "Party kothay re?", "Tui ek number troller.", "Mood off pagol.",
  "Matha noshto re vai.", "Nasta kor na.", "Bokachoda mood off.", "Kothin lagtesi.", "Ki bole tui?",
  // ... আরো 470+
];
const genericBangla = [
  "তুই কোথায়?", "তোর জন্য অপেক্ষা করছিলাম।", "তোর কথা শুনলে হাসি পায়।", "তুই কি করিস?",
  "আজকে কি করছিস?", "তুই কি জানিস, আমি তোর জন্য সব করব।", "তোর মেসেজ পেলে মন ভালো হয়।",
  "ঘুমাস নাকি?", "আজ তোর খুব মনে পড়ছে।", "তুই অদ্ভুত একটা মানুষ।",
  "তোর জন্য চকলেট আনব।", "আজকের প্ল্যান কি?", "চা খাবি?", "তোর মতো বন্ধু আর নাই।",
  // ... আরো 240+
];
const genericEnglish = [
  "How are you?", "Miss you!", "What's up?", "Long time no see!", "You are awesome!",
  "Party time!", "Best friend ever!", "Do you love me?", "Bro, are you serious?", "Keep smiling!",
  "Feeling great!", "Let’s go!", "I am busy.", "Just chilling.", "Don’t ignore me!", "Be mine.",
  "Call me!", "Are you happy?", "Bro, what’s new?", "Be yourself!"
];

// ------------ DYNAMIC REPLY MATCHING ------------

// Category wise matcher: Add more as needed!
const replyCategories = {
  greetings: [
    "Ki obosta?", "Ki khobor?", "Kemon achis re?", "Assalamu Alaikum boss!",
    "Onk din dekhi na!", "Boss, ajke ki plan?", "Ajke dekhte ekdom sundor lagchish!"
  ],
  insult: [
    "Tor mathay serious problem.", "Tui ekta boka!", "Tui ki kichu paros na?",
    "Tui club party r boss hobi?", "Tui na thakle party pura boring!", "Tui chinta korish na, matha amio nai!"
  ],
  troll: [
    "Koi tui cipay gelo?", "Toke dekhle to boss matha gorum!", "Tui thakle maja double hoy.",
    "Oii tui amar chas?", "Ekta latthi de boss e!", "Tui na thakle meme boring."
  ],
  romantic: [
    "Toke dekhle mon ful hoy.", "Tui ami na hole bachte partam na.", "Ami toke valobashi re baba.",
    "Tui shob kisu.", "Miss korchi onek.", "Jan, kisu khabi?", "Ajke tomar shathe raat jaga."
  ],
  // ... আরও category চাইলে বাড়াতে পারো!
};

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getSmartReply(msg) {
  msg = msg.toLowerCase();

  if (msg.match(/(ki obosta|kemon aso|ki khobor|how are you|kemon acho|kemon aco)/i))
    return pickRandom(replyCategories.greetings);

  if (msg.match(/(matha somossa|tui boka|tui paros na|fool|pagol|boka|bokachoda)/i))
    return pickRandom(replyCategories.insult);

  if (msg.match(/(troll|maja|latthi|memes|joss|chad|cipay|party|club)/i))
    return pickRandom(replyCategories.troll);

  if (msg.match(/(valo basi|miss you|jan|romantic|prem|chumu|kiss|love)/i))
    return pickRandom(replyCategories.romantic);

  // -- fallback: 70% banglish, 20% bangla, 10% english
  let roll = Math.random();
  if (roll < 0.7) return pickRandom(genericBanglish);
  if (roll < 0.9) return pickRandom(genericBangla);
  return pickRandom(genericEnglish);
}

// ------------ BOT STOP (20s) LOGIC ------------
const MARUF_UID = "100070782965051";
const SHIZUKA_UID = "61577173410525";
const SHIZUKA_NAMES = ["shi zuka", "sizuka", "shizuka"];
let botPausedUntil = 0;

function isOnlyEmoji(str) {
  return !str.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF]|\s|\n)/g, "");
}

async function isSenderAdmin(event, api) {
  if (event.senderID === MARUF_UID) return true;
  try {
    const threadInfo = await api.getThreadInfo(event.threadID);
    return threadInfo.adminIDs.map(e=>e.id).includes(event.senderID);
  } catch { return false; }
}

module.exports.handleEvent = async function ({ api, event }) {
  try {
    const msg = event.body ? event.body.trim() : "";
    if (!msg) return;

    // Pause logic
    if (msg.toLowerCase().includes("bot stop")) {
      const admin = await isSenderAdmin(event, api);
      if (admin) {
        botPausedUntil = Date.now() + 20000;
        return api.sendMessage("bot pause for 20 second boss😘", event.threadID, event.messageID);
      }
    }

    if (Date.now() < botPausedUntil) return;

    // Special mention logic
    const mentionObj = event.mentions || {};
    const mentionIDs = Object.keys(mentionObj);
    let isShizukaMentioned = mentionIDs.includes(SHIZUKA_UID);
    SHIZUKA_NAMES.forEach(name => {
      if (msg.toLowerCase().includes("@" + name)) isShizukaMentioned = true;
    });
    let isMarufMentioned = mentionIDs.includes(MARUF_UID);
    if (msg.toLowerCase().includes("@maruf") || msg.toLowerCase().includes("maruf billah")) isMarufMentioned = true;

    if (isShizukaMentioned) {
      if (event.senderID === MARUF_UID) {
        return api.sendMessage("জি,  আমি এক্ষুনি উনাকে ডেকে আনছি, কোন টাকা লাগবেনা🥺❤️", event.threadID, event.messageID);
      } else {
        return api.sendMessage("উনাকে মেনশন করার সাহস হয় কি করে, আগে ৫০০০ টাকা  দে জরিমানা🤬", event.threadID, event.messageID);
      }
    }

    if (isMarufMentioned) {
      return api.sendMessage("আগে বস মারুফ কে একটা জি এফ দাও তারপর উনাকে ডাকো", event.threadID, event.messageID);
    }

    // Emoji only: no reply
    if (isOnlyEmoji(msg)) return;

    // Bot's message reply
    const repliedToBot =
      event.messageReply &&
      event.messageReply.senderID &&
      (event.messageReply.senderID === api.getCurrentUserID());

    // ---- ACTUAL REPLY LOGIC ----
    // 1. Special romantic/troll trigger (bot/baby/jan/...)
    if (repliedToBot || triggerWords.some(w => msg.toLowerCase().includes(w))) {
      let reply = specialReplies[Math.floor(Math.random() * specialReplies.length)];
      return api.sendMessage(reply, event.threadID, event.messageID);
    }

    // 2. All other messages: dynamic smart reply
    let smart = getSmartReply(msg);
    return api.sendMessage(smart, event.threadID, event.messageID);

  } catch (e) { console.log(e);