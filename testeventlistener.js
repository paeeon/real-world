var Firebase = require('firebase');

var myFirebaseRef = new Firebase("https://flickering-inferno-4436.firebaseio.com/");

gameId = "K9cpfp9AxxsXHgEgFl_"
testEvent = {
	eventId: "56b0eb7784cfdcefcb8a75d4",
	choice: "hi!",
	willTrigger: "56b0eb7784cfdcefcb8a75d3"
}
console.log(myFirebaseRef.child(gameId))
myFirebaseRef.child(gameId).child('votes').child('56b0eb7784cfdcefcb8a75d4').push(testEvent);
myFirebaseRef.child(gameId).child('votes').child('56b0eb7784cfdcefcb8a75d4').push(testEvent);
myFirebaseRef.child(gameId).child('votes').child('56b0eb7784cfdcefcb8a75d4').push(testEvent);
myFirebaseRef.child(gameId).child('votes').child('56b0eb7784cfdcefcb8a75d4').push(testEvent);
myFirebaseRef.child(gameId).child('votes').child('56b0eb7784cfdcefcb8a75d4').push(testEvent);
myFirebaseRef.child(gameId).child('votes').child('56b0eb7784cfdcefcb8a75d4').push(testEvent);
myFirebaseRef.child(gameId).child('votes').child('56b0eb7784cfdcefcb8a75d4').push(testEvent);
myFirebaseRef.child(gameId).child('votes').child('56b0eb7784cfdcefcb8a75d4').push(testEvent);
myFirebaseRef.child(gameId).child('votes').child('56b0eb7784cfdcefcb8a75d4').push(testEvent);
myFirebaseRef.child(gameId).child('votes').child('56b0eb7784cfdcefcb8a75d4').push(testEvent);
myFirebaseRef.child(gameId).child('votes').child('56b0eb7784cfdcefcb8a75d4').push(testEvent);
