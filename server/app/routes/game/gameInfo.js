var myFirebaseRef = new Firebase("https://flickering-inferno-4436.firebaseio.com/");
var namesRef = new Firebase("https://flickering-inferno-4436.firebaseio.com/names");

var game = {
  name:"Die Hard: With A Vengance",
  events: {
      timed: [{
          time: 1000,
          name: 'bomb',
          effect: [{
              name: 'jerry',
              index: 0,
              type: "text",
              action: 'run!!'
          }, {
              name: 'John Mclean',
              index: 1,
              type: "event",
              action: "eventID"
          }]
      }]
  },
  characters: [{
      name: "jerry",
      position: "truck driver",
      background: "drives a truck, loves history, and is very interested in valves",
      abilities: [{title: "Presidential Knowledge",
      description: "Knows the name and order of every president",
      trigger: "eventID"
      }],
      limitations: [{title: "Fears gunplay",
      description: "Cannot pick up a gun",
      trigger: "eventID"
      }]
    },{
      name: "John Mclean",
      position: "Policeman",
      background: "Been at the center of many high leverage hostage situations",
      abilities: [{title: "Badassery",
      description: "Takes a licking and keeps on ticking",
      trigger: "Normal damage adds blood and dirt to John's sleeveless shirt but he takes no damage"
      }],
      limitations:[{title: "Poor Communicator",
      description: "John cannot call his wife",      
      },{title: "Barefoot",
      description: "John sometimes takes his shoes off an inopportune moments",
      trigger: "eventID"   
      }]
  }]
}
module.exports = {
  game: game
}