
# Firebase Cloud Messaging with Flutter

## Step 1: Add Firebase to Your Flutter Project

First, add the necessary Firebase dependencies to your `pubspec.yaml` file:

```yaml
dependencies:
  firebase_core: latest_version
  firebase_messaging: latest_version
```

Then, run `flutter pub get` to install these dependencies.

## Step 2: Initialize Firebase in Your App

Initialize Firebase in your Flutter app. This is usually done in the `main.dart` file.

```dart
// main.dart
import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';

Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  await Firebase.initializeApp();
  print("Handling a background message: ${message.messageId}");
}

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);

  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(title: Text('Firebase Cloud Messaging with Flutter')),
        body: Center(child: Text('Flutter Firebase Messaging')),
      ),
    );
  }
}
```

## Step 3: Request Permission to Show Notifications

In your main Flutter widget, request permission from the user to show notifications.

```dart
// main.dart (continued)
class MyApp extends StatefulWidget {
  @override
  _MyAppState createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  @override
  void initState() {
    super.initState();

    FirebaseMessaging.instance.requestPermission(
      alert: true,
      announcement: false,
      badge: true,
      carPlay: false,
      criticalAlert: false,
      provisional: false,
      sound: true,
    );

    FirebaseMessaging.instance.getToken().then((String? token) {
      assert(token != null);
      print("FCM Token: $token");
      // Send the token to your server or use it to send notifications
    });

    FirebaseMessaging.onMessage.listen((RemoteMessage message) {
      print('Got a message whilst in the foreground!');
      print('Message data: ${message.data}');

      if (message.notification != null) {
        print('Message also contained a notification: ${message.notification}');
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(title: Text('Firebase Cloud Messaging with Flutter')),
        body: Center(child: Text('Flutter Firebase Messaging')),
      ),
    );
  }
}
```

## Step 4: Configure Your Firebase Console

Make sure your Firebase project is correctly set up in the Firebase Console to handle Cloud Messaging.

## Step 5: Deploy and Test

Deploy your Flutter app and test sending notifications from the Firebase Console to ensure that both foreground and background messages are received correctly.
