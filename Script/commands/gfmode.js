// commands/gfmode.js
const fs = require("fs");
const path = require("path");

// ====== CONFIG ======
const OWNER_UID = "100070782965051"; // Maruf
const DATA_DIR = path.join(__dirname, "..", "data");
const DATA_FILE = path.join(DATA_DIR, "gfmode.json");

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
function humanName(user, fallback = "জান") {
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
  db.logs.push({ uid: String(uid), mood, text, time: Date.now() });
  if (db.logs.length > 5000) db.logs = db.logs.slice(-2000);
}
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ====== LINES ======
const romanticReplies = [
  (n) => `এই ${n}, তোর একটা “হাই” মানেই আমার পুরো দিন সেট ✅💖`,
  (n) => `মন খারাপ? আমি আছি তো ${n} — মাথা একটু আমার কাঁধে রাখ 😌`,
  (n) => `চুপচাপ থাকলে চিন্তা করি—টেক্সটটা দে ${n}, আমি শুনছি 🫶`,
  (n) => `${n}, তুই হাসলে আমার নোটিফিকেশনও গ্লো করে ✨`,
  (n) => `ভালোবাসা কমেন্ট না, অ্যাকশন—তাই তো তোকে ননস্টপ কেয়ার করি ${n} 💞`,
];

const softCheckIns = [
  (n) => `খাইলা? পানি খাস তো ${n}? নিজের খেয়াল রাখবি—আমি আছিই 🫶`,
  (n) => `আজকে রেস্ট নে একটু, ওভারথিংকিং বাদ দে ${n} 🙂`,
  (n) => `ঘুম কম হলে রাগ করবো কিন্তু! একটু ঘুম দিয়ে নে ${n} 😴`,
  (n) => `চা/কফি? যদি পাশে থাকতে পারতাম ${n} ☕`,
  (n) => `${n}, তুই যে স্পেশাল—নিজেকেও তেমন ট্রিট দিবি আজকে 🌟`,
];

const neutralReplies = [
  "হুম, নোট করলাম।",
  "বুঝেছি, ধন্যবাদ।",
  "ঠিক আছে, চালিয়ে যাও।",
  "পেয়েছি।",
  "ওকে, carry on.",
];

// ====== SPECIAL DAY ======
function specialDayLine(n, type) {
  if (type === "birthday") {
    return `🎂 Happy Birthday ${n}! হাসি-খুশিতে ভরে থাক আজকের দিনটা 💖`;
  }
  if (type === "anniversary") {
    return `💍 Happy Anniversary ${n}! স্মৃতিগুলো আরও মিষ্টি হোক আজকের দিনে 💞`;
  }
  return "";
}

