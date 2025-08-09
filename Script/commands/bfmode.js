// commands/bfmode.js
const fs = require("fs");
const path = require("path");

// ====== CONFIG ======
const OWNER_UID = "100070782965051"; // Maruf
const DATA_DIR = path.join(__dirname, "..", "data");
const DATA_FILE = path.join(DATA_DIR, "bfmode.json");

// Auto check-in interval (minutes)
const CHECKIN_MINUTES = 30;

// ====== UTIL ======
function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ users: {}, logs: [] }, null, 2));
  }
}
function loadDB() {
  ensureDataFile();
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}
function saveDB(db) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
}
function humanName(user, fallback = "পাখি") {
  return user?.nick || fallback;
}
function isOwner(senderID) {
  return String(senderID) === OWNER_UID;
}
function delay(ms) {
  return new Promise(res => setTimeout(res, ms));
}
function formatDate(d) {
  try {
    const x = new Date(d);
    if (Number.isNaN(x.getTime())) return d;
    return x.toISOString().slice(0, 10);
  } catch (_) { return d; }
}
function addDiary(db, uid, mood, text) {
  db.logs.push({
    uid: String(uid),
    mood,
    text,
    time: Date.now()
  });
  if (db.logs.length > 5000) db.logs = db.logs.slice(-2000);
}

// ====== ROMANTIC LINES ======
const romanticReplies = [
  (n) => `শোন ${n}, সারাদিন ক্লান্ত হলেও তোর একটা টেক্সট দেখলেই এনার্জি ফুল 🔋🙂`,
  (n) => `তুই না থাকলে টেক্সটবুকেও হৃৎপিণ্ড নেই মনে হয়, ${n}… 🫶`,
  (n) => `চল, আজকে শুধু তুই-আমি—বাকিটা মিউট করে দিই, ${n} 💬💘`,
  (n) => `তোর নামটা লিখলেই হাসি আসে, ${n} 😌✨`,
  (n) => `শুধু একটা ‘হুম’ দিলেও চলবে, আমি বাকিটা বুঝে নেবো ${n} 😉`,
];

const softCheckIns = [
  (n) => `খাইলা? পানি খাস তো ${n}? নিজের খেয়াল রাখবি—আমি আছিই 🫶`,
  (n) => `আজকে রিল্যাক্স করবি, স্ট্রেস নে না ${n} — আমি পাশে আছি 🙂`,
  (n) => `ঘুম কম হলে রাগ করব কিন্তু! একটু রেস্ট নে ${n} 😴`,
  (n) => `চা/কফি খাইছিস? তোর সাথে হলে আরও ভালো লাগত ${n} ☕`,
  (n) => `আজকে নিজেকে একটু প্রাইজ দিবি—কারণ তুই দারুণ, ${n} 🌟`,
];

const neutralReplies = [
  "হুম, নোট করলাম।",
  "বুঝেছি, ধন্যবাদ।",
  "ঠিক আছে, কন্টিনিউ করো।",
  "পেয়েছি।",
  "ঠিক আছে, carry on.",
];

// ====== BIRTHDAY / ANNIVERSARY WISHES ======
function specialDayLine(n, type) {
  if (type === "birthday") {
    return `Happy Birthday ${n}! আজকে তোর দিন—হাসিখুশি থাক, আমি পাশে আছি 🎂🎉`;
  }
  if (type === "anniversary") {
    return `Happy Anniversary ${n}! স্মৃতিগুলো জমা হোক—আজকের দিনটা আমাদের 💞`;
  }
  return "";
}

