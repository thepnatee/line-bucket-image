const { initializeApp,cert} = require('firebase-admin/app');
const { getFirestore} = require('firebase-admin/firestore');
const serviceAccount = require('./config.json');

initializeApp({
  credential: cert(serviceAccount)
});

const { Storage } = require('@google-cloud/storage');

const db = getFirestore();
const imagesDb = db.collection("images")

const bucketName = process.env.BUCKET_NAME;
const storage = new Storage();


const moment = require('moment-timezone');

/* Insert publicUrl by groupId */
exports.insertImageGroup = async (groupId, messageId, publicUrl) => {

  const date = moment().tz('Asia/Bangkok').format('YYYY-MM-DD')

  await imagesDb.add({
    groupId: groupId,
    messageId: messageId,
    publicUrl: publicUrl,
    date: date
  })
}

/*  delete Group by groupId */
exports.deleteGroup = async (groupId) => {

  let userDocument = imagesDb.where("groupId", "==", groupId)
  await userDocument.get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
          doc.ref.delete();
      });
  });

}

/*  Get Data By Date */
exports.getImage = async (groupId) => {
  let array = []
  const document = await imagesDb.where("groupId", "==", groupId).get()
  let documentCount = await imagesDb.where("groupId", "==", groupId).count().get()
  if (documentCount.data().count > 0) {
    document.forEach((doc) => {
      array.push(doc.data())
    });
  }
  return (array.length > 0) ? array : false
}

/* Save image to cloud storage */
exports.saveImageToStorage = async (message, groupId, binary) => {
  const date = moment().tz('Asia/Bangkok').format('YYYY-MM-DD')
  const storageBucket = storage.bucket(bucketName);
  let extension = getExtension(message, message.type)
  const file = storageBucket.file(`${groupId}/${date}/${message.id}.${extension}`);
  await file.save(binary.data);
  file.makePublic()
  return file.publicUrl()
};


function getExtension(message, messageType) {
  let extension = '';
  switch (messageType) {
    case "image":
      extension = 'png';
      break;
    case "video":
      extension = 'mp4';
      break;
    case "audio":
      extension = 'm4a';
      break;
    case "file":
      const regex = /\.([0-9a-z]+)(?:[\?#]|$)/i;
      const match = regex.exec(message.fileName);
      extension = match ? match[1] : '';
      break;
  }

  return extension

}
