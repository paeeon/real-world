/*

This seed file is only a placeholder. It should be expanded and altered
to fit the development of your application.

It uses the same file the server uses to establish
the database connection:
--- server/db/index.js

The name of the database used is set in your environment files:
--- server/env/*

This seed file has a safety check to see if you already have users
in the database. If you are developing multiple applications with the
fsg scaffolding, keep in mind that fsg always uses the same database
name in the environment files.

*/

var mongoose = require('mongoose');
var Promise = require('bluebird');
var chalk = require('chalk');
var connectToDb = require('./server/db');
var User = Promise.promisifyAll(mongoose.model('User'));
var Event = Promise.promisifyAll(mongoose.model('Event'));
var Character = Promise.promisifyAll(mongoose.model('Character'));
var Game = Promise.promisifyAll(mongoose.model('Game'));
var Char = mongoose.model('Character');

var eventIds;
var characterIds;
var characterObj;

var seedCharacters = function() {
  var characters = [
    {
      name: 'Andrew',
      position: 'Inquisitive Fellow',
      background: 'An inquisitive fellow who loves colors and questions. He just wants to know more about both.',
      goals: [{
        description: 'Find out Lily\'s favorite color.',
        visibility: true
      }],
      abilities: [
        {
          description: 'Can ask multiple choice questions about colors',
          visibility: false
        }
      ],
      limitations: [
        {
          description: 'Cannot see Lily\'s response.',
          visibility: false
        }
      ]
    }, {
      name: 'Lily',
      position: 'A secretive color lover',
      background: 'If Lily shares her taste in colors, she dies. She really does not want that. By the way, her favorite color is blue.',
      goals: [{
        description: 'Not let Andrew know her favorite color.',
        visibility: false
      }],
      abilities: [{
        description: 'Can lie about her favorite color.',
        visibility: false
      }],
      limitations: [{
        description: 'Must lie consistently (she cannot change her lie once she has chosen a lie).',
        visibility: false
      }]
    }, {
      name: 'Mike',
      position: 'A Color Loving Bloke',
      background: 'Mike would never lie about colors. He would lie to help his friend Lily, though.',
      goals: [{
        description: 'To help Lily keep her secret.',
        visibility: true
      }],
      abilities: [{
        description: 'Knows Lily\'s favorite color.',
        visibility: false
      }],
      limitations: [
        {
          description: 'Cannot choose Lily\'s favorite color as his own.',
          visibility: false
        }
      ]
    }, {
      name: 'Nicole',
      position: 'A Color Loving Lass',
      background: 'Nicole would never lie about colors. She would lie to help her friend Lily, though.',
      goals: [{
        description: 'To help Lily keep her secret.',
        visibility: true
      }],
      abilities: [{
        description: 'Knows Lily\'s favorite color.',
        visibility: false
      }],
      limitations: [{
        description: 'Cannot choose Lily\'s favorite color as her own.',
        visibility: false
      }]
    }
  ];
  return Character.createAsync(characters);
};

