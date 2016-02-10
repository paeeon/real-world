app.config(function($stateProvider) {
  $stateProvider.state('buildEvent', {
    url: '/game-builder/:gameId/event',
    templateUrl: 'js/gameBuilder/eventInfo/eventInfo.html',
    controller: 'buildEventCtrl',
    resolve: {
      characters: function(gameBuildFactory, $stateParams) {
        var gameId = $stateParams.gameId;
        return gameBuildFactory.getGameCharacters(gameId);
      }
    }
  });
});

app.controller('buildEventCtrl', function($scope, $stateParams, $state, characters, $q, gameBuildFactory) {

  var charsArr = characters.slice(0);
  $scope.events = [{
    targets: [],
    decision: {
      choices: []
    },
    targetsToInsertIntoArray: {
      dropzones: {
        "All characters": charsArr,
        "Characters that will be affected": []
      }
    }
  }];

  console.log($scope.events);

  var gameId = $stateParams.gameId;

  $scope.characters = characters;
  $scope.cloneLists = [];

  $scope.eventTypeDescription = "A Text event is just a message that a user receives. A Choice event is a message that also prompts the user to vote – users will receive a set of choices to pick one, and they'll be able to submit one choice.";

  // Add an effect for this event. Each effect will act as its own
  // "event" in the game
  $scope.addEffect = function() {
    var newCharsArr = characters.slice(0);
    $scope.events.push({
      targets: [],
      decision: {
        choices: []
      },
      targetsToInsertIntoArray: {
        dropzones: {
          "All characters": newCharsArr,
          "Characters that will be affected": []
        }
      }
    });
  };

  $scope.removeEffect = function(index) {
    if ($scope.events.length > 1) $scope.events.splice(index, 1);
  };

  // dynamically populate the character list for each added effect
  $scope.listCharacters = function(index) {
    $scope.cloneLists.push($scope.characters.slice(0))
    return $scope.cloneLists[index]
  };

  // add character to effect
  $scope.addCharacter = function(character, targets, targetGroup) {
    character = angular.fromJson(character);
    var index = _.findIndex(targetGroup, {
      name: character["name"]
    });
    targetGroup.splice(index, 1);
    targets.push(character);
  };

  $scope.removeChar = function(index, targets, sourceChars) {
    sourceChars.push(targets[index])
    targets.splice(index, 1);
  }

  // add a choice to a decision event
  $scope.addChoice = function(currentEvent) {
    console.log(currentEvent)
    currentEvent.decision.choices.push({
      choice: currentEvent.currentChoice
    })
    currentEvent.currentChoice = '';
  }

  $scope.removeChoice = function(index, currentEvent) {
    currentEvent.decision.choices.splice(index, 1)
  }

  //value toggles display of decision form
  $scope.isDecision = function(currentEvent) {
    if (currentEvent.type === "choice") return true;
    else return false;
  }

  $scope.submitEvents = function() {
    var cleanEvents = [];
    console.log("Getting here");
    $scope.events.forEach(function(currentEvent) {
      console.log("currentEvent in the forEach loop");
      console.log(currentEvent);
      var event = {};
      // place title on events
      event.title = currentEvent.title;
      event.type = currentEvent.type;
      event.currentChoice = currentEvent.currentChoice;
      if (currentEvent.decision) {
        event.decision = {};
        event.decision.question = currentEvent.decision.question;
        console.log("choices");
        console.log(currentEvent.decision.choices);
        event.decision.choices = currentEvent.decision.choices;
      }
      event.eventThatOccurred = currentEvent.eventThatOccurred;
      //reassign targets to be solely character IDs
      event.targets = currentEvent.targetsToInsertIntoArray.dropzones["Characters that will be affected"].map(function(char) {
        return char._id;
      });
      if (currentEvent.eventThatOccurred.indexOf("PLACEHOLDER") > -1) event.needsResolution = true;
      cleanEvents.push(event);
    });
    console.log("after the events forEach");
    console.log(cleanEvents);
    var eventPromises = cleanEvents.map(function(eventA) {
      return gameBuildFactory.createEvent(eventA);
    });
    // create events
    return $q.all(eventPromises)
      .then(function(resolvedEvents) {
        console.log(resolvedEvents)
          // use created events to push ids onto game.events
        var eventPush = resolvedEvents.map(function(eventA) {
          return gameBuildFactory.pushEventToGame(gameId, eventA._id);
        });
        return $q.all(eventPush);
      }).then(function(resolved) {
        $state.go('eventDragDrop', {
          gameId: gameId
        });
      }).then(null, console.log);
  };

});
