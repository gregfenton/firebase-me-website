
# Firebase Cloud Messaging with Python

## Step 1: Install Firebase Admin SDK

First, install the Firebase Admin SDK using pip:

```bash
pip install firebase-admin
```

## Step 2: Initialize Firebase Admin SDK

Initialize Firebase Admin SDK in your Python project. This is usually done in a separate file, like `firebase_admin.py`.

```python
# firebase_admin.py
import firebase_admin
from firebase_admin import credentials, messaging

cred = credentials.Certificate('path/to/serviceAccountKey.json')
firebase_admin.initialize_app(cred)
```

## Step 3: Send a Notification

Create a script to send a notification using the Firebase Admin SDK.

```python
# send_notification.py
from firebase_admin import messaging
from firebase_admin import initialize_app

initialize_app()

message = messaging.Message(
    notification=messaging.Notification(
        title='Hello World',
        body='This is a Firebase Cloud Messaging notification',
    ),
    token='RECIPIENT_DEVICE_FCM_TOKEN',
)

response = messaging.send(message)
print('Successfully sent message:', response)
```

## Step 4: Run the Script

Run the script to send the notification:

```bash
python send_notification.py
```

## Step 5: Configure Your Firebase Console

Make sure your Firebase project is correctly set up in the Firebase Console to handle Cloud Messaging.

## Step 6: Deploy and Test

Deploy your Python project and test sending notifications from the Firebase Console to ensure that messages are received correctly.
