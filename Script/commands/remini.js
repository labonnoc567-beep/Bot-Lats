// commands/remini.js
const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const sharp = require("sharp");

module.exports.config = {
  name: "remini",
  version: "1.3.0",
  hasPermssion: 0,
  credits: "𓆩𝑴𝒂𝒓𝒖𝒇 𝑺𝒚𝒔𝒕𝒆𝒎𓆪",
  description: "Photo enhance/upscale: local 2x or AI 4x (Replicate)",
  commandCategory: "edit",
  usages: ".remini [--ai|--4x] (reply to an image or give image URL)",
  cooldowns: 5,
  prefix: false,
  dependencies: { "fs-extra": "", "axios": "", "sharp": "" }
};

/**
 * / .remini সাপোর্ট (message listener)
 */
module.exports.handleEvent = async function({ api, event }) {
  try {
    const body = (event.body || "").trim();
    if (!body) return;
    const lower = body.toLowerCase();

    // allow: "/remini ..." or ".remini ..."
    if (lower.startsWith("/remini") || lower.startsWith(".remini")) {
      const parts = body.split(/\s+/);
      const args = parts.slice(1);
      return module.exports.run({ api, event, args });
    }
  } catch (e) {
    // silent
  }
};

/**
 * Helper: download any image URL to temp file
 */
async function downloadToTemp(url, tmpDir) {
  const fileName = `input_${Date.now()}.jpg`;
  const filePath = path.join(tmpDir, fileName);
  const res = await axios.get(url, { responseType: "arraybuffer" });
  await fs.outputFile(filePath, res.data);
  return filePath;
}

/**
 * Local enhance: 2x upscale + mild tune (no internet)
 */
async function localEnhance(inputPath, outPath) {
  const meta = await sharp(inputPath).metadata();
  const w = Math.max(1, meta.width || 512);
  const h = Math.max(1, meta.height || 512);

  await sharp(inputPath)
    .resize(Math.round(w * 2), Math.round(h * 2), { kernel: "lanczos3" })
    .sharpen(1.2, 1.0, 0.9)
    .gamma(1.02)
    .modulate({ saturation: 1.03, brightness: 1.02 })
    .jpeg({ quality: 92 })
    .toFile(outPath);

  return outPath;
}

/**
 * Replicate AI 4x (Real-ESRGAN) — needs REPLICATE_API_TOKEN
 */
async function aiUpscale(inputPath, outPath) {
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) throw new Error("REPLICATE_API_TOKEN missing");

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
  if (!fileUrl) throw new Error("Replicate file upload failed");

  // Either a full version hash or a slug like "real-esrgan"
  const modelVersion = process.env.REPLICATE_MODEL_VERSION || "real-esrgan";

  const prediction = await axios.post(
    "https://api.replicate.com/v1/predictions",
    {
      version: modelVersion,
      input: { image: fileUrl, scale: 4 }
    },
    { headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" } }
  );

  const id = prediction.data.id;
  let status = prediction.data.status, outputUrl = null;

  for (let i = 0; i < 40; i++) {
    await new Promise(r => setTimeout(r, 3000));
    const check = await axios.get(
      `https://api.replicate.com/v1/predictions/${id}`,
      { headers: { "Authorization": `Bearer ${token}` } }
    );
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

/**
 * Main runner (framework calls this on ".remini" too)
 */
module.exports.run = async function({ api, event, args }) {
  try {
    const useAI = args?.includes("--ai") || args?.includes("--4x");
    const tmpDir = path.join(__dirname, "tmp", "remini");
    await fs.ensureDir(tmpDir);

    // pick image: replied attachment or URL arg
    let imageUrl = null;

    // reply image
    if (event.type === "message_reply" && event.messageReply?.attachments?.length) {
      const att = event.messageReply.attachments.find(a => a?.url);
      if (att?.url) imageUrl = att.url;
    }
    // arg URL
    if (!imageUrl && args?.[0] && /^https?:\/\//i.test(args[0])) {
      imageUrl = args[0];
    }

    if (!imageUrl) {
      return api.sendMessage(
        "📌 ব্যবহার: .remini [--ai|--4x]\n👉 ইমেজে রিপ্লাই দিন বা ইমেজ URL দিন।\n⚙️ ডিফল্ট: লোকাল 2x। `--ai` দিলে Replicate 4x (টোকেন লাগবে)।\n✅ `/remini` দিলেও কাজ করবে।",
        event.threadID, event.messageID
      );
    }

    await api.sendMessage(useAI ? "⏳ AI 4x আপস্কেল হচ্ছে…" : "⏳ লোকাল 2x এনহ্যান্স হচ্ছে…", event.threadID, event.messageID);

    const inputPath = await downloadToTemp(imageUrl, tmpDir);
    const outName = `remini_${Date.now()}_${useAI ? "4x" : "2x"}.jpg`;
    const outPath = path.join(tmpDir, outName);

    const finalPath = useAI
      ? await aiUpscale(inputPath, outPath).catch(async (e) => {
          await api.sendMessage(`⚠️ AI মোড ব্যর্থ: ${e.message}\n🔁 লোকাল 2x-এ চালাচ্ছি…`, event.threadID);
          return await localEnhance(inputPath, outPath);
        })
      : await localEnhance(inputPath, outPath);

    await api.sendMessage({ body: useAI ? "✅ Done! (AI 4x)" : "✅ Done! (Local 2x)", attachment: fs.createReadStream(finalPath) }, event.threadID, event.messageID);

    // cleanup
    setTimeout(() => {
      fs.remove(inputPath).catch(() => {});
      fs.remove(finalPath).catch(() => {});
    }, 30 * 1000);

  } catch (err) {
    console.error(err);
    return api.sendMessage("❌ রিমিনি ব্যর্থ: " + (err.message || err), event.threadID, event.messageID);
  }
};