// ====== SCHEDULER ======
async function startScheduler(api) {
  if (!globalThis.__GFMODE_TIMER__) {
    globalThis.__GFMODE_TIMER__ = setInterval(async () => {
      try {
        const db = loadDB();
        const now = new Date();
        const today = now.toISOString().slice(0, 10);

        for (const [uid, u] of Object.entries(db.users)) {
          if (!u.on) continue;

          let wished = false;
          if (u.birthday === today && u.lastBirthdayWish !== today) {
            const line = specialDayLine(humanName(u, "সোনা"), "birthday");
            if (u.lastThreadID) api.sendMessage(line, u.lastThreadID);
            u.lastBirthdayWish = today;
            wished = true;
            addDiary(db, uid, "special", "Birthday wish auto-sent");
          }
          if (u.anniversary === today && u.lastAnnivWish !== today) {
            const line = specialDayLine(humanName(u, "পাখি"), "anniversary");
            if (u.lastThreadID) api.sendMessage(line, u.lastThreadID);
            u.lastAnnivWish = today;
            wished = true;
            addDiary(db, uid, "special", "Anniversary wish auto-sent");
          }

          if (!wished && u.lastThreadID) {
            const msg = pick(softCheckIns)(humanName(u, "জান"));
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

// ====== COMMAND META ======
module.exports.config = {
  name: "gfmode",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Maruf Billah + 𓆩𝙎𝙪𝙯𝙪𓆪🥰(すず)💋 & Maruf System💫",
  description: "Girlfriend Mode: নির্বাচিত ইউজারের জন্য রোমান্টিক, কেয়ারিং, মুড-বেসড রিপ্লাই",
  commandCategory: "love",
  usages: `
.gfmode on/off   (reply/mention user)
.gfname <name>   (reply/mention user)
.setgfdate birthday YYYY-MM-DD (reply/mention)
.setgfdate anniversary YYYY-MM-DD (reply/mention)
.gfdiary         (reply/mention user)
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
  if (!event || !event.body) return;

  const db = loadDB();
  const uid = String(event.senderID);
  const threadID = event.threadID;

  if (!db.users[uid]) db.users[uid] = { on: false };
  db.users[uid].lastThreadID = threadID;
  saveDB(db);

  // GF ON হলে স্মার্ট ট্রিগারে রোমান্টিক রিপ্লাই
  const user = db.users[uid];
  if (user?.on === true) {
    const text = (event.body || "").toLowerCase();
    const cues = ["miss", "valo", "love", "mon", "খারাপ", "ভাল", "রাগ", "ভালবাসি", "miss you", "বেবি", "জানু", "জান", "pakhi", "সোনা"];
    const repliedToBot = !!event.messageReply && event.messageReply.senderID === api.getCurrentUserID?.();
    const mentionBot = text.includes("bot") || text.includes("suzu") || text.includes("সুজু") || text.includes("মনিকা") || text.includes("monika");

    if (repliedToBot || mentionBot || cues.some(w => text.includes(w))) {
      const name = humanName(user, "জান");
      const line = pick(romanticReplies)(name);
      await delay(400); // typing feel
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
      "💞 GF Mode\n\n" +
      "• .gfmode on/off  (reply/mention user)\n" +
      "• .gfname <name>  (reply/mention user)\n" +
      "• .setgfdate birthday YYYY-MM-DD  (reply/mention)\n" +
      "• .setgfdate anniversary YYYY-MM-DD  (reply/mention)\n" +
      "• .gfdiary  (reply/mention user)\n",
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
  const sub = args[0].toLowerCase();

  // ===== .gfmode on/off =====
  if (sub === "on" || sub === "off") {
    if (!targetUID) return api.sendMessage("কাকে টার্গেট করবেন? রিপ্লাই/মেনশন দিন।", threadID, event.messageID);
    if (!db.users[targetUID]) db.users[targetUID] = { on: false };

    db.users[targetUID].on = (sub === "on");
    saveDB(db);

    return api.sendMessage(
      db.users[targetUID].on
        ? "✅ GF Mode চালু। এখন থেকে উনি রোমান্টিক রিপ্লাই পাবেন।"
        : "⛔ GF Mode বন্ধ করা হয়েছে।",
      threadID, event.messageID
    );
  }

  // ===== .gfname <name> =====
  if (sub === "gfname") {
    if (!targetUID) return api.sendMessage("রিপ্লাই/মেনশন করে ইউজার ধরিয়ে দিন।", threadID, event.messageID);
    const name = args.slice(1).join(" ").trim();
    if (!name) return api.sendMessage("নতুন ডাকনাম লিখুন: .gfname <name>", threadID, event.messageID);

    if (!db.users[targetUID]) db.users[targetUID] = { on: false };
    db.users[targetUID].nick = name;
    saveDB(db);

    return api.sendMessage(`✅ ডাকনাম সেট: ${name}`, threadID, event.messageID);
  }

  // ===== .setgfdate birthday YYYY-MM-DD / anniversary YYYY-MM-DD =====
  if (sub === "setgfdate") {
    const type = (args[1] || "").toLowerCase();
    const value = (args[2] || "").trim();

    if (!targetUID) return api.sendMessage("রিপ্লাই/মেনশন করে ইউজার ধরিয়ে দিন।", threadID, event.messageID);
    if (!["birthday", "anniversary"].includes(type)) {
      return api.sendMessage("ধরন দিন: birthday / anniversary\nউদাহরণ: .setgfdate birthday 2002-07-15", threadID, event.messageID);
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return api.sendMessage("তারিখ দিন YYYY-MM-DD ফরম্যাটে।", threadID, event.messageID);
    }

    if (!db.users[targetUID]) db.users[targetUID] = { on: false };
    db.users[targetUID][type] = value;
    saveDB(db);

    return api.sendMessage(`✅ ${type} সেট: ${formatDate(value)}`, threadID, event.messageID);
  }

  // ===== .gfdiary =====
  if (sub === "gfdiary") {
    const uid = targetUID || senderID;
    const logs = loadDB().logs.filter(x => x.uid === String(uid)).slice(-10).reverse();
    if (logs.length === 0) return api.sendMessage("ডায়েরি খালি।", threadID, event.messageID);

    const lines = logs.map(x => {
      const t = new Date(x.time).toLocaleString("en-GB");
      return `• [${x.mood}] ${t} → ${x.text}`;
    }).join("\n");

    return api.sendMessage(`📝 GF Diary (last 10)\n${lines}`, threadID, event.messageID);
  }

  return api.sendMessage("অজানা সাব-কমান্ড। হেল্প মেসেজ দেখুন।", threadID, event.messageID);
};
