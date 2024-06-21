
# Firestore Read Path

This is an example of reading data from Firestore.

## Overview

Firestore is a flexible, scalable database for mobile, web, and server development from Firebase and Google Cloud Platform.

## Example Code

{{group:code}}
```js
// Read data from a collection
db.collection('users').get()
    .then((snapshot) => {
        if (snapshot.empty) {
            console.log('No matching documents.');
            return;
        }
        snapshot.forEach((doc) => {
            console.log(doc.id, '=>', doc.data());
        });
    })
    .catch((err) => {
        console.error('Error getting documents', err);
    });
```
```node
// Node.js code example
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

db.collection('users').get()
    .then((snapshot) => {
        if (snapshot.empty) {
            console.log('No matching documents.');
            return;
        }
        snapshot.forEach((doc) => {
            console.log(doc.id, '=>', doc.data());
        });
    })
    .catch((err) => {
        console.error('Error getting documents', err);
    });
```
```python
# Python code example
import firebase_admin
from firebase_admin import credentials, firestore

cred = credentials.Certificate('path/to/serviceAccountKey.json')
firebase_admin.initialize_app(cred)

db = firestore.client()

users_ref = db.collection(u'users')
docs = users_ref.stream()

for doc in docs:
    print(f'{doc.id} => {doc.to_dict()}')
```
{{endgroup}}

> **Warning:** When using Firestore, be aware that querying on multiple fields with different operators can result in performance issues. Always ensure indexes are properly set up to optimize query execution times.

> **Note:** Firestore provides powerful functions to work with your data.

### Comments

Feel free to add comments to your code to make it more readable.
