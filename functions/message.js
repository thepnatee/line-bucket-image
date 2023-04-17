exports.welcomeMessage = () => ({
  "type": "text",
  "text": "สวัสดี ทุกคนมาเริ่มเก็บรูปด้วยน้อง ถังรูป กันเถอะะ \r\n\r\n เพียงแค่ส่งรูปและรอสักครู่น้องจะ เก็บรูป และ generate url ให้ ",
})

exports.memberJoinedMessage = (displayName) => ({
  "type": "text",
  "text": "สวัสดี " + displayName + " ผมชื่อน้องถังรูปนะ ขณะนี้ ผมกำลังรวมรูปภายในกลุ่ม \n\r\n\r เพียงแค่ส่งรูปและรอสักครู่ผมจะ เก็บรูป และ generate url ให้ ",
})

exports.text = (text) => ({
  "type": "text",
  "text": text,
})