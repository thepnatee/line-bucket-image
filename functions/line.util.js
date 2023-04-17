const functions = require("firebase-functions");
const crypto = require('crypto');
const axios = require("axios");

const LINE_MESSAGING_API = process.env.LINE_MESSAGING_API;
const LINE_DATA_MESSAGING_API = process.env.LINE_DATA_MESSAGING_API;


const LINE_CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET;

const LINE_HEADER = {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`
};
const LINE_DATA_HEADER = {
  "Authorization": `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`
};


exports.getContent = async (messageId) => {
  const response = await axios({
    method: 'get',
    headers: LINE_DATA_HEADER,
    url: `${LINE_DATA_MESSAGING_API}/message/${messageId}/content`,
    responseType: 'arraybuffer',
  });
  return response
};


exports.reply = (token, payload) => {
  return axios({
    method: "post",
    url: `${LINE_MESSAGING_API}/message/reply`,
    headers: LINE_HEADER,
    data: JSON.stringify({
      replyToken: token,
      messages: payload
    })
  });
};

exports.verifySignature = (originalSignature, body) => {
  let text = JSON.stringify(body);
  text = text.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, (e) => {
    return "\\u" + e.charCodeAt(0).toString(16).toUpperCase() + "\\u" + e.charCodeAt(1).toString(16).toUpperCase();
  });
  const signature = crypto.createHmac("SHA256", LINE_CHANNEL_SECRET).update(text).digest("base64").toString();
  if (signature !== originalSignature) {
    functions.logger.error("Unauthorized");
    return false;
  }
  return true;
};