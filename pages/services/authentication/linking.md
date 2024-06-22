
# Firestore Write Operations

This is an example of writing data to Firestore.

## Overview

Firestore is a flexible, scalable database for mobile, web, and server development from Firebase and Google Cloud Platform.

## Example Code

### Adding a new document

{{anchor:Write single document}}
{{group:code}}
```js
// JavaScript
db.collection('users').add({
    first: 'Ada',
    last: 'Lovelace',
    born: 1815
}).then((docRef) => {
    console.log('Document written with ID: ', docRef.id);
}).catch((error) => {
    console.error('Error adding document: ', error);
});
```
```node
// Node.js
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

const docRef = db.collection('users').doc();

docRef.set({
    first: 'Ada',
    last: 'Lovelace',
    born: 1815
}).then(() => {
    console.log('Document successfully written!');
}).catch((error) => {
    console.error('Error writing document: ', error);
});
```
```python
# Python
import firebase_admin
from firebase_admin import credentials, firestore

cred = credentials.Certificate('path/to/serviceAccountKey.json')
firebase_admin.initialize_app(cred)

db = firestore.client()

doc_ref = db.collection('users').document()

doc_ref.set({
    'first': 'Ada',
    'last': 'Lovelace',
    'born': 1815
})
print('Document successfully written!')
```
{{endgroup}}

### Updating an existing document

{{anchor:Updating many documents}}
{{group:code}}
```js
// JavaScript
const userRef = db.collection('users').doc('alovelace');

userRef.update({
    born: 1815
}).then(() => {
    console.log('Document successfully updated!');
}).catch((error) => {
    console.error('Error updating document:', error);
});
```
```node
// Node.js
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

const docRef = db.collection('users').doc('alovelace');

docRef.update({
    born: 1815
}).then(() => {
    console.log('Document successfully updated!');
}).catch((error) => {
    console.error('Error updating document:', error);
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

doc_ref.update({
    'born': 1815
})
print('Document successfully updated!')
```
{{endgroup}}

> **Warning:** When updating documents in Firestore, be aware that large numbers of writes in a short period of time can lead to performance issues. Always ensure your updates are batched or throttled as necessary.

## Comments

Feel free to add comments to your code to make it more readable.