var seedEvents = function() {
  var events = [
    {
      title: 'Welcome',
      triggeredBy: 'time',
      type: 'text',
      eventThatOccurred: 'Welcome to the Color Game! Let\'s begin.',
      targets: characterIds,
      timed: {
        cause: 'game',
        timeout: 0
      }
    }, {
      title: 'Lily Poll',
      triggeredBy: 'time',
      type: 'choice',
      eventThatOccurred: 'Polling Event –the polling event will ask each person what their favorite color is.',
      decision: {
        question: 'What is your favorite color?',
        choices: [
          {
            choice: 'Blue'
          }, {
            choice: 'Red'
          }, {
            choice: 'Orange'
          }, {
            choice: 'Brown'
          }, {
            choice: 'White'
          }
        ]
      },
      targets: findCharacters(['Lily']),
      timed: {
        cause: 'game',
        timeout: 10000
      }
    }, {
      title: 'Nicole Poll',
      triggeredBy: 'time',
      type: 'choice',
      eventThatOccurred: 'Polling Event –the polling event will ask each person what their favorite color is.',
      decision: {
        question: 'What is your favorite color?',
        choices: [
          {
            choice: 'Blue'
          }, {
            choice: 'Red'
          }, {
            choice: 'Orange'
          }, {
            choice: 'Brown'
          }, {
            choice: 'White'
          }
        ]
      },
      targets: findCharacters(['Nicole']),
      timed: {
        cause: 'game',
        timeout: 10001
      }
    }, {
      title: 'Mike Poll',
      triggeredBy: 'time',
      type: 'choice',
      eventThatOccurred: 'Polling Event –the polling event will ask each person what their favorite color is.',
      decision: {
        question: 'What is your favorite color?',
        choices: [
          {
            choice: 'Blue'
          }, {
            choice: 'Red'
          }, {
            choice: 'Orange'
          }, {
            choice: 'Brown'
          }, {
            choice: 'White'
          }
        ]
      },
      targets: findCharacters(['Mike']),
      timed: {
        cause: 'game',
        timeout: 10002
      }
    }, {
      title: 'Lily Answer',
      triggeredBy: 'time',
      type: 'text',
      eventThatOccurred: 'Lily\'s favorite color is: PLACEHOLDER !',
      targets: findCharacters(['Andrew']),
      timed: {
        cause: 'game',
        timeout: 21000
      }
    }, {
      title: 'Nicole Answer',
      triggeredBy: 'time',
      type: 'text',
      eventThatOccurred: 'Nicole\'s favorite color is: PLACEHOLDER !',
      targets: findCharacters(['Andrew']),
      timed: {
        cause: 'game',
        timeout: 21001
      }
    }, {
      title: 'Mike Answer',
      triggeredBy: 'time',
      type: 'text',
      eventThatOccurred: 'Mike\'s favorite color is: PLACEHOLDER !',
      targets: findCharacters(['Andrew']),
      timed: {
        cause: 'game',
        timeout: 21002
      }
    }, {
      title: 'Lily Poll #2',
      triggeredBy: 'time',
      type: 'choice',
      eventThatOccurred: 'Polling Event –the polling event will ask each person what their least favorite color is.',
      decision: {
        question: 'What is your least favorite color?',
        choices: [
          {
            choice: 'Blue'
          }, {
            choice: 'Red'
          }, {
            choice: 'Orange'
          }, {
            choice: 'Brown'
          }, {
            choice: 'White'
          }
        ]
      },
      targets: findCharacters(['Lily']),
      timed: {
        cause: 'game',
        timeout: 33001
      }
    }, {
      title: 'Nicole Poll #2',
      triggeredBy: 'time',
      type: 'choice',
      eventThatOccurred: 'Polling Event –the polling event will ask each person what their least favorite color is.',
      decision: {
        question: 'What is your least favorite color?',
        choices: [
          {
            choice: 'Blue'
          }, {
            choice: 'Red'
          }, {
            choice: 'Orange'
          }, {
            choice: 'Brown'
          }, {
            choice: 'White'
          }
        ]
      },
      targets: findCharacters(['Nicole']),
      timed: {
        cause: 'game',
        timeout: 33002
      }
    }, {
      title: 'Mike Poll #2',
      triggeredBy: 'time',
      type: 'choice',
      eventThatOccurred: 'Polling Event –the polling event will ask each person what their least favorite color is.',
      decision: {
        question: 'What is your least favorite color?',
        choices: [
          {
            choice: 'Blue'
          }, {
            choice: 'Red'
          }, {
            choice: 'Orange'
          }, {
            choice: 'Brown'
          }, {
            choice: 'White'
          }
        ]
      },
      targets: findCharacters(['Mike']),
      timed: {
        cause: 'game',
        timeout: 33003
      }
    }, {
      title: 'Mike Answer #2',
      triggeredBy: 'time',
      type: 'text',
      eventThatOccurred: 'Mike\'s least favorite color is: PLACEHOLDER !',
      targets: findCharacters(['Andrew']),
      timed: {
        cause: 'game',
        timeout: 45000
      }
    }, {
      title: 'Nicole Answer #2',
      triggeredBy: 'time',
      type: 'text',
      eventThatOccurred: 'Nicole\'s least favorite color is: PLACEHOLDER !',
      targets: findCharacters(['Andrew']),
      timed: {
        cause: 'game',
        timeout: 45001
      }
    }, {
      title: 'Lily Answer #2',
      triggeredBy: 'time',
      type: 'text',
      eventThatOccurred: 'Lily\'s least favorite color is: PLACEHOLDER !',
      targets: findCharacters(['Andrew']),
      timed: {
        cause: 'game',
        timeout: 45002
      }
    }, {
      title: "Andrew Guess",
      triggeredBy: 'time',
      type: 'text',
      eventThatOccurred: 'What is Lily\'s favorite color?',
      decision: {
        question: 'What is Lily\'s favorite color?',
        choices: [
          {
            choice: 'Blue'
          }, {
            choice: 'Red'
          }, {
            choice: 'Orange'
          }, {
            choice: 'Brown'
          }, {
            choice: 'White'
          }
        ]
      },
      targets: findCharacters(['Andrew']),
      timed: {
        cause: 'game',
        timeout: 50000
      }
    }, {
      title: "Andrew Guess to Everyone",
      triggeredBy: 'time',
      type: 'text',
      eventThatOccurred: 'Andrew thinks Lily\'s favorite color is: PLACEHOLDER',
      targets: characterIds,
      timed: {
        cause: 'game',
        timeout: 65000
      }
    }
  ];
  return Event.createAsync(events);
};
function findCharacters(characters) {
  var charIds = [];
  characters.forEach(function(character) {
      characterObj.forEach(function(char) {
        if (char.name === character) {
          charIds.push(char.id);
        }
      });
  });
  return charIds;
}

var seedGame = function() {
  var game = {
    title: 'Color Game!',
    characters: characterIds,
    events: eventIds,
    overview: "A Three Person Color Game"
  };
  return Game.createAsync(game);
};

var seedUsers = function () {

    var users = [
        {
            email: 'testing@fsa.com',
            password: 'password'
        },
        {
            email: 'obama@gmail.com',
            password: 'potus'
        }
    ];

    return User.createAsync(users);

};

connectToDb.then(function () {
    seedUsers()
      .then(function(createdUsers){
        return seedCharacters();
      }).then(function(createdCharacters) {
        characterObj = createdCharacters.map(function(char) {
          return {id: char._id, name: char.name};
        });
        characterIds = createdCharacters.map(function(char) {
          return char._id;
        });
        // console.log('character ids: ', characterIds);
        return seedEvents();
      }).then(function(createdEvents) {
        eventIds = createdEvents.map(function(event) {
          return event._id;
        });
        // console.log('events ids: ', eventIds);
        return seedGame();
      }).then(function(createdgame) {
        console.log(createdgame)
        console.log(chalk.green('Seed successful!'));
        process.kill(0);
    }).catch(function (err) {
        console.error(err);
        process.kill(1);
    });
});
