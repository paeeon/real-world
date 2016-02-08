var Firebase = require('firebase');
var gameId = "-K9jUx1NsqtwKKsYbJFy";
var allCharRef = new Firebase("https://character-test.firebaseio.com/games/" + gameId + "/characters");

allCharRef.once('value', function (dataSnapshot) {
	dataSnapshot.forEach(function(character){
		console.log(character.val())
		character.ref().update({playerReady : true})
	})
})