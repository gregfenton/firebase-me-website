
# Firebase Cloud Messaging with React Native

## Step 1: Install Firebase and React Native Firebase

First, install the necessary dependencies:

```bash
npm install @react-native-firebase/app @react-native-firebase/messaging
```

## Step 2: Initialize Firebase in Your App

Initialize Firebase in your React Native app. This is usually done in a separate file, like `firebase.js`.

```javascript
// firebase.js
import messaging from '@react-native-firebase/messaging';

// Request user permission for notifications
messaging().requestPermission()
  .then(() => {
    console.log('Notification permission granted.');
    return messaging().getToken();
  })
  .then(token => {
    console.log('FCM Token:', token);
    // Send the token to your server or use it to send notifications
  })
  .catch(error => {
    console.error('Unable to get permission to notify.', error);
  });

// Handle incoming messages
messaging().onMessage(async remoteMessage => {
  console.log('A new FCM message arrived!', remoteMessage);
});
```

## Step 3: Configure Your Firebase Console

Make sure your Firebase project is correctly set up in the Firebase Console to handle Cloud Messaging.

## Step 4: Deploy and Test

Deploy your React Native app and test sending notifications from the Firebase Console to ensure that both foreground and background messages are received correctly.
