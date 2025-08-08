const Canvas = require("canvas");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "mew",
  version: "2.0.1",
  hasPermssion: 0,
  credits: "Maruf Billah",
  description: "🐱 কিউট বিড়ালের ছবিতে বাংলা বা ইংরেজি টেক্সট বসাও",
  commandCategory: "edit-img",
  cooldowns: 2,
  dependencies: {
    "canvas": "",
    "fs-extra": ""
  }
};

module.exports.run = async ({ api, event, args }) => {
  const text = args.join(" ");
  if (!text) return api.sendMessage("😽 বিড়ালের জন্য কিছু লিখো, আমি ছবিতে বসিয়ে দিবো!", event.threadID, event.messageID);

  const baseImagePath = path.join(__dirname, 'cache', 'basecat.jpg');
  const outputPath = path.join(__dirname, 'cache', 'mew_output.png');
  const fontPath = path.join(__dirname, 'fonts', 'NotoSansBengali_Condensed-Black.ttf');

  // যদি ফন্ট রেজিস্টার করা না থাকে তাহলে করো
  Canvas.registerFont(fontPath, { family: 'BanglaCat' });

  // যদি বিড়ালের বেজ ইমেজ না থাকে তাহলে ডাউনলোড করে রাখো
  if (!fs.existsSync(baseImagePath)) {
    const axios = require("axios");
    const res = await axios.get("https://i.ibb.co/zFfbyqN/cat-base.jpg", { responseType: "arraybuffer" });
    fs.writeFileSync(baseImagePath, Buffer.from(res.data, "utf-8"));
  }

  const baseImage = await Canvas.loadImage(baseImagePath);
  const canvas = Canvas.createCanvas(baseImage.width, baseImage.height);
  const ctx = canvas.getContext("2d");

  ctx.drawImage(baseImage, 0, 0, baseImage.width, baseImage.height);

  // টেক্সট স্টাইলিং
  ctx.font = "28px BanglaCat";
  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;

  // লাইন ওয়ার্ড র‍্যাপিং
  const words = text.split(" ");
  let line = "", lines = [], maxWidth = 460;
  for (let word of words) {
    let testLine = line + word + " ";
    if (ctx.measureText(testLine).width > maxWidth) {
      lines.push(line);
      line = word + " ";
    } else {
      line = testLine;
    }
  }
  lines.push(line);

  // টেক্সট প্রিন্ট
  let y = 50;
  for (let ln of lines) {
    ctx.strokeText(ln.trim(), 20, y);
    ctx.fillText(ln.trim(), 20, y);
    y += 38;
  }

  const buffer = canvas.toBuffer();
  fs.writeFileSync(outputPath, buffer);

  return api.sendMessage({
    body: `🐾 বিড়াল বললো:\n"${text}"`,
    attachment: fs.createReadStream(outputPath)
  }, event.threadID, () => fs.unlinkSync(outputPath), event.messageID);
};
