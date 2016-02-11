// Cycles through all characters and resolves their goals
function resolveAllCharacters(gameId){
	var gameRef = new Firebase("https://character-test.firebaseio.com/games/" + gameId);
	var charactersRef = gameRef.child('characters');
	// grabs a snapshot of characters from firebase
	charactersRef.once('value',function(charsSnapshot){
		//uses the firebase forEach to cycle through the snapshot
		charsSnapshot.forEach(function(charSnap){
			var character = charSnap.val();
			//sets the characters equal to the snapshot and calls on helper function
			//to resolve that characters goals
			resolveCharacterGoals(character, gameId);
		})
	})
}
// Resolves a single characters goals and gives characters a message on each goals success or failure
function resolveCharacterGoals(character, gameId){
// Object for success or failure message keyed to a characters success or failure Boolean
	var goalEval = {
		true : "succeeded!",
		false : "failed."
	}
	var gameRef = new Firebase("https://character-test.firebaseio.com/games/" + gameId);
	var charRef =	gameRef.child(characters).child(character._id.toString())
	//cycles through all goals on the character
	character.goals.forEach(function(goal, index){
		if (goal.type === 'event'){
			// grabs a value from the resolve table to check against acceptable 
			// strings for goal success
			gameRef.child('resolveTable').child(goal.resolvedBy.toString())
			.once('value', function(dataSnapshot){
				//assigns answer to the snapshot from the resolve table
				var answer = dataSnapshot.val();
				var status = false;
				// if answer is acceptable change status to true;
				if (goal.acceptedValues.indexOf(answer) > -1) status = true;
				// update the goal to it's appropriate resolution status
				var goalRef = charRef.child(goals).child(index).update({resolved:status})
				.then(function(goalSnap){
					var goal = goalSnap.val();
					//send message to character based that goals success or failure
					character.messages.push({message: "The Goal: " + goal.description 
						+ " has " + goalEval[goal.resolved]})
				})
			})
		}
	})
}

module.exports = resolveCharacterGoals;