// ====== SCHEDULER (global) ======
async function startScheduler(api) {
  if (!globalThis.__BFMODE_TIMER__) {
    globalThis.__BFMODE_TIMER__ = setInterval(async () => {
      try {
        const db = loadDB();
        const now = new Date();
        const today = now.toISOString().slice(0, 10);

        // Loop all users with bfmode = true
        for (const [uid, u] of Object.entries(db.users)) {
          if (!u.on) continue;

          // Special day wish (once per day)
          let wished = false;
          if (u.birthday === today && u.lastBirthdayWish !== today) {
            const line = specialDayLine(humanName(u, "সোনা"), "birthday");
            if (u.lastThreadID) api.sendMessage(line, u.lastThreadID);
            u.lastBirthdayWish = today;
            wished = true;
            addDiary(db, uid, "special", "Birthday wish auto-sent");
          }
          if (u.anniversary === today && u.lastAnnivWish !== today) {
            const line = specialDayLine(humanName(u, "জান"), "anniversary");
            if (u.lastThreadID) api.sendMessage(line, u.lastThreadID);
            u.lastAnnivWish = today;
            wished = true;
            addDiary(db, uid, "special", "Anniversary wish auto-sent");
          }

          // Regular soft check-in
          if (!wished && u.lastThreadID) {
            const msg = pick(softCheckIns)(humanName(u, "পাখি"));
            api.sendMessage(msg, u.lastThreadID);
            addDiary(db, uid, "checkin", "Auto check-in sent");
          }
        }
        saveDB(db);
      } catch (e) {
        // silent
      }
    }, CHECKIN_MINUTES * 60 * 1000);
  }
}
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ====== COMMAND META ======
module.exports.config = {
  name: "bfmode",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Maruf Billah + 𓆩𝙎𝙪𝙯𝙪𓆪🥰(すず)💋 & Maruf System💫",
  description: "Boyfriend Mode: romantic, mood-based replies for selected users",
  commandCategory: "love",
  usages: `
.bfmode on/off   (reply/mention user)
.bfname <name>   (reply/mention user)
.setbfdate birthday YYYY-MM-DD (reply/mention user)
.setbfdate anniversary YYYY-MM-DD (reply/mention user)
.bfdiary         (reply/mention user)
  `.trim(),
  cooldowns: 2,
  prefix: true
};

// ====== INIT ======
module.exports.onLoad = async function({ api }) {
  ensureDataFile();
  startScheduler(api);
};

// ====== PASSIVE LISTENER ======
module.exports.handleEvent = async function({ api, event }) {
  // Only text messages
  if (!event || !event.body) return;

  const db = loadDB();
  const uid = String(event.senderID);
  const threadID = event.threadID;

  // Remember last thread for the user (so auto-checkin knows where to DM)
  if (!db.users[uid]) db.users[uid] = { on: false };
  db.users[uid].lastThreadID = threadID;
  saveDB(db);

  // If bfmode ON for sender → romantic reply (but keep it subtle)
  const user = db.users[uid];
  if (user?.on === true) {
    // Only reply if message mentions bot OR is a reply to bot OR contains emotional cue words
    const text = (event.body || "").toLowerCase();
    const cues = ["miss", "valo", "love", "mon", "খারাপ", "ভাল", "রাগ", "ভালবাসি", "miss you", "বেবি", "জানু", "জান"];
    const repliedToBot = !!event.messageReply && event.messageReply.senderID === api.getCurrentUserID();
    const mentionBot = text.includes("bot") || text.includes("suzu") || text.includes("সুজু") || text.includes("মনিকা");

    if (repliedToBot || mentionBot || cues.some(w => text.includes(w))) {
      const name = humanName(user, "জান");
      const line = pick(romanticReplies)(name);
      // typing effect
      await delay(400);
      api.sendMessage(line, threadID);
      const db2 = loadDB();
      addDiary(db2, uid, "romantic", `Auto romantic reply: ${line}`);
      saveDB(db2);
    }
  }
};

