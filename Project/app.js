// Initialize Firebase
var config = {
  apiKey: "AIzaSyA0U63hj8Oz18aQKuYUMnPBft6vYN3XRY0",
  authDomain: "chat-b213f.firebaseapp.com",
  databaseURL: "https://chat-b213f.firebaseio.com",
  storageBucket: "chat-b213f.appspot.com",
  messagingSenderId: "557979765793"
};
firebase.initializeApp(config);

var database = firebase.database();
var chatData = database.ref("/chat")
var userRef = database.ref("users")
var currentTurnRef = database.ref("turn")

var username = "Guest";
var currentUsers = null;
var currentTurn = null;
var userNum = false;
var userOneExists = false;
var userTwoExists = false;
var userOneData = null;
var userTwoData = null;

//USERNAME LISTENERS
//Start button - takes username and tries to get user in game
$('#start').click(function() {
  if ($('#user').val() !== "") {
    username = capitalize($('#user').val());
    getInChat();
  }
});
//listener for 'enter' in username input
$('#user').keypress(function(e) {
  if (e.keyCode == 13 && $('#user').val() !== "") {
    username = capitalize($('#user').val());
    getInChat();
  }
});

//Function to capitalize usernames
function capitalize(name) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

//CHAT LISTENERS
//Chat send button listener, grabs input and pushes to firebase. (Firebase's push automatically creates a unique key)
$('#chatsend').click(function() {
  if ($('#chatinput').val() !== "") {
    var message = $('#chatinput').val();
    chatData.push({
      name: username,
      message: message,
      time: firebase.database.ServerValue.TIMESTAMP,
      idNum: userNum
    });
    $('#chatinput').val("");
  }
});

//Chatbox input listener
$('#chatinput').keypress(function(e) {
  if (e.keyCode == 13 && $('#chatinput').val() !== "") {
    var message = $('#chatinput').val();
    chatData.push({
      name: username,
      message: message,
      time: firebase.database.ServerValue.TIMESTAMP,
      idNum: userNum
    });
    $('#chatinput').val("");

  }
});


//click event for dynamically added li elements
$(document).on('click', 'li', function() {
  console.log('click');
  //grabs text from li choice
  var clickChoice = $(this).text();
  console.log(userRef)
  //sets the choice in the current user object in firebase
  userRef.child('choice').set(clickChoice);

});

//Update chat on screen when new message detected - ordered by 'time' value
chatData.orderByChild("time").on('child_added', function(snapshot) {

  //if idNum is 0, then its a disconnect message and displays accordingly
  //if not - its a user chat message
  if (snapshot.val().idNum === 0) {
    $('#chatmessages').append('<p class=player' + snapshot.val().idNum + '><span>' + snapshot.val().name + '</span>' + ' ' + snapshot.val().message + '</p>');
  } 
  else {
    $('#chatmessages').append('<p class=player1' + '><span>' + snapshot.val().name + '</span>' + ': ' + snapshot.val().message + '</p>');
  }
  //keeps div scrolled to bottom on each update.
  $('#chatmessages').scrollTop($("#chatmessages")[0].scrollHeight);
});

//tracks changes in key which contains user objects
userRef.on('value', function(snapshot) {
  //length of the 'users' array
  currentUsers = snapshot.numChildren();

  //check to see if users exist
  userOneExists = snapshot.child('1').exists();
  userTwoExists = snapshot.child('2').exists();

  //user data objects
  userOneData = snapshot.child('1').val();
  userTwoData = snapshot.child('2').val();

  //If theres a user one, fill in name
  if (userOneExists) {
    $('#user1name').text(userOneData.name);

  } else {
    // if there is no user one
    $('#user1name').text("Waiting for Another User");
  }

  //if theres a user two, fill in name
  if (userTwoExists) {
    $('#user2name').text(userTwoData.name);
  } else {
    // if no user two
    $('#user2name').text("Waiting for Another User");
  }
});



//Detects changes in current turn key
currentTurnRef.on('value', function(snapshot) {
  //gets current turn from snapshot
  currentTurn = snapshot.val();

  //dont do the following unless you're logged in
  if (userNum) {
      if (userNum) {
        $('#user' + userNum + ' ul').empty();
      }
      $('#user1 ul').empty();
      $('#user2 ul').empty();
  }
});


//Function to get in the game
function getInChat() {
  //For adding disconnects to the chat with a unique id (the date/time the user entered the game)
  //Needed because Firebase's '.push()' creates its unique keys client side, so you cant '.push()' in a '.onDisconnect'
  var chatDataDisc = database.ref("/chat/" + Date.now());

  //checks for current users
  if (currentUsers < 2) {

    //creates key based on assigned user number
    userRef = database.ref("/users/");


    //creates user object.
    userRef.set({
      name: username
    });

    //on disconnect remove this user object
    userRef.onDisconnect().remove();

    //send disconnect message to chat with Firebase server generated timestamp and id of '0' to denote system message
    chatDataDisc.onDisconnect().set({
      name: username,
      time: firebase.database.ServerValue.TIMESTAMP,
      message: 'has disconnected.',
      idNum: 0
    });

    //Remove name input box and show current user.
    $('#swapzone').html('<h2>Hi ' + username + '! Chat With a Friend!' + '</h2>');

  }
}