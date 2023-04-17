
# LINE ถังรูป

## Firebase Init Service [Open Service]
1. Functions
2. Firestore Database
3. Storage
4. Emulator


## Directory Folder

````
cd functions
````
## Install Package
````
npm i
````
-----
## Rename File Environment
````
mv .env.example .env
````
## Edit

1. LINE_CHANNEL_SECRET= 'LINE Developer Console'
2. LINE_CHANNEL_ACCESS_TOKEN='LINE Developer Console'
3. BUCKET_NAME='firebase storage'

-----

## Firebase emulators:start

````
npm run serve
````

-----
## Deploy : [Check]
Please Check Firebase Account Authentication
````
npm run deploy
````


-----
## Firebase Service 
1. Cloud Functions
2. Cloud Storage
-----

## LINE API
-----

1. Join to Chat Group
https://developers.line.biz/en/reference/messaging-api/#join-event


2. Member Joined to Chat Group
https://developers.line.biz/en/reference/messaging-api/#member-joined-event
        

3. Event Message
https://developers.line.biz/en/reference/messaging-api/#message-event

6. Leave From Chat Group
https://developers.line.biz/en/reference/messaging-api/#leave-event


