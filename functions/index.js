const line = require('./line.util');
const firebase = require('./firebase.util');
const messages = require('./message');
const functions = require("firebase-functions");

/* 1. Webhook */
exports.webhook = functions.region("asia-northeast1").https.onRequest(async (req, res) => {


    if (req.method !== "POST") {
        return res.send(req.method);
    }

    if (!line.verifySignature(req.headers["x-line-signature"], req.body)) {
        return res.status(401).send("Unauthorized");
    }

    const events = req.body.events
    for (const event of events) {
        /* Using LINE Group Only */
        if (event.source.type !== "group") {
            return;
        }

        /*🔥 1. Join to Chat Group 🔥
        https://developers.line.biz/en/reference/messaging-api/#join-event
        */
        if (event.type === "join") {
            await line.reply(event.replyToken, [messages.welcomeMessage()])
            return;
        }


        /* 🔥 2. Member Joined to Chat Group 🔥
        https://developers.line.biz/en/reference/messaging-api/#member-joined-event
        }*/
        if (event.type === "memberJoined") {
            for (let member of event.joined.members) {
                if (member.type === "user") {
                    /* ✅ 2.1 [memberJoined] reply util.reply(event.replyToken,[messages.welcomeMessage()]) */
                    await line.reply(event.replyToken, [messages.memberJoinedMessage(profile.data.displayName, event.source.groupId)])
                }
            }
            return;
        }


        /* 🔥 3. Event Message is ['image', 'audio', 'video', 'file'] 🔥
       https://developers.line.biz/en/reference/messaging-api/#webhook-event-objects
        }*/
        const validateEventType = ['image', 'audio', 'video', 'file']
        if (event.type === "message" && validateEventType.includes(event.message.type)) {

            /* ✅ 3.1 Get Content By API  
            https://developers.line.biz/en/reference/messaging-api/#get-content
            */
            const binary = await line.getContent(event.message.id)


            /* ✅ 3.2 Upload Firebase Storage Bucket -> Convert binary  to Medie file  */
            const publicUrl = await firebase.saveImageToStorage(event.message, event.source.groupId, binary)


            /* ✅ 3.3 Insert Object to Firestore  */
            await firebase.insertImageGroup(event.source.groupId, event.message.id, publicUrl)

            /* ✅ 3.4 Reply View album  */
            await line.reply(event.replyToken, [messages.text(publicUrl)])

            return;
        }



        /* 🔥 4. Leave From Chat Group 🔥
        https://developers.line.biz/en/reference/messaging-api/#leave-event
        */
        if (event.type === "leave") {
            await firebase.deleteGroup(event.source.groupId)
            return;
        }


    }

    return res.send(req.method);
});
