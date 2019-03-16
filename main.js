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

var database = firebase.database();

function getRequesterName(user) {
    // var dbRef = firebase.database().ref('/Requests/' + user).once('value').then(function(snapshot) {
    //     let requester = (snapshot.val() && snapshot.val().requester) || 'requester';
    var out = document.getElementById("requester-name")
    var dbRef = firebase.database().ref('/Requests/' + user + '/0/').child('requester');
    dbRef.once("value", function(snap){ out.innerHTML = snap.val(); } );

};











// Add Listing Modal
function displayAddListing() {
    document.getElementById("add-listing").style.display = "flex";
}
function closeAddListing() {
    document.getElementById("add-listing").style.display = "none";
}

document.getElementById('uploadFile').addEventListener('change', function() {
	let file;
	let destination = document.getElementById('addListingPicture');
	destination.src = '';

	// Looping in case they uploaded multiple files
	for(let x = 0, xlen = this.files.length; x < xlen; x++) {
		file = this.files[x];
		if(file.type.indexOf('image') != -1) { // Very primitive "validation"

			let reader = new FileReader();

			reader.onload = function(e) {
				let img = new Image();
				img.src = e.target.result; // File contents here

				destination.appendChild(img);
			};
			
			reader.readAsDataURL(file);
		}
	}
});

// Outgoing Trade Request Modal
function displayOutgoingListing() {

    document.getElementById("outgoing-listing").style.display = "flex";
}

function closeOutgoingListing() {
    document.getElementById("outgoing-listing").style.display = "none";
}

// Incoming Trade Request Modal
function displayIncomingListing() {

    document.getElementById("incoming-listing").style.display = "flex";
}

function closeIncomingListing() {
    document.getElementById("incoming-listing").style.display = "none";
}

//let dbRef = firebase.database().ref().child("message");
//dbRef.on("value", function(snap) {
//});

// let db_listings = firebase.database().ref("listings").set({
//     0: {
//         user: "Billy123",
//         name: "Potatoes",
//         city: "Vancouver",
//         weight: 20,
//         type: "vegetable",
//         image: "url"
//     },

//     1: {
//         user: "Bob321",
//         name: "Carrots",
//         city: "Vancouver",
//         weight: 50,
//         type: "vegetable",
//         image: "url"
//     },
// });

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

// let dbIncomingRequests = firebase.database().ref("incomingRequests").set({
//     0: {
//         user: "Billy123",
//         requester: "John567",
//         item: "Potatoes",
//         offeredItem:"Carrots",
//         offeredItemDescription: "Chatenay Carrots",
//         quantity: 10,
//         quantityOffered: 10,
//         itemImage: "url",
//         offeredItemImage: "url",
//         message: "Hi, can I have potatoes for carrots?"
//     },

//     1: {
//         user: "Mary565",
//         requester: "Randy214",
//         item: "Tomatoes",
//         offeredItem:"Apples",
//         offeredItemDescription: "Granny Smith Apples",
//         quantity: 7,
//         quantityOffered: 9,
//         itemImage: "url",
//         offeredItemImage: "url",
//         message: "Would you like to trade your tomatoes for my apples?"
//     },
// });

// let dbOutgoingRequests = firebase.database().ref("outgoingRequests").set({
//     0: {
//         user: "John567",
//         lister: "Billy123",
//         item: "Potatoes",
//         offeredItem:"Carrots",
//         offeredItemDescription: "Chatenay Carrots",
//         quantity: 10,
//         quantityOffered: 10,
//         itemImage: "url",
//         offeredItemImage: "url",
//         message: "Hi, can I have potatoes for carrots?"
//     },

//     1: {
//         user: "Randy214",
//         requester: "Mary565",
//         item: "Tomatoes",
//         offeredItem:"Apples",
//         offeredItemDescription: "Granny Smith Apples",
//         quantity: 7,
//         quantityOffered: 9,
//         itemImage: "url",
//         offeredItemImage: "url",
//         message: "Would you like to trade your tomatoes for my apples?"
//     },
// });
// // 
// let dbRequests = firebase.database().ref("Requests").set({
//     Billy123: {
//         requester: "John567",
//         item: "Potatoes",
//         offeredItem:"Carrots",
//         offeredItemDescription: "Chatenay Carrots",
//         quantity: 10,
//         quantityOffered: 10,
//         itemImage: "url",
//         offeredItemImage: "url",
//         message: "Hi, can I have potatoes for carrots?"
//     },

//     Mary565: {
//         requester: "Randy214",
//         item: "Tomatoes",
//         offeredItem:"Apples",
//         offeredItemDescription: "Granny Smith Apples",
//         quantity: 7,
//         quantityOffered: 9,
//         itemImage: "url",
//         offeredItemImage: "url",
//         message: "Would you like to trade your tomatoes for my apples?"
//     },
// });