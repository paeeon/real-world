var Firebase = require('firebase');

var myFirebaseRef = new Firebase("https://character-test.firebaseio.com/");

gameId = "-K9hE8L_Y2NAxvi8x06R"
testEvent = {
	eventId: "56b280b7e8813e79132b5612",
	choice: "hi!",
	willTrigger: "56b280b7e8813e79132b55ee"
}

// myFirebaseRef.child('games').child(gameId).child('votes').child('56b280b7e8813e79132b55ef').push(testEvent);
// myFirebaseRef.child('games').child(gameId).child('votes').child('56b280b7e8813e79132b55ff').push(testEvent);
// myFirebaseRef.child('games').child(gameId).child('votes').child('56b280b7e8813e79132b560a').push(testEvent);
myFirebaseRef.child('games').child(gameId).child('votes').child('56b280b7e8813e79132b5612').push(testEvent);
// myFirebaseRef.child('games').child(gameId).child('votes').child('gff').push(testEvent);
// myFirebaseRef.child('games').child(gameId).child('votes').child('a').push(testEvent);
// myFirebaseRef.child('games').child(gameId).child('votes').child('c').push(testEvent);
// myFirebaseRef.child('games').child(gameId).child('votes').child('d').push(testEvent);
// myFirebaseRef.child('games').child(gameId).child('votes').child('f').push(testEvent);
// myFirebaseRef.child('games').child(gameId).child('votes').child('v').push(testEvent);
// myFirebaseRef.child('games').child(gameId).child('votes').child('bb').push(testEvent);
