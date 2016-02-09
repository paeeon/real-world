app.factory('gameBuildFactory', function($http) {
  return {
    createGame: function(gameToCreate) {
      return $http.post('/api/gameBuilder/gameInfo', gameToCreate)
      .then(function(res){ return res.data});
    },
    createCharacter: function(characterToCreate) {
      return $http.post('/api/gameBuilder/characterInfo', characterToCreate)
      .then(function(res){ return res.data});

    },
    createEvent: function(eventToCreate) {
      return $http.post('/api/gameBuilder/eventInfo', eventToCreate)
      .then(function(res){ return res.data});

    },
    pushCharacterToGame: function(gameId, characterId) {
      return $http.put('/api/gameBuilder/gameInfo/' + gameId + '/characters',
        { _id: characterId })
      .then(function(res){ return res.data});
      ;
    },
    pushEventToGame: function(gameId, eventId) {
      return $http.put('/api/gameBuilder/gameInfo/' + gameId + '/events',
        { _id: eventId })
      .then(function(res){ return res.data});
      ;
    },
    getGameCharacters: function(gameId) {
      return $http.get('/api/gameBuilder/' + gameId + '/characters')
      .then(function(res){ return res.data});
    },
    getGameEvents: function(gameId) {
      return $http.get('/api/gameBuilder/' + gameId + '/events')
      .then(function(res){ return res.data});
    },
    updateEvent: function(eventToUpdate) {
      console.log(eventToUpdate);
      return $http.put('/api/gameBuilder/'+ eventToUpdate._id, eventToUpdate)
      .then(function(res) {
        return res.data;
      });
    },
    nestedList: function(theEvent) {
        var oneEvent = theEvent;
        if (oneEvent.type === 'choice') {
          oneEvent.columns = [oneEvent.decision.choices];
          oneEvent.columns[0].map(function(oneChoice) {
            var choice = oneChoice;
            choice.title = choice.choice;
            choice.type = 'text';
            choice.columns = [[]];
            return choice;
          });
        } if (oneEvent.type === 'text') {
          oneEvent.columns = [[]];
        }
        return oneEvent;
    },
    saveNestedEvents: function(events) {
      var gameBuildFactory = this;
      // console.log($scope.models.dropzones.A);
      return events.map(function(eventNest) {
        // check to see if the event has any events in columns
        // if it doesnt update event
        if (!eventNest.columns[0][0]) {
          console.log('updating ', eventNest._id);
          if (!eventNest.triggeredBy) {
            eventNest.triggeredBy = 'time';
          }
          return gameBuildFactory.updateEvent(eventNest);
        }
        else {
          // if the event is a text event
          // save the inner event to the willTrigger of that event
          if (eventNest.type === 'text') {
            console.log('text event with willTrigger');
            eventNest.willTrigger = eventNest.columns[0][0]._id;
            eventNest.columns[0][0].triggeredBy = 'event';
            gameBuildFactory.saveNestedEvents(eventNest.columns[0]);
          }
          // if the event is a choice event
          else if (eventNest.type === 'choice') {
            console.log('choice event with choices that willTrigger');
            // loop through the columns
            // (for choice events columns are the choices)
            eventNest.columns[0].forEach(function(choice, i) {
              // if any of the choices triggers an event
              // console.log(choice.columns[0][0])
              if (choice.columns[0][0]) {
                eventNest.decision.choices[i].willTrigger = choice.columns[0][0]._id;
                choice.columns[0][0].triggeredBy = 'event';
                gameBuildFactory.saveNestedEvents(choice.columns[0]);
              }
            });
          }
          return gameBuildFactory.updateEvent(eventNest);
        }
      });
    }
  };
});
