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
// var currentUser = firebase.auth().currentUser;

var currentUser;

// Once logged in, create user profile and write to firebase
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        currentUser = user;
        console.log(currentUser);
        let user_profile = firebase.database().ref("/Users/" + firebase.auth().currentUser["uid"]).set({
            email: firebase.auth().currentUser["email"],
            username: firebase.auth().currentUser["displayName"]
        });
    } else {
      console.log("No one is signed in.")
    }
  });


// Pull user profile info from database
function getUsername() {
    var out = document.getElementById("username");
    var dbRef = firebase.database().ref('/Users/' + currentUser).child('username');
    dbRef.once("value", function(snap){ out.innerHTML = snap.val(); } );
};

function getEmail(userId) {
    var out = document.getElementById("email");
    var dbRef = firebase.database().ref('/Users/' + userId).child('email');
    dbRef.once("value", function(snap){ out.innerHTML = snap.val(); } );
};

function getAddress(userId) {
    var out = document.getElementById("address");
    var dbRef = firebase.database().ref('/Users/' + userId).child('address');
    dbRef.once("value", function(snap){ out.innerHTML = snap.val(); } );
};

function getPhoneNumber(userId) {
    var out = document.getElementById("phoneNumber");
    var dbRef = firebase.database().ref('/Users/' + userId).child('phoneNumber');
    dbRef.once("value", function(snap){ out.innerHTML = snap.val(); } );
};

// Add Listing Modal
function displayAddListing() {
    document.getElementById("add-listing").style.display = "flex";
}
function closeAddListing() {
    document.getElementById("add-listing").style.display = "none";
}

document.getElementById("uploadFile").addEventListener("change", function() {
    let image = this.files[0];
    let reader = new FileReader();

    reader.onloadend = function() {
        document.getElementById("add-listing-picture").src = reader.result;
    };    

    reader.readAsDataURL(image);
});

// Submit listing form
document.getElementById("add-listing-form").addEventListener("submit", function(event) {
    event.preventDefault();
    let form = this;
    let reader = new FileReader();
    
    reader.onloadend = function() {
        let db_listings = firebase.database().ref("Listings").push({
            user: currentUser["uid"],
            image: reader.result,
            name: form.elements[1].value,
            city: form.elements[2].value,
            type: form.elements[3].value,
            weight: parseInt(form.elements[4].value),
        });
        document.getElementById("add-listing-form").reset();
        document.getElementById("add-listing-picture").src = "images/insert_picture.png";
        closeAddListing();
    };

    reader.readAsDataURL(form.elements[0].files[0]);
});

// Pull all listings on page load + Add new listings
firebase.database().ref("Listings").on('child_added', function(listing) {    
    addListingToPage(listing);
});

function addListingToPage(listing) {
    document.getElementById("listings").innerHTML += `
        <div class="listing" id="${listing.key}" onclick="displayInfoModal(this.id)">
            <div class="listing-image" style="background-image: url(${listing.val().image});"></div>
            <div class="listing-name">${listing.val().name}</div>
            <div class="listing-city">${listing.val().city}</div>
            <div class="listing-weight">${listing.val().weight} lb</div>
        </div>
    `;
}

// Pull all current user's listings onto myListings page - cannot figure this out :(


firebase.database().ref('Listings').orderByChild(currentUser["uid"]).once('value', function(listing) {
    showMyListings(listing);
});

function getListing(){
    firebase.database().ref("Listings").on('child_added', function(listing) {
        console.log(listing)
        showMyListings(listing);
    });
}

function showMyListings(listing) {
    if (listing.val().user == currentUser['uid']){
        document.getElementById("myListings").innerHTML += `
            <div class="listing" id="${listing.key}" onclick="displayInfoModal(this.id)">
                <div class="listing-image" style="background-image: url(${listing.val().image});"></div>
                <div class="listing-name">${listing.val().name}</div>
                <div class="listing-city">${listing.val().city}</div>
                <div class="listing-weight">${listing.val().weight} lb</div>
            </div>
    `;}
}

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


function displayInfoModal(key) {
    let id = "IgkRb7HWIMfpA17mSzXjQTpiNa92";
    document.getElementById("info").style.display = "flex";

    firebase.database().ref('Listings/' + key).once('value').then(function(listing) {
        console.log(listing.val());
        document.getElementById("info-name").innerHTML = listing.val().name;
        document.getElementById("info-image").style.backgroundImage = "url("+listing.val().image+")";
        document.getElementById("info-city").innerHTML = listing.val().city;
        document.getElementById("info-weight").innerHTML = listing.val().weight;
    });

    firebase.database().ref('Users/' + id).once('value').then(function(user) {
        document.getElementById("info-email").innerHTML = user.val().email;
        document.getElementById("info-phone").innerHTML = user.val().phoneNumber;
    });
}

function hideInfoModal() {
    document.getElementById("info").style.display = "none";
}