// ====== COMMAND RUNNER ======
module.exports.run = async function({ api, event, args }) {
  const senderID = String(event.senderID);
  const threadID = event.threadID;
  const mentionIDs = Object.keys(event.mentions || {});
  const repliedUID = event.messageReply?.senderID ? String(event.messageReply.senderID) : null;

  if (!args[0]) {
    return api.sendMessage(
      "🧩 BF Mode\n\n" +
      "• .bfmode on/off  (reply/mention user)\n" +
      "• .bfname <name>  (reply/mention user)\n" +
      "• .setbfdate birthday YYYY-MM-DD  (reply/mention)\n" +
      "• .setbfdate anniversary YYYY-MM-DD  (reply/mention)\n" +
      "• .bfdiary  (reply/mention user)\n",
      threadID, event.messageID
    );
  }

  // Owner-only
  if (!isOwner(senderID)) {
    return api.sendMessage("❌ এই কমান্ড শুধুই Owner (Maruf) ব্যবহার করতে পারবেন।", threadID, event.messageID);
  }

  // Target resolve
  const targetUID =
    (mentionIDs[0] ? String(mentionIDs[0]) : null) ||
    (repliedUID ? repliedUID : null) ||
    (args[1] && /^\d+$/.test(args[1]) ? String(args[1]) : null);

  const db = loadDB();

  // Sub-commands
  const sub = args[0].toLowerCase();

  // ===== .bfmode on/off =====
  if (sub === "on" || sub === "off") {
    if (!targetUID) return api.sendMessage("কাকে টার্গেট করবেন? রিপ্লাই/মেনশন দিন।", threadID, event.messageID);
    if (!db.users[targetUID]) db.users[targetUID] = { on: false };

    db.users[targetUID].on = (sub === "on");
    saveDB(db);

    return api.sendMessage(
      db.users[targetUID].on
        ? "✅ BF Mode চালু করা হলো। এখন থেকে উনি রোমান্টিক রিপ্লাই পাবেন।"
        : "⛔ BF Mode বন্ধ করা হলো।",
      threadID, event.messageID
    );
  }

  // ===== .bfname <name> =====
  if (sub === "bfname") {
    if (!targetUID) return api.sendMessage("রিপ্লাই/মেনশন করে ইউজার ধরিয়ে দিন।", threadID, event.messageID);
    const name = args.slice(1).join(" ").trim();
    if (!name) return api.sendMessage("নতুন ডাকনাম লিখুন: .bfname <name>", threadID, event.messageID);

    if (!db.users[targetUID]) db.users[targetUID] = { on: false };
    db.users[targetUID].nick = name;
    saveDB(db);

    return api.sendMessage(`✅ ডাকনাম সেট: ${name}`, threadID, event.messageID);
  }

  // ===== .setbfdate birthday YYYY-MM-DD / anniversary YYYY-MM-DD =====
  if (sub === "setbfdate") {
    const type = (args[1] || "").toLowerCase();
    const value = (args[2] || "").trim();

    if (!targetUID) return api.sendMessage("রিপ্লাই/মেনশন করে ইউজার ধরিয়ে দিন।", threadID, event.messageID);
    if (!["birthday", "anniversary"].includes(type)) {
      return api.sendMessage("ধরন দিন: birthday / anniversary\nউদাহরণ: .setbfdate birthday 2002-07-15", threadID, event.messageID);
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return api.sendMessage("তারিখ দিন YYYY-MM-DD ফরম্যাটে।", threadID, event.messageID);
    }

    if (!db.users[targetUID]) db.users[targetUID] = { on: false };
    db.users[targetUID][type] = value;
    saveDB(db);

    return api.sendMessage(`✅ ${type} সেট: ${formatDate(value)}`, threadID, event.messageID);
  }

  // ===== .bfdiary =====
  if (sub === "bfdiary") {
    const uid = targetUID || senderID;
    const logs = loadDB().logs.filter(x => x.uid === String(uid)).slice(-10).reverse();
    if (logs.length === 0) return api.sendMessage("ডায়েরি খালি।", threadID, event.messageID);

    const lines = logs.map(x => {
      const t = new Date(x.time).toLocaleString("en-GB");
      return `• [${x.mood}] ${t} → ${x.text}`;
    }).join("\n");

    return api.sendMessage(`📝 BF Diary (last 10)\n${lines}`, threadID, event.messageID);
  }

  // Fallback
  return api.sendMessage("অজানা সাব-কমান্ড। হেল্প মেসেজ দেখুন।", threadID, event.messageID);
};
