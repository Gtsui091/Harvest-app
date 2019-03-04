// Initialize Firebase
var config = {
    apiKey: "AIzaSyDxwWFvb4Pt6WitONRNK2_8pp7vZqnWl04",
    authDomain: "produceforbarter.firebaseapp.com",
    databaseURL: "https://produceforbarter.firebaseio.com",
    projectId: "produceforbarter",
    storageBucket: "produceforbarter.appspot.com",
    messagingSenderId: "822405786503"
};
firebase.initializeApp(config);


function displayAddListing() {
    document.getElementById("add-listing").style.display = "flex";
}




//let dbRef = firebase.database().ref().child("message");
//dbRef.on("value", function(snap) {
//});

let db_listings = firebase.database().ref("listings").set({
    0: {
        user: "Billy123",
        name: "Potatoes",
        city: "Vancouver",
        weight: 20,
        type: "vegetable",
        image: "url"
    },

    1: {
        user: "Bob321",
        name: "Carrots",
        city: "Vancouver",
        weight: 50,
        type: "vegetable",
        image: "url"
    },
});

/*
let db_users = firebase.database().ref("users").set({
    "Billy123": {
        name: "Billy Elliott",
        city: "Vancouver",
        picture: "url"
    },

    "Bob321": {
        name: "Bob Smith",
        city: "Vancouver",
        picture: "url"
    },
});
*/