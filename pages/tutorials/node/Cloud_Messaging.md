
# Firebase Cloud Messaging with Node.js

## Step 1: Install Firebase Admin SDK

First, install the Firebase Admin SDK using npm:

```bash
npm install firebase-admin
```

## Step 2: Initialize Firebase Admin SDK

Initialize Firebase Admin SDK in your Node.js project. This is usually done in a separate file, like `firebaseAdmin.js`.

```javascript
// firebaseAdmin.js
const admin = require('firebase-admin');
const serviceAccount = require('path/to/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const messaging = admin.messaging();

module.exports = messaging;
```

## Step 3: Send a Notification

Create a script to send a notification using the Firebase Admin SDK.

```javascript
// sendNotification.js
const messaging = require('./firebaseAdmin');

const message = {
  notification: {
    title: 'Hello World',
    body: 'This is a Firebase Cloud Messaging notification'
  },
  token: 'RECIPIENT_DEVICE_FCM_TOKEN'
};

messaging.send(message)
  .then(response => {
    console.log('Successfully sent message:', response);
  })
  .catch(error => {
    console.error('Error sending message:', error);
  });
```

## Step 4: Run the Script

Run the script to send the notification:

```bash
node sendNotification.js
```

## Step 5: Configure Your Firebase Console

Make sure your Firebase project is correctly set up in the Firebase Console to handle Cloud Messaging.

## Step 6: Deploy and Test

Deploy your Node.js project and test sending notifications from the Firebase Console to ensure that messages are received correctly.
