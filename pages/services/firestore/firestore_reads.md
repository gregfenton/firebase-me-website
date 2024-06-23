
# Firestore Read Operations

This is an example of reading data from Firestore.

## Overview

Firestore is a flexible, scalable database for mobile, web, and server development from Firebase and Google Cloud Platform.

## Example Code

### Fetching a single document
{{crumb:Read single document}}
{{group:code}}
```js
// JavaScript
db.collection('users').doc('alovelace').get().then((doc) => {
    if (doc.exists) {
        console.log('Document data:', doc.data());
    } else {
        console.log('No such document!');
    }
}).catch((error) => {
    console.log('Error getting document:', error);
});
```
```node
// Node.js
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

const docRef = db.collection('users').doc('alovelace');

docRef.get().then((doc) => {
    if (doc.exists) {
        console.log('Document data:', doc.data());
    } else {
        console.log('No such document!');
    }
}).catch((error) => {
    console.log('Error getting document:', error);
});
```
```python
# Python
import firebase_admin
from firebase_admin import credentials, firestore

cred = credentials.Certificate('path/to/serviceAccountKey.json')
firebase_admin.initialize_app(cred)

db = firestore.client()

doc_ref = db.collection('users').document('alovelace')
doc = doc_ref.get()
if doc.exists:
    print(f'Document data: {doc.to_dict()}')
else:
    print('No such document!')
```
{{endgroup}}

### Fetching multiple documents

{{crumb:Read many documents}}
{{group:code}}
```js
// JavaScript
db.collection('users').get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`);
    });
});
```
```node
// Node.js
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

db.collection('users').get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`);
    });
});
```
```python
# Python
import firebase_admin
from firebase_admin import credentials, firestore

cred = credentials.Certificate('path/to/serviceAccountKey.json')
firebase_admin.initialize_app(cred)

db = firestore.client()

users_ref = db.collection('users')
docs = users_ref.stream()

for doc in docs:
    print(f'{doc.id} => {doc.to_dict()}')
```
{{endgroup}}

{{crumb:Warnings}}

> **Warning:** When using Firestore, be aware that querying on multiple fields with different operators can result in performance issues. Always ensure indexes are properly set up to optimize query execution times.

## Comments

Feel free to add comments to your code to make it more readable.
