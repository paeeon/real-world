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
      name: 'Mr. Perrywinkle',
      position: 'Host',
      background: 'An eccentric billionaire who enjoys hosting diverse dinner parties.',
      goals: [{
        description: 'Not be discovered as the murderer.',
        visibility: false
      }],
      abilities: [
        {
          description: 'Knows the layout of the house.',
          visibility: false
        }
      ],
      limitations: [
        {
          description: 'Speaks with a ridiculous accent.',
          visibility: false
        }
      ]
    }, {
      name: 'Ms. Marshall',
      position: 'A Young Journalist At The Party',
      background: 'Ms. Marshall was invited to the party by a friend of a friend. A very inquisitive young woman.',
      goals: [{
        description: 'Find out the murderer.',
        visibility: false
      }],
      abilities: [{
        description: 'Can see certain clues before others.',
        visibility: false
      }],
      limitations: [{
        description: 'Does not know anything about the other characters before the game.',
        visibility: false
      }]
    }, {
      name: 'Minkus Pinkus',
      position: 'Mr. Perrywinkle\'s Chef',
      background: 'A loyal servent to Mr. Perrywinkle who has known him for a long time.',
      goals: [{
        description: 'To help Mr. Perrywinkle no matter what.',
        visibility: true
      }],
      abilities: [{
        description: 'Knows Mr. Perrywinkle committed the crime',
        visibility: false
      }],
      limitations: [
        {
          description: 'Does not speak English.',
          visibility: false
        }
      ]
    }
  ];
  return Character.createAsync(characters);
};

var seedEvents = function() {
  var events = [
    {
      title: 'Welcome',
      triggeredBy: 'time',
      needsResolution: 'false',
      type: 'text',
      eventThatOccurred: 'Welcome to Mansion Murder Mystery.',
      targets: characterIds,
      timed: {
        cause: 'game',
        timeout: 0
      }
    }, {
      title: 'Body Discovered',
      triggeredBy: 'time',
      needsResolution: 'false',
      type: 'text',
      eventThatOccurred: 'The butler\'s body has been discovered in the pantry! Go to the pantry to investigate.',
      targets: characterIds,
      timed: {
        cause: 'game',
        timeout: 5000
      }
    }, {
      title: 'Mr. Perrywinkle Poll',
      triggeredBy: 'time',
      needsResolution: 'false',
      type: 'choice',
      eventThatOccurred: 'Polling Event –the polling event will ask each person what their favorite color is.',
      decision: {
        willResolveName: 'Mr. Perrywinkle Answer',
        question: 'Who do you think murdered the butler?',
        choices: [
          {
            choice: 'Mr. Perrywinkle'
          }, {
            choice: 'Ms. Marshall'
          }, {
            choice: 'Minkus Pinkus'
          }
        ]
      },
      targets: findCharacters(['Mr. Perrywinkle']),
      timed: {
        cause: 'game',
        timeout: 10000
      }
    }, {
      title: 'Ms. Marshall Poll',
      triggeredBy: 'time',
      type: 'choice',
      eventThatOccurred: 'Polling Event –the polling event will ask each person what their favorite color is.',
      decision: {
        willResolveName: 'Ms. Marshall Answer',
        question: 'Who do you think murdered the butler?',
        choices: [
          {
            choice: 'Mr. Perrywinkle'
          }, {
            choice: 'Ms. Marshall'
          }, {
            choice: 'Minkus Pinkus'
          }
        ]
      },
      targets: findCharacters(['Ms. Marshall']),
      timed: {
        cause: 'game',
        timeout: 10001
      }
    }, {
      title: 'Minkus Pinkus Poll',
      triggeredBy: 'time',
      type: 'choice',
      eventThatOccurred: 'Polling Event –the polling event will ask each person what their favorite color is.',
      decision: {
        willResolveName: 'Minkus Pinkus Answer',
        question: 'Who do you think murdered the butler?',
        choices: [
          {
            choice: 'Mr. Perrywinkle'
          }, {
            choice: 'Ms. Marshall'
          }, {
            choice: 'Minkus Pinkus'
          }
        ]
      },
      targets: findCharacters(['Minkus Pinkus']),
      timed: {
        cause: 'game',
        timeout: 10002
      }
    }, {
      title: 'Mr. Perrywinkle Answer',
      triggeredBy: 'time',
      needsResolution: 'true',
      type: 'text',
      eventThatOccurred: 'Mr. Perrywinkle thinks PLACEHOLDER killed the butler!',
      targets: characterIds,
      timed: {
        cause: 'game',
        timeout: 18000
      }
    }, {
      title: 'Ms. Marshall Answer',
      needsResolution: 'true',
      triggeredBy: 'time',
      type: 'text',
      eventThatOccurred: 'Ms. Marshall thinks PLACEHOLDER killed the butler',
      targets: characterIds,
      timed: {
        cause: 'game',
        timeout: 18001
      }
    }, {
      title: 'Minkus Pinkus Answer',
      needsResolution: 'true',
      triggeredBy: 'time',
      type: 'text',
      eventThatOccurred: 'Minkus Pinkus thinks PLACEHOLDER killed the butler',
      targets: characterIds,
      timed: {
        cause: 'game',
        timeout: 18002
      }
    }, {
      title: 'Murder Weapon Discovered',
      triggeredBy: 'time',
      needsResolution: 'false',
      type: 'text',
      eventThatOccurred: 'The murder weapon--a knife!--was found in the living room! Go to the living room to investigate.',
      targets: characterIds,
      timed: {
        cause: 'game',
        timeout: 24000
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
    title: 'Mansion Murder Mystery',
    characters: characterIds,
    events: eventIds,
    overview: "A Murder Mystery Game"
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
