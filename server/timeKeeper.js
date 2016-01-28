var fireRef = new Firebase("https://flickering-inferno-4436.firebaseio.com/");
fireRef.set({ })

var firstName = "lily";

fireRef.child("names").child(firstName).on('value', function(data) {
  console.log(data.val());
});


fireRef.child("global").child("messages").on('value', function(data) {
  console.log(data.val());
});



// event
function pantsOnFire() {
  console.log("Hello world");
}

function setPropertyOn() {
  fireRef.set
}

var timeGameBegan = Date.now();

var events = {
  5000: pantsOnFire
};
