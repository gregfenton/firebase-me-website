I hang around Firebase Developers and Expo Developers a fair amount.

There are no Collections
Frequently people post questions such as:

"how do I create a subcollection"

"i wanna create another collection (say 'books' or 'movies')"

and they are stumped trying to find the right code to do it.

I empathize with the confusion. Navigating the Firebase documentation has a pretty steep learning curve ("did I see that in Overview? or Fundamentals? or Build? or Reference? or ...?" )

Firestore is a serverless, NoSQL, document-store database.

In Firestore, a Document is data organized as a set of name-value pairs, sometimes referred to as "a JSON object":

{
   "name": "Fred Flintstone",
   "age": 45,
   "favouriteFoods": [
      "Bronto Burger",
      "Dino Eggs",
      "Gravelberry Pie"
    ]
}

BUT -- the thing to understand (grok) about Firestore is that it only contains Documents.

Though the documentation and the APIs offer the concept of a "Collection", it is a lie.

Don't let the fact that the Firebase Console "shows Collections" fool you -- that is simply a UI trick. Notice how when you go to make a new Document the UI label is Add Document, but when you do the same for a Collection the UI label is Start Collection ? The UI prompts you for the name of the Collection but then takes you right to adding a Document. And if you don't add the Document...no Collection will show in the UI.

This is because Firestore only contains Documents.

Documents
A Document in Firestore has 2 key meta properties: id and path 
A Document with a path of /users/123456 has the id of 123456 
To get a DocumentReference to this document, you would use the API:

let myApp = initializeApp(firebaseConfig);
let myFS = getFirestore(myApp);
. . . . . .
let docRef = doc(myFS, '/users/123456');
(You will typically initialize the app (myApp) and get the Firestore service instance (myFS) at your app's startup and then use those values throughout the app's lifecycle -- I show one pattern of doing this in this starter React project that uses the Context API with FirebaseProvider.js andAuthProvider.js).

To fetch the data from the above DocumentReference you would use the code:

let docSnap = await getDoc(docRef);
let theData = docSnap.data();
(For simplicity here, I'm skipping using try/catch and doing error checking; please don't skip this in your code!)

Note: the call to getDoc() is when your app actually contacts the Firestore service in the cloud (or the Emulator Suite). The API calls of doc() and docSnap.data() do not interact with the Firestore service -- this fact eludes many people and is important for developers in understanding how this system works. For example, you can create a DocumentReference to a path that does not exist: doc(myFS, "this is a jumbled mess") and you won't know that it fails to exist until you go to interact with it, such as calling getDoc() and getting back an empty snapshot.

Collections
A Collection is actually just "the group of Documents whose path values have the same prefix". For example, all of the Documents whose path begins with "/users" are said to be "in the collection of /users".

To get "all of the Documents in the users collection" you would use the code:

let collRef = collection(myFS, "users");
let querySnap = await getDocs(collRef);
if (querySnap.empty) {
 console.warn("No documents found!");
 return;
}
let theData = querySnap.docs.map( docSnap => docSnap.data() );
(There are other approaches people take to getting the documents from a querySnapshot, such as also storing the document's ID with the data, but for now the above will suffice).

Notice that what the above code is doing is fetching Documents. You can also build a Query object by adding where(), orderBy() , limit() and other operators to alter the set of Documents you get back from Firestore.

Note: the call to getDocs() is when your app actually contacts the Firestore service in the cloud (or Firebase Emulator Suite). The other API calls above do not contact Firestore.

Subcollections
Extrapolate the above to the question of "what is a subcollection?"

There are no subcollections in Firestore....or at least, there is no object in Firestore for the Subcollection.

A subcollection in Firestore are all of the Documents whose path has the same prefix, and that prefix has more than one "segment". So, for example, if your Firestore Documents are organized like:

blogPosts                   << (lvl 1) collection
 -- 111                     << (lvl 2) doc
    -- commentsForPost      << (lvl 3) (sub)collection
       -- aaa               << (lvl 4) doc
 -- 222                     << (lvl 2) doc
    -- commentsForPost      << (lvl 3) (sub)collection
       -- bbb               << (lvl 4) doc
       -- ccc               << (lvl 4) doc 

Odd levels are collections.
Even levels are documents. 
then we say that your Firestore database has 5 Documents (111, 222, aaa, bbb, ccc) that are in 3 "collections" (1 root collection and 2 subcollections):

blogPosts

blogPosts/111/commentsForPost

blogPosts/222/commentsForPost

References -- Fancy Strings
When creating a DocumentReference, the number of segments (the path separator is "/") must be even. When creating a CollectionReference, the number of segments must be odd.

We often see people writing code such as:

doc(collection(doc(collection(myFS, "blogPosts"), "111"), "commentsForPost"), "aaa")

(or in the older v8 syntax it would have been: myFS.collection("blogPosts).doc("111").collection("commentsForPost").doc("aaa") )

Notice that this code simply creates a DocumentReference. You can simplify this code to: doc(myFS, "blogPosts/111/commentsForPost/aaa")

Again, the API here does not actually contact the Firestore service. You are simply creating a "reference" -- a fancy way of encapsulating that string value so that you can use it with other parts of the Firestore API such as when calling getDoc() , addDoc() , setDoc() , updateDoc() , or deleteDoc() .