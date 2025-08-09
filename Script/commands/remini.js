// commands/remini.js
const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const sharp = require("sharp");

module.exports.config = {
  name: "remini",
  version: "1.2.0",
  hasPermssion: 0,
  credits: "Maruf Billah + 𓆩𝙎𝙪𝙯𝙪𓆪🥰(すず)💋 & Maruf System💫",
  description: "Photo enhance/upscale: local 2x or AI 4x (Replicate)",
  commandCategory: "edit",
  usages: "[--ai|--4x] (reply to an image or give image URL)",
  cooldowns: 5,
  dependencies: {
    "fs-extra": "",
    "axios": "",
    "sharp": ""
  }
};

// =============== Helper: download to temp ===============
async function downloadToTemp(url, tmpDir) {
  const fileName = `input_${Date.now()}.jpg`;
  const filePath = path.join(tmpDir, fileName);
  const res = await axios.get(url, { responseType: "arraybuffer" });
  await fs.outputFile(filePath, res.data);
  return filePath;
}

// =============== Local enhance (no internet) ===============
async function localEnhance(inputPath, outPath) {
  // 2x upscale + mild denoise + sharpen + auto-contrast-like tweak
  const img = sharp(inputPath)
    .resize({ width: null, height: null, withoutEnlargement: false, fit: "inside", // keep aspect
      // upscale 2x by reading metadata first (done below)
    });

  const meta = await sharp(inputPath).metadata();
  const width = meta.width || 512;
  const height = meta.height || 512;

  await sharp(inputPath)
    .resize(Math.round(width * 2), Math.round(height * 2), { kernel: "lanczos3" })
    .sharpen(1.2, 1.0, 0.9)
    .gamma(1.02)
    .modulate({ saturation: 1.03, brightness: 1.02 })
    .jpeg({ quality: 92 })
    .toFile(outPath);

  return outPath;
}

// =============== Replicate AI 4x (optional) ===============
async function replicateUpscale(inputPath, outPath) {
  const token = process.env.REPLICATE_API_TOKEN; // Put your token in env
  if (!token) throw new Error("REPLICATE_API_TOKEN missing");

  // 1) Upload file bytes -> Replicate Files
  const fileData = await fs.readFile(inputPath);
  const upload = await axios.post(
    "https://api.replicate.com/v1/files",
    fileData,
    {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/octet-stream"
      }
    }
  );

  const fileUrl = upload.data?.urls?.get;
  if (!fileUrl) throw new Error("File upload failed for Replicate");

  // 2) Create prediction (Real-ESRGAN). 
  // Note: Model slug/version can change over time. This default works for most Real-ESRGAN runners.
  const prediction = await axios.post(
    "https://api.replicate.com/v1/predictions",
    {
      // If your account needs a specific version, set env REPLICATE_MODEL_VERSION
      version: process.env.REPLICATE_MODEL_VERSION || "real-esrgan",
      input: {
        image: fileUrl,
        scale: 4
      }
    },
    { headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" } }
  );

  const id = prediction.data.id;

  // 3) Poll until finished
  let status = prediction.data.status;
  let outputUrl = null;
  for (let i = 0; i < 40; i++) {
    await new Promise(r => setTimeout(r, 3000));
    const check = await axios.get(`https://api.replicate.com/v1/predictions/${id}`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    status = check.data.status;
    if (status === "succeeded") {
      outputUrl = Array.isArray(check.data.output) ? check.data.output[0] : check.data.output;
      break;
    }
    if (status === "failed" || status === "canceled") {
      throw new Error("Replicate job failed");
    }
  }
  if (!outputUrl) throw new Error("No output from Replicate");

  const imgRes = await axios.get(outputUrl, { responseType: "arraybuffer" });
  await fs.outputFile(outPath, imgRes.data);
  return outPath;
}

module.exports.run = async function({ api, event, args }) {
  try {
    const useAI = args.includes("--ai") || args.includes("--4x");
    const tmpDir = path.join(__dirname, "tmp", "remini");
    await fs.ensureDir(tmpDir);

    // Get image source: reply or URL arg
    let imageUrl = null;

    // If reply to image
    if (event.type === "message_reply" && event.messageReply?.attachments?.length) {
      const att = event.messageReply.attachments.find(a =>
        ["photo", "sticker"].includes(a.type) || a.url
      );
      if (att && att.url) imageUrl = att.url;
    }

    // Or direct URL arg
    if (!imageUrl && args[0] && /^https?:\/\//i.test(args[0])) {
      imageUrl = args[0];
    }

    if (!imageUrl) {
      return api.sendMessage(
        "📌 ব্যবহারঃ remini [--ai|--4x]\n👉 একটা ছবিতে রিপ্লাই দিয়ে বা ইমেজ URL দিয়ে চালান।\n⚙️ ডিফল্ট: লোকাল 2x। `--ai` দিলে Replicate 4x (টোকেন লাগবে)।",
        event.threadID, event.messageID
      );
    }

    const notice = useAI
      ? "⏳ AI 4x আপস্কেল শুরু হলো… (Replicate)"
      : "⏳ লোকাল 2x এনহ্যান্স শুরু হলো…";

    await api.sendMessage(notice, event.threadID, event.messageID);

    // Download input
    const inputPath = await downloadToTemp(imageUrl, tmpDir);

    const outName = `remini_${Date.now()}_${useAI ? "4x" : "2x"}.jpg`;
    const outPath = path.join(tmpDir, outName);

    // Process
    const finalPath = useAI
      ? await replicateUpscale(inputPath, outPath).catch(async (e) => {
          // Fallback to local if AI fails
          await api.sendMessage(`⚠️ AI মোড ব্যর্থ: ${e.message}\n🔁 লোকাল 2x মোডে চালাচ্ছি…`, event.threadID);
          return await localEnhance(inputPath, outPath);
        })
      : await localEnhance(inputPath, outPath);

    // Send back
    const msg = {
      body: useAI ? "✅ Done! (AI 4x)" : "✅ Done! (Local 2x)",
      attachment: fs.createReadStream(finalPath)
    };
    await api.sendMessage(msg, event.threadID, event.messageID);

    // Cleanup (optional)
    setTimeout(() => {
      fs.remove(inputPath).catch(() => {});
      fs.remove(finalPath).catch(() => {});
    }, 30 * 1000);

  } catch (err) {
    console.error(err);
    return api.sendMessage(
      "❌ রিমিনি প্রসেস ব্যর্থ হয়েছে। কারণ: " + (err.message || err),
      event.threadID, event.messageID
    );
  }
};
