const axios = require("axios");
const fs = require("fs-extra");

module.exports.config = {
  name: "edit",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "Sizu💟🦋 & Maruf System💫",
  description: "Edit photo with prompt (e.g. add girlfriend)",
  commandCategory: "ai-image",
  usages: "[reply image] [prompt]",
  cooldowns: 10
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, messageReply } = event;

  if (!messageReply || !messageReply.attachments || messageReply.attachments[0].type !== "photo") {
    return api.sendMessage("📌 দয়া করে একটি ছবিতে reply করে এডিট করার prompt দাও।", threadID, messageID);
  }

  const prompt = args.join(" ");
  if (!prompt) return api.sendMessage("✏️ কীভাবে এডিট করবে, সেটা লিখো (উদাহরণ: add girlfriend beside him)", threadID, messageID);

  const imageUrl = messageReply.attachments[0].url;
  const waiting = await api.sendMessage("⏳ Editing your image with prompt: " + prompt + "\nPlease wait...", threadID);

  try {
    const aiResponse = await axios.post(
      "https://api-inference.huggingface.co/models/lllyasviel/sd-controlnet-scribble",  // You can replace with any working model
      {
        inputs: {
          image: imageUrl,
          prompt: prompt
        }
      },
      {
        headers: {
          Authorization: "Bearer hf_jgNf6T0xxxxxYourHFtokenHere", // Replace with your actual HuggingFace Token
        },
        responseType: "arraybuffer"
      }
    );

    const imagePath = __dirname + "/cache/edited.png";
    fs.writeFileSync(imagePath, Buffer.from(aiResponse.data, "binary"));

    api.sendMessage({
      body: "✅ Here's your Edited image!",
      attachment: fs.createReadStream(imagePath)
    }, threadID, () => {
      fs.unlinkSync(imagePath);
      api.unsendMessage(waiting.messageID);
    });

  } catch (e) {
    console.error(e);
    api.sendMessage("❌ ছবি এডিট করতে সমস্যা হয়েছে। পরে আবার চেষ্টা করো।", threadID, messageID);
  }
};
