// commands/4k.js
const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

module.exports.config = {
  name: "4k",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𓆩𝑴𝒂𝒓𝒖𝒇 𝑺𝒚𝒔𝒕𝒆𝒎𓆪",
  description: "AI 4K upscale using Real-ESRGAN (Replicate)",
  commandCategory: "edit",
  usages: ".4k (reply to an image or give image URL)",
  cooldowns: 5,
  prefix: false,
  dependencies: { "fs-extra": "", "axios": "" }
};

// তোমার টোকেন (আগে দেওয়া)
const REPLICATE_API_TOKEN = "r8_ExB7PshSF09DSb3O5JCmsEr1EgrhsJg091jKj";

// /4k বা .4k — দুটোতেই সাপোর্ট
module.exports.handleEvent = async function({ api, event }) {
  const body = (event.body || "").trim().toLowerCase();
  if (!body) return;
  if (body.startsWith("/4k") || body.startsWith(".4k")) {
    const args = body.split(/\s+/).slice(1);
    return module.exports.run({ api, event, args });
  }
};

// Helper: download URL to temp
async function downloadToTemp(url, tmpDir) {
  const fileName = `input_${Date.now()}.jpg`;
  const filePath = path.join(tmpDir, fileName);
  const res = await axios.get(url, { responseType: "arraybuffer" });
  await fs.outputFile(filePath, res.data);
  return filePath;
}

// AI upscale 4x (Real-ESRGAN)
async function aiUpscale(inputPath, outPath) {
  const fileData = await fs.readFile(inputPath);
  
  // Upload file to Replicate
  const upload = await axios.post(
    "https://api.replicate.com/v1/files",
    fileData,
    {
      headers: {
        "Authorization": `Bearer ${REPLICATE_API_TOKEN}`,
        "Content-Type": "application/octet-stream"
      }
    }
  );

  const fileUrl = upload.data?.urls?.get;
  if (!fileUrl) throw new Error("File upload failed");

  // Start prediction
  const prediction = await axios.post(
    "https://api.replicate.com/v1/predictions",
    {
      version: "real-esrgan",
      input: { image: fileUrl, scale: 4 }
    },
    {
      headers: {
        "Authorization": `Bearer ${REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json"
      }
    }
  );

  const id = prediction.data.id;
  let outputUrl = null;

  for (let i = 0; i < 40; i++) {
    await new Promise(r => setTimeout(r, 3000));
    const check = await axios.get(
      `https://api.replicate.com/v1/predictions/${id}`,
      { headers: { Authorization: `Bearer ${REPLICATE_API_TOKEN}` } }
    );
    if (check.data.status === "succeeded") {
      outputUrl = Array.isArray(check.data.output) ? check.data.output[0] : check.data.output;
      break;
    }
    if (check.data.status === "failed" || check.data.status === "canceled") {
      throw new Error("AI upscale failed");
    }
  }

  if (!outputUrl) throw new Error("No output from Replicate");

  const imgRes = await axios.get(outputUrl, { responseType: "arraybuffer" });
  await fs.outputFile(outPath, imgRes.data);
  return outPath;
}

module.exports.run = async function({ api, event, args }) {
  try {
    const tmpDir = path.join(__dirname, "tmp", "4k");
    await fs.ensureDir(tmpDir);

    // Get image source
    let imageUrl = null;
    if (event.type === "message_reply" && event.messageReply?.attachments?.length) {
      const att = event.messageReply.attachments.find(a => a?.url);
      if (att?.url) imageUrl = att.url;
    }
    if (!imageUrl && args?.[0] && /^https?:\/\//i.test(args[0])) {
      imageUrl = args[0];
    }

    if (!imageUrl) {
      return api.sendMessage(
        "📌 ব্যবহার: .4k (ইমেজে রিপ্লাই দিন বা ইমেজ URL দিন)\n✅ `/4k` দিলেও কাজ করবে।",
        event.threadID, event.messageID
      );
    }

    await api.sendMessage("⏳ 4K আপস্কেল হচ্ছে… (AI 4x)", event.threadID, event.messageID);

    const inputPath = await downloadToTemp(imageUrl, tmpDir);
    const outName = `4k_${Date.now()}.jpg`;
    const outPath = path.join(tmpDir, outName);

    const finalPath = await aiUpscale(inputPath, outPath);

    await api.sendMessage(
      { body: "✅ Done! (4K AI Upscale)", attachment: fs.createReadStream(finalPath) },
      event.threadID,
      event.messageID
    );

    // Cleanup
    setTimeout(() => {
      fs.remove(inputPath).catch(() => {});
      fs.remove(finalPath).catch(() => {});
    }, 30000);

  } catch (err) {
    console.error(err);
    api.sendMessage("❌ 4K প্রসেস ব্যর্থ: " + (err.message || err), event.threadID, event.messageID);
  }
};
