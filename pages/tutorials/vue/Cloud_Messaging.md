
# Firebase Cloud Messaging with Vue

## Step 1: Install Firebase in Your Vue App

First, make sure you have Firebase installed in your Vue project. If not, you can install it using npm:

```bash
npm install firebase
```

## Step 2: Initialize Firebase in Your App

Initialize Firebase in your Vue app with your Firebase project configuration. This is usually done in a separate file, like `firebase.js`.

```javascript
// firebase.js
import firebase from 'firebase/app';
import 'firebase/messaging';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

export { messaging };
```

## Step 3: Setup Service Worker for Firebase Messaging

Create a `firebase-messaging-sw.js` file in the public directory of your Vue project. This service worker will handle background messages.

```javascript
// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

firebase.initializeApp({
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
```

## Step 4: Request Permission to Show Notifications

In your main Vue component, request permission from the user to show notifications.

```javascript
// main.js
import Vue from 'vue';
import App from './App.vue';
import { messaging } from './firebase';

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
  created() {
    messaging.requestPermission()
      .then(() => {
        console.log('Notification permission granted.');
        return messaging.getToken();
      })
      .then((token) => {
        console.log('FCM Token:', token);
        // Send the token to your server or use it to send notifications
      })
      .catch((err) => {
        console.error('Unable to get permission to notify.', err);
      });

    messaging.onMessage((payload) => {
      console.log('Message received. ', payload);
      // Handle foreground messages here
    });
  }
}).$mount('#app');
```

## Step 5: Configure Your Firebase Console

Make sure your Firebase project is correctly set up in the Firebase Console to handle Cloud Messaging.

## Step 6: Deploy and Test

Deploy your Vue app and test sending notifications from the Firebase Console to ensure that both foreground and background messages are received correctly.
