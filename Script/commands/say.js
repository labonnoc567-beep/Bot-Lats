const fs = require("fs");
const axios = require("axios");
const path = require("path");

module.exports.config = {
  name: "say",
  version: "7.0.0",
  hasPermssion: 0,
  credits: "Maruf Billah",
  description: "Banglish = Grace voice, English/Bangla = Google female voice",
  commandCategory: "media",
  usages: "[text]",
  cooldowns: 3
};

const ELEVEN_API_KEY = "sk_ed308f71e69d792f797372054193b27d9fe07bc860931610";
const ELEVEN_VOICE_ID = "EXAVITQu4vr4xnSDxMaL"; // Grace

function detectLanguage(text) {
  const banglaRegex = /[\u0980-\u09FF]/;
  if (banglaRegex.test(text)) return "bn";
  if (/^[a-zA-Z0-9\s.,!?'"@#$%^&*()_+-=<>[\]{}]+$/.test(text)) return "en";
  return "banglish";
}

async function banglishToBangla(text) {
  try {
    const res = await axios.get(`https://api.aibn.tech/bnconvert?q=${encodeURIComponent(text)}`);
    return res.data?.converted || text;
  } catch {
    return text;
  }
}

module.exports.run = async ({ api, event, args }) => {
  const input = args.join(" ");
  if (!input) return api.sendMessage("🔈 কিছু লিখো, আমি কণ্ঠে বলবো!", event.threadID, event.messageID);

  const lang = detectLanguage(input);
  const filePath = path.join(__dirname, "cache", `say_${event.senderID}.mp3`);

  // 🔐 Banglish = ElevenLabs Grace Voice
  if (lang === "banglish") {
    try {
      const response = await axios({
        method: "POST",
        url: `https://api.elevenlabs.io/v1/text-to-speech/${ELEVEN_VOICE_ID}`,
        headers: {
          "xi-api-key": ELEVEN_API_KEY,
          "Content-Type": "application/json"
        },
        data: {
          text: input,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.85,
            style: 0.35,
            use_speaker_boost: true
          }
        },
        responseType: "arraybuffer"
      });

      fs.writeFileSync(filePath, response.data);
      return api.sendMessage({
        body: `🎧 Grace voice বললো (Banglish):\n${input}`,
        attachment: fs.createReadStream(filePath)
      }, event.threadID, () => fs.unlinkSync(filePath), event.messageID);

    } catch (err) {
      console.error("ElevenLabs Error:", err.message || err);
      return api.sendMessage("😓 ElevenLabs দিয়ে voice বানাতে সমস্যা হয়েছে!", event.threadID, event.messageID);
    }
  }

  // 🧠 Bangla/English = Google TTS
  const langCode = lang === "bn" ? "bn" : "en";
  try {
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(input)}&tl=${langCode}&client=tw-ob`;
    const res = await axios.get(url, { responseType: "arraybuffer" });
    fs.writeFileSync(filePath, Buffer.from(res.data, "utf-8"));

    return api.sendMessage({
      body: `🎧 Google voice বললো (${langCode.toUpperCase()}):\n${input}`,
      attachment: fs.createReadStream(filePath)
    }, event.threadID, () => fs.unlinkSync(filePath), event.messageID);
  } catch (err) {
    console.error("Google TTS Error:", err.message || err);
    return api.sendMessage("😓 Google voice চালাতে সমস্যা হয়েছে!", event.threadID, event.messageID);
  }
};
