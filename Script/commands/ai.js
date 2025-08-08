const _0x4d6d=["axios","messageReply","attachments","length","type","photo","url","post","https://gemini.minipro-3r.repl.co/api","text_and_image","text_only","join"," ","data","result","sendMessage","threadID","messageID","Please\x20enter\x20a\x20message\x20to\x20send\x20to\x20Gemini\x20AI.","❌\x20Error\x20processing\x20your\x20Gemini\x20AI\x20request.\n","Error\x20calling\x20Gemini\x20(image):","❌\x20Error\x20processing\x20your\x20Gemini\x20image+text\x20request.","Error\x20calling\x20Gemini\x20(text):"];
const axios=require(_0x4d6d[0]);

module.exports.config={
  name:"ai",
  version:"1.0",
  credit:"💫Butterfly🦋 Sizu💟 & Maruf System💫",
  description:"Gemini AI text/image reply",
  cooldowns:5,
  hasPermssion:0,
  commandCategory:"gemini",
  usages:{en:"ai <message> | <image reply (optional)>"}
};

module.exports.run=async({api,args,event})=>{
  const prompt=args[_0x4d6d[11]](_0x4d6d[12]),
        threadID=event[_0x4d6d[15]],
        messageID=event[_0x4d6d[16]];

  if(event[_0x4d6d[1]]&&event[_0x4d6d[1]][_0x4d6d[2]]&&event[_0x4d6d[1]][_0x4d6d[2]][_0x4d6d[3]]>0&&event[_0x4d6d[1]][_0x4d6d[2]][0][_0x4d6d[4]]===_0x4d6d[5]){
    const imageURL=event[_0x4d6d[1]][_0x4d6d[2]][0][_0x4d6d[6]];
    try{
      const res=await axios[_0x4d6d[7]](_0x4d6d[8],{modelType:_0x4d6d[9],prompt,imageParts:[imageURL]});
      const result=res[_0x4d6d[13]][_0x4d6d[14]];
      return api[_0x4d6d[15]](result,threadID,messageID);
    }catch(err){
      console.error(_0x4d6d[18],err[_0x4d6d[13]]);
      return api[_0x4d6d[15]](_0x4d6d[19],threadID,messageID);
    }
  }else{
    if(!prompt)return api[_0x4d6d[15]](_0x4d6d[17],threadID,messageID);
    try{
      const res=await axios[_0x4d6d[7]](_0x4d6d[8],{modelType:_0x4d6d[10],prompt});
      const result=res[_0x4d6d[13]][_0x4d6d[14]];
      return api[_0x4d6d[15]](result,threadID,messageID);
    }catch(err){
      console.error(_0x4d6d[20],err[_0x4d6d[13]]);
      return api[_0x4d6d[15]](_0x4d6d[17]+err,_0x4d6d[15],messageID);
    }
  }
};
