module.exports.config = {
  name: "chor",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "Sizu💟🦋 & Maruf System💫",
  description: "scooby doo template memes",
  commandCategory: "Picture",
  usages: "...",
  cooldowns: 5,
  dependencies: {
    "fs-extra": "",
    "axios": "",
    "canvas": "",
    "jimp": "",
    "node-superfetch": ""
  }
};

module.exports.circle = async (image) => {
  const jimp = global.nodemodule['jimp'];
  image = await jimp.read(image);
  image.circle();
  return await image.getBufferAsync("image/png");
};

module.exports.run = async ({ event, api, args, Users }) => {
  try {
    const Canvas = global.nodemodule['canvas'];
    const request = global.nodemodule["node-superfetch"];
    const jimp = global.nodemodule["jimp"];
    const fs = global.nodemodule["fs-extra"];
    const pathImg = __dirname + '/cache/chor_output.png';

    const mentionID = Object.keys(event.mentions)[0] || event.senderID;
    const mentionName = (await Users.getNameUser(mentionID)).toUpperCase();

    const canvas = Canvas.createCanvas(500, 670);
    const ctx = canvas.getContext('2d');
    const background = await Canvas.loadImage('https://i.imgur.com/ES28alv.png');

    let avatar = await request.get(`https://graph.facebook.com/${mentionID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`);
    avatar = await this.circle(avatar.body);

    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(await Canvas.loadImage(avatar), 48, 410, 111, 111);

    const imageBuffer = canvas.toBuffer();
    fs.writeFileSync(pathImg, imageBuffer);

    const messages = [
      `╭──────•◈•───────╮\n${mentionName}\nমুরগির দুধ চুরি করতে গিয়া ধরা থাইসে_ 🐸👻\nBOT OWNER Maruf Billah\n╰──────•◈•───────╯`,
      `╭──────•◈•───────╮\n${mentionName}\nচুরি করতে গিয়া বটি থাইকা গলায় লাগছে এখন ICU 🐸🩸\nBOT OWNER Maruf Billah\n╰──────•◈•───────╯`,
      `╭──────•◈•───────╮\n${mentionName}\nআলুর দাম বাড়ছে আর এইটা চুরি করতে গিয়া ধরা 🤦‍♂️🥔\nBOT OWNER Maruf Billah\n╰──────•◈•───────╯`,
      `╭──────•◈•───────╮\n${mentionName}\nবউয়ের মন চুরি করতে গিয়া বউয়ের আম্মুর কাছে ধরা খাইছে 😂💔\nBOT OWNER Maruf Billah\n╰──────•◈•───────╯`,
      `╭──────•◈•───────╮\n${mentionName}\nআইসক্রিম চুরি করতে গিয়া দাঁতে ব্যথা উঠছে 🤕🍦\nBOT OWNER Maruf Billah\n╰──────•◈•───────╯`,
      `╭──────•◈•───────╮\n${mentionName}\nচুরি করতে গিয়া CCTV তে কাইজ্জা 🤳🎥\nBOT OWNER Maruf Billah\n╰──────•◈•───────╯`
    ];

    const randomMsg = messages[Math.floor(Math.random() * messages.length)];

    api.sendMessage({
      body: randomMsg,
      attachment: fs.createReadStream(pathImg, { highWaterMark: 128 * 1024 }),
      mentions: [{
        tag: mentionName,
        id: mentionID
      }]
    }, event.threadID, () => fs.unlinkSync(pathImg), event.messageID);

  } catch (e) {
    api.sendMessage(e.stack, event.threadID, event.messageID);
  }
};
