module.exports.config = {
  'name': "islamick",
  'version': "1.0.0",
  'hasPermssion': 0x0,
  'credits': "Sizu & Maruf System",
  'description': "RANDOM islamic video",
  'commandCategory': "Random video",
  'usages': "Statusvideo",
  'cooldowns': 0x2,
  'dependencies': {
    'request': '',
    'fs-extra': '',
    'axios': ''
  }
};
module.exports.run = async ({
  api: _0x31a67e,
  event: _0x1cca04,
  args: _0x529068,
  Users: _0x107186,
  Threads: _0x1e5ee2,
  Currencies: _0x2fd501
}) => {
  const _0x5764ef = global.nodemodule.request;
  const _0x343c20 = global.nodemodule["fs-extra"];
  var _0x29ff38 = ["https://i.imgur.com/FbnZI40.mp4", "https://i.imgur.com/8k6OOZg.mp4", "https://i.imgur.com/lgQghHX.mp4", "https://i.imgur.com/D7HZFSg.mp4", "https://i.imgur.com/vUe9Zlv.mp4", "https://i.imgur.com/oxFuJYw.mp4", "https://i.imgur.com/OKKlDBN.mp4", "https://i.imgur.com/6wWebFc.mp4", "https://i.imgur.com/K2LTmaA.mp4", "https://i.imgur.com/i9vKvTd.mp4", "https://i.imgur.com/Y6uBzxx.mp4", "https://i.imgur.com/ULtFVPQ.mp4", "https://i.imgur.com/wX8WJh3.mp4", "https://i.imgur.com/6A42EIx.mp4", "https://i.imgur.com/ozRevxt.mp4", "https://i.imgur.com/Gd49ZSo.mp4", "https://i.imgur.com/xu6lBXk.mp4", "https://i.imgur.com/sDNohv4.mp4", "https://i.imgur.com/JBu2Ie3.mp4", "https://i.imgur.com/UaY42rq.mp4", "https://i.imgur.com/NFxf731.mp4", "https://i.imgur.com/vv1HsMC.mp4", "https://i.imgur.com/Y8MPzLv.mp4", "https://i.imgur.com/9M1v1qK.mp4", "https://i.imgur.com/EgUy7v0.mp4", "https://i.imgur.com/IjDqg2G.mp4", "https://i.imgur.com/51NYqmO.mp4", "https://i.imgur.com/XjfJHh9.mp4", "https://i.imgur.com/XHrkPt4.mp4", "https://i.imgur.com/mqEYRdy.mp4", "https://i.imgur.com/NaVsFmQ.mp4", "https://i.imgur.com/31XSmVj.mp4", "https://i.imgur.com/PPamCPI.mp4", "https://i.imgur.com/i6Iy7iN.mp4"];
  var _0x4d24a3 = () => _0x31a67e.sendMessage({
    'body': "╭──────•◈•───────╮\n𝗠𝗔𝗗𝗘 𝗕𝗬: 𝗜𝘀𝗹𝗮𝗺𝗶𝗰𝗸 𝗰𝗵𝗮𝘁 𝗯𝗼𝘁 × 𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️ \n╰──────•◈•───────╯",
    'attachment': _0x343c20.createReadStream(__dirname + "/cache/1.mp4")
  }, _0x1cca04.threadID, () => _0x343c20.unlinkSync(__dirname + "/cache/1.mp4"));
  return _0x5764ef(encodeURI(_0x29ff38[Math.floor(Math.random() * _0x29ff38.length)])).pipe(_0x343c20.createWriteStream(__dirname + "/cache/cbt.mp4")).on("close", () => _0x4d24a3());
};
