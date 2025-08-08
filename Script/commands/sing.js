const axios = require("axios");
const fs = require("fs");

const baseApiUrl = async () => {
  const base = await axios.get("https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json");
  return base.data.api;
};

module.exports.config = {
  name: "sing",
  version: "2.2.0",
  aliases: ["music", "play"],
  credits: "💫Butterfly🦋 Sizu💟 & Maruf Billah",
  countDown: 5,
  hasPermssion: 0,
  description: "Download audio from YouTube directly",
  commandCategory: "media",
  usages: "{pn} [song name/link]"
};

module.exports.run = async ({ api, args, event }) => {
  const checkurl = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))((\w|-){11})(?:\S+)?$/;
  let videoID;
  const urlYtb = checkurl.test(args[0]);
  const { threadID, messageID, senderID } = event;

  if (!args[0]) {
    return api.sendMessage("🎵 দয়া করে গানের নাম বা YouTube লিঙ্ক দিন!", threadID, messageID);
  }

  // ✅ React instead of sending "⌛" message
  api.setMessageReaction("⌛", messageID, (err) => {}, true);

  try {
    if (urlYtb) {
      const match = args[0].match(checkurl);
      videoID = match ? match[1] : null;

      const { data: { title, downloadLink } } = await axios.get(
        `${await baseApiUrl()}/ytDl3?link=${videoID}&format=mp3`
      );

      return api.sendMessage({
        body: title,
        attachment: await dipto(downloadLink, 'audio.mp3')
      }, threadID, () => fs.unlinkSync('audio.mp3'), messageID);

    } else {
      const keyWord = args.join(" ");
      const result = ((await axios.get(`${await baseApiUrl()}/ytFullSearch?songName=${encodeURIComponent(keyWord)}`)).data)[0];

      if (!result) return api.sendMessage("❌ কোনো গান পাওয়া যায়নি!", threadID, messageID);

      const idvideo = result.id;
      const { data: { title, downloadLink, quality } } = await axios.get(`${await baseApiUrl()}/ytDl3?link=${idvideo}&format=mp3`);

      return api.sendMessage({
        body: `🎶 ${title}\n🎧 Quality: ${quality}`,
        attachment: await dipto(downloadLink, 'audio.mp3')
      }, threadID, () => fs.unlinkSync('audio.mp3'), messageID);
    }
  } catch (error) {
    console.log(error);
    return api.sendMessage("❌ দুঃখিত, গান ডাউনলোড করা যায়নি বা আকার বড় ছিল।", threadID, messageID);
  }
};

async function dipto(url, pathName) {
  try {
    const response = (await axios.get(url, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(pathName, Buffer.from(response));
    return fs.createReadStream(pathName);
  } catch (err) {
    throw err;
  }
}
