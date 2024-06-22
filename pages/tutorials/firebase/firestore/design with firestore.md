Cloud Firestore is Google's massively scalable, serverless, NoSQL "document-store" database. Many people use Firestore as part of a Firebase project.

Firestore is really a system of storing Documents. A Document is a "set of key-value pairs", by which you can think of a "JSON Object" or a "Map":

{
  name: "Fred Flintstone",
  age: 42,
  favoriteFoods: [ "Bronto Burgers", "Dino Eggs" ],
  spouse: {
    name: "Wilma Flintstone",
    hairColor: "red"
  }
}
How to design the structure of your Firestore database (or any document-store database) is a mixture of science and art.

Consider your app's Details screens
One main rule of thumb is to put "all the data you need" for each of your app's "Details screens" into a document. If you go to the User Details screen, have the data you will show on that screen in the "User" document. Same for the Toolbox Details screen -- put all the data you need into a "Toolbox" document. You can decide if it makes sense to have a Tool Details screen and a separate collection of "Tools" documents, or if the data for each Tool is simple enough to just put that data into a field within the Toolbox document (e.g. a tools array field).

A Firestore document is limited to 1MB in size. That is sufficient to store the text of a 3-volume book set (think: all 3 books of Lord Of The Rings). You likely don't want to get too close to the 1MB limit for fear that some documents might over time grow to beyond that point (and then you have to restructure things). On the flip side, you don't want millions of documents containing just a couple of string or number values in them.

Unlearn SQL -- avoid JOINS
Another rule-of-thumb is to avoid doing "JOINS". Most document-store databases are not good dealing with "following references" -- doing so in Firestore involves multiple queries. Instead of "normalizing data" to individual documents, take advantage of "de-normalization" (i.e. data DUPLICATION) across multiple documents in support of the previous rule-of-thumb (i.e. "all the data you need in one document").

For example, I have a collection of "Players" where each document contains all the data that I show on the "Player Details" screen. I also have a collection of "Teams" where each document contains all the information that I show on the "Team Details" screen including SOME information about the players on the team. So in my Team document I have a players array that contains a DUPLICATION of the data in each of the Player documents. I do not simply reference the Player document IDs which would force me to make multiple READ calls to show the data on my "Team Details" screen.

Querying Arrays-of-Objects
One limitation of Firestore is the ability to query an array-of-objects. For example, in my Team documents I have a field named players that is an array of objects:

players: [
  { playerId: 1111, name: "Fred", email: "fred@test.com" },
  { playerId: 2222, name: "Barney", email: "barney@test.com" }
]
Firestore allows querying an array-of-objects, but only for exact matches of the object. If I want to find all Team documents that have Barney on them, I need to query:

query(
  collection(db, "Team"),
  where("players", "array-contains",
        '{ playerId: 2222, name: "Barney", email: "barney@test.com" }'
  )
)
Notice that I am required to specify all of the object values -- I cannot find all Team documents that have playerId == 2222.

To find all Team documents that have playerId. . . one approach is to add another array field to the Team documents that contains just the playerId values from the players array. There is a bit of overhead maintaining this array, but not having it means you can't do the search your app needs:

query(
  collection(db, "Team"),
  where("playerIds", "array-contains", 2222)
)
You might find yourself maintaining several arrays this way, for example playerIds and emails.

Collections and Subcollections
Firestore is a system for storing Documents. Each Document has a path that comprises a Document ID and a path prefix . That prefix is referred to as a Collection.

Note that Firestore only stores Documents . Collections (and subcollections) don't really exist, at least not as objects inside Firestore. A Collection is the set of Documents that have the same path prefix.

A path in Firestore comprises one or more segments. For example, /user/1111 is a path with 2 segments: the collection user and the document ID 1111.

Notes about Collections:

You do not create a Collection.

There is no API for creating a Collection.

Collections do not exist. Only their child Documents exist.

Only Documents exist in Firestore.

A Subcollection is a collection whose path has three or more segments: /user/1111/reviews is a subcollection named reviews .

Notes about Subcollections:

Same notes as Collections.

The "parent Document" (e.g. /user/1111) does not need to exist. Only their child Documents need to exist.

One last thing to note about Collections: in the Firestore API a CollectionReference is actually a type of Query. That is, Collections are a way of grouping Documents to enable and simplify fetching data from your database.

Choosing between Collections and Subcollections
Deciding whether to create a Document at a root Collection or as a Subcollection to some other Document really comes down to thinking about your application, the queries your "Details screens" are going to use, and any reports/analytics questions you are going to ask of your data.

Firestore supports massive scale. A Collection can hold billions of Documents. So choosing a Collection vs. a Subcollection is not a performance or scalability decision. It is more a question of your ability to query the data you need across the Documents.

Things to consider:

Queries needed for "List screens" -- preferably a single query() call

Queries needed for "Details screens" -- preferably a single Document fetch

Securing data -- see Firestore Security Rules & Firestore Security Rules Cookbook

Want to Go Deeper?
[This is not an endorsement; it is merely an observation]

I have not found a lot of online resources for learning Firestore. One resource that I have found useful is Fireship.io , the producers of the Rules Cookbook mentioned above.

I have not signed up for it yet, but I do see that they have an entire course on Firestore Data Modeling.