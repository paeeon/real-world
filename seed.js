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

var seedCharacters = function() {
  var characters = [
    {
      name: 'Andrew',
      position: 'Employer',
      background: 'The hiring manager at SoftCorp, a new start-up trying to break into the B2B sales management space.',
      goals: [{
        description: 'Hire the best employee (and only one employee)',
        visibility: true
      }],
      abilities: [
        {
          description: 'Can Say “Yes” to Hiring Someone (Once)',
          visibility: false
        },
        {
          description: 'Can Ask the Following Questions:\nWhat did you do before the bootcamp?\nWhat is the coolest thing you have built?\nWhat is a weakness of yours?',
          visibility: false
        }
      ],
      limitations: [
        {
          description: 'Has no way to actually verify the Fullstack students’ claims.',
          visibility: false
        },
        {
          description: 'Cannot entirely trust Mr. Dog.',
          visibility: false
        }
      ]
    }, {
      name: 'Mr. Dog',
      position: 'Employers Second in Command',
      background: 'Andrew’s assistant. Mr. Dog is new to SoftCorp and still in the process of establishing himself as a trustworthy resource when it comes to hiring.',
      goals: [{
        description: 'Make Andrew Choose his recommendation',
        visibility: false
      }],
      abilities: [{
        description: 'Knows the actual abilities and backgrounds of each candidate',
        visibility: false
      }],
      limitations: [{
        description: 'Cannot explicitly say which candidate to hire—can only narrow it down to three choices.',
        visibility: false
      }]
    }, {
      name: 'Mike',
      position: 'Fullstack Student',
      background: 'Mike is a career switcher, with no previous coding experience. He has learned quickly, though, and is very eager about the industry.',
      goals: [{
        description: 'To get a job.',
        visibility: true
      }],
      abilities: [{
        description: 'Can discuss the breadth of his knowledge',
        visibility: false
      }],
      limitations: [
        {
          description: 'Cannot speak deeply about any technology.',
          visibility: false
        },
        {
          description: 'Must answer Andrew’s questions truthfully.',
          visibility: false
        }
      ]
    }, {
      name: 'Nicole',
      position: 'Fullstack Student',
      background: 'Nicole has some computer science background—took one or two classes in college, many years ago—and has worked at start ups in non-technical roles since college. Through her exposure to this space, she has met many hiring managers and knows generally what they will be looking for. She suffers from imposter syndrome, though, and still cannot believe that she is actually a developer.',
      goals: [{
        description: 'To get a job.',
        visibility: true
      }],
      abilities: [{
        description: 'Has knowledge of two of Andrew’s three questions.',
        visibility: false
      }],
      limitations: [{
        description: 'Uses “um” a lot.',
        visibility: false
      }]
    }, {
        name: 'Lily',
        position: 'Fullstack Student',
        background: 'Lily has extensive technology experience before coming to Fullstack. She majored in computer science in college and has worked as a developer since then. She is at Fullstack so that she can learn a new language (Javascript) and network. Due to her skill and connections, she has already landed a job, but has kept that fact hidden so she can practice networking, which she is often quite bad at due to her inability to pick up on social cues.',
        goals: [{
          description: 'Make people like her.',
          visibility: false
        }],
        abilities: [{
          description: 'Ability to talk deeply on most technical topics',
          visibility: false
        }],
        limitations: [
          {
            description: 'Cannot be hired',
            visibility: false
          },
          {
            description: 'A bad listener',
            visibility: false
          },
          {
            description: 'Low empathy and social skill',
            visibility: false
          }
        ]
    }, {
      name: 'Joe',
      position: 'Fullstack Instructor',
      background: 'Joe is an instructor at Fullstack. He is interested in running a successful hiring day, which includes triggering game-master events and, ultimately, getting someone hired.',
      goals: [{
        description: 'Run a successful Hiring Day.',
        visibility: true
      }],
      abilities: [{
        description: 'Ability to trigger game-master events.',
        visibility: false
      }],
      limitations: [{
        description: 'Cannot participate in the simulation outside of his pre-scripted tasks.',
        visibility: false
      }]
    }, {
      name: 'Student4',
      position: 'Fullstack Student',
      description: 'Generic Fullstack student(s). Filler for the scene to add more realism and complexity to the simulation.',
      goals: [{
        description: 'Get hired.',
        visibility: true
      }],
      abilities: [{
        description: 'Can do whatever they want.',
        visibility: false
      }],
      limitations: [
        {
          description: 'Cannot vote for themselves for the presentations',
          visibility: false
        },
        {
          description: 'Does not know who anyone’s role is except Andrew and Mr. Dog.',
          visibility: false
        }
      ]
    }, {
      name: 'Student5',
      position: 'Fullstack Student',
      description: 'Generic Fullstack student(s). Filler for the scene to add more realism and complexity to the simulation.',
      goals: [{
        description: 'Get hired.',
        visibility: true
      }],
      abilities: [{
        description: 'Can do whatever they want.',
        visibility: false
      }],
      limitations: [
        {
          description: 'Cannot vote for themselves for the presentations',
          visibility: false
        },
        {
          description: 'Does not know who anyone’s role is except Andrew and Mr. Dog.',
          visibility: false
        }
      ]
    }, {
      name: 'Student6',
      position: 'Fullstack Student',
      description: 'Generic Fullstack student(s). Filler for the scene to add more realism and complexity to the simulation.',
      goals: [{
        description: 'Get hired.',
        visibility: true
      }],
      abilities: [{
        description: 'Can do whatever they want.',
        visibility: false
      }],
      limitations: [
        {
          description: 'Cannot vote for themselves for the presentations',
          visibility: false
        },
        {
          description: 'Does not know who anyone’s role is except Andrew and Mr. Dog.',
          visibility: false
        }
      ]
    }, {
      name: 'Student7',
      position: 'Fullstack Student',
      description: 'Generic Fullstack student(s). Filler for the scene to add more realism and complexity to the simulation.',
      goals: [{
        description: 'Get hired.',
        visibility: true
      }],
      abilities: [{
        description: 'Can do whatever they want.',
        visibility: false
      }],
      limitations: [
        {
          description: 'Cannot vote for themselves for the presentations',
          visibility: false
        },
        {
          description: 'Does not know who anyone’s role is except Andrew and Mr. Dog.',
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
      triggeredBy: 'time',
      type: 'text',
      eventThatOccurred: 'Introduce the event, Andrew, and Mr. Dog, and let everyone know that they will be voting on the three people who will be speaking at hiring day, so they should choose wisely! Let the networking begin!',
      targets: findCharacters(['Joe']),
      timed: {
        cause: 'game',
        timeout: 0
      }
    }, {
      triggeredBy: 'time',
      type: 'choice',
      eventThatOccurred: 'Polling Event –the polling event will put the list of Fullstack students’ names into a poll and allow every user to vote, with Andrew’s vote counting for 3, Mr. Dog’s counting for 2, and everyone else’s counting for 1.',
      decision: {
        question: 'Who would you like to present first?',
        choices: ['Lily', 'Mike', 'Nicole', 'Student4', 'Student5', 'Student6', 'Student7']
      },
      targets: characterIds,
      timed: {
        cause: 'game',
        timeout: 900
      }
    }, {
      triggeredBy: 'time',
      type: 'text',
      eventThatOccurred: 'These are the three winners: 1) Nicole, 2) Mike, 3) Lily',
      targets: findCharacters(['Joe']),
      timed: {
        cause: 'game',
        timeout: 1020
      }
    }, {
      triggeredBy: 'time',
      type: 'text',
      eventThatOccurred: 'You are presenting! Go to the computer and load up your presentation. You will be presenting in the following order: 1) Nicole, 2) Mike, 3) Lily',
      targets: findCharacters(['Nicole', 'Lily', 'Mike']),
      timed: {
        cause: 'game',
        timeout: 1020
      }
    }, {
      triggeredBy: 'time',
      type: 'text',
      eventThatOccurred: 'You are presenting! Go present!',
      targets: findCharacters(['Nicole']),
      timed: {
        cause: 'game',
        timeout: 1200
      }
    }, {
      triggeredBy: 'time',
      type: 'text',
      eventThatOccurred: 'First up, Nicole!',
      targets: findCharacters(['Joe']),
      timed: {
        cause: 'game',
        timeout: 1200
      }
    }, {
      triggeredBy: 'time',
      type: 'text',
      eventThatOccurred: 'You are presenting! Go present!',
      targets: findCharacters(['Lily']),
      timed: {
        cause: 'game',
        timeout: 1500
      }
    }, {
      triggeredBy: 'time',
      type: 'text',
      eventThatOccurred: 'Thank you for the presentation! Up next, Lily!',
      targets: findCharacters(['Joe']),
      timed: {
        cause: 'game',
        timeout: 1500
      }
    }, {
      triggeredBy: 'time',
      type: 'text',
      eventThatOccurred: 'You are presenting! Go present!',
      targets: findCharacters(['Mike']),
      timed: {
        cause: 'game',
        timeout: 1800
      }
    }, {
      triggeredBy: 'time',
      type: 'text',
      eventThatOccurred: 'Thank you for the presentation! Up next, Mike!',
      targets: findCharacters(['Joe']),
      timed: {
        cause: 'game',
        timeout: 1800
      }
    }, {
      triggeredBy: 'time',
      type: 'choice',
      decision: {
        question: 'Who did you think did the best presentation?',
        choices: ['Lily', 'Mike', 'Nicole', 'Student4', 'Student5', 'Student6', 'Student7']
      },
      targets: characterIds,
      timed: {
        cause: 'game',
        timeout: 2100
      }
    }, {
      triggeredBy: 'time',
      type: 'text',
      eventThatOccurred: 'The Best Presentation Award goes to: Lily!',
      targets: characterIds,
      timed: {
        cause: 'game',
        timeout: 2220
      }
    }, {
      triggeredBy: 'time',
      type: 'text',
      eventThatOccurred: 'Announce to everyone: Great! Now, everyone, this will be the networking portion of our day. Go out and mingle!',
      targets: findCharacters(['Joe']),
      timed: {
        cause: 'game',
        timeout: 2250
      }
    }, {
      triggeredBy: 'time',
      type: 'text',
      eventThatOccurred: 'Networking time is up. Andrew and Mr. Dog, go and meet in private to discuss your hiring decision.',
      targets: findCharacters(['Andrew', 'Mr. Dog']),
      timed: {
        cause: 'game',
        timeout: 3000
      }
    }, {
      triggeredBy: 'time',
      type: 'choice',
      decision: {
        question: 'Who are your three choices?',
        choices: ['Lily', 'Mike', 'Nicole', 'Student4', 'Student5', 'Student6', 'Student7']
      },
      targets: findCharacters(['Mr. Dog']),
      timed: {
        cause: 'game',
        timeout: 3300
      }
    }, {
      triggeredBy: 'time',
      type: 'choice',
      decision: {
        question: 'Who is your choice?',
        choices: ['Lily', 'Mike', 'Nicole', 'Student4', 'Student5', 'Student6', 'Student7']
      },
      targets: findCharacters(['Andrew']),
      timed: {
        cause: 'game',
        timeout: 3500
      }
    }, {
      triggeredBy: 'time',
      type: 'text',
      eventThatOccurred: 'Andrew hired: _______! The correct hire was: _____. (Either: Andrew wins! Or, personX wins!)',
      targets: characterIds,
      timed: {
        cause: 'game',
        timeout: 3600
      }
    }
  ];
  return Event.createAsync(events);
};
function findCharacters(characters) {
  var promiseArr = [];
  characters.forEach(function(character) {
    promiseArr.push(Char.findOne({ name: character }));
  });
  Promise.all(promiseArr)
    .then(function(characterArr) {
      return characterArr.map(function(character) {
        return character._id;
      });
    }).then(function(charIds) {
      return charIds;
    }).then(null, console.log);
}

var seedGame = function() {
  var game = {
    title: 'HIRING DAY!',
    characters: characterIds,
    events: eventIds
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
        characterIds = createdCharacters.map(function(char) {
          return char._id;
        });
        console.log('character ids: ', characterIds);
        return seedEvents();
      }).then(function(createdEvents) {
        eventIds = createdEvents.map(function(event) {
          return event._id;
        });
        console.log('events ids: ', eventIds);
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
