const Canvas = require('canvas');
const fs = require('fs-extra');
const path = require('path');

module.exports.config = {
  name: "alert",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "💫Butterfly🦋 Sizu💟 & Maruf System💫",
  description: "Hacker alert meme (auto language detect)",
  commandCategory: "fun",
  usages: "alert [text]",
  cooldowns: 2
};

module.exports.run = async function({ api, event, args }) {
  const text = args.join(" ");
  if (!text)
    return api.sendMessage("⚠️ Write something!\nExample: /alert Access granted 😈", event.threadID, event.messageID);

  try {
    const canvas = Canvas.createCanvas(800, 450);
    const ctx = canvas.getContext('2d');

    // 🖤 Midnight hacker background
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Neon green border
    ctx.strokeStyle = "#00ff00";
    ctx.lineWidth = 8;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

    // Detect Bangla
    const isBangla = /[\u0980-\u09FF]/.test(text);

    // 👾 Hacker style title
    ctx.font = "bold 60px monospace";
    ctx.fillStyle = "#00ff00";
    ctx.fillText(isBangla ? "👾 সিস্টেম সতর্কতা!" : "👾 SYSTEM WARNING", 40, 90);

    // Message text
    ctx.font = "bold 38px monospace";
    ctx.fillStyle = "#00ff00";

    const wrapText = (ctx, text, x, y, maxWidth, lineHeight) => {
      const words = text.split(" ");
      let line = "";
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + " ";
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
          ctx.fillText(line, x, y);
          line = words[n] + " ";
          y += lineHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, x, y);
    };

    wrapText(ctx, text, 50, 180, 700, 55);

    const filePath = path.join(__dirname, "cache", `alert-${event.senderID}.png`);
    fs.writeFileSync(filePath, canvas.toBuffer());

    api.sendMessage({
      attachment: fs.createReadStream(filePath)
    }, event.threadID, () => fs.unlinkSync(filePath), event.messageID);

  } catch (err) {
    console.error(err);
    api.sendMessage("❌ Failed to create hacker alert image.", event.threadID, event.messageID);
  }
};
