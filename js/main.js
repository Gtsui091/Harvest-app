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
var page = window.location.pathname.split("/").pop();
var userID;

// load content depending on whether the user is logged in or not
firebase.auth().onAuthStateChanged(function(user){
    if (user) {
        userID = user.uid;
        isUserInDB(user);
        if (page == "index.html" || page == "") {
            loadIndexPageLoggedIn();
            showAllListings();
        }
        if (page == "profile.html") {
            loadProfilePage();
            showMyListings();
        }
    } else {
        if (page == "index.html" || page == "") {loadIndexPageNotLoggedIn();}
    }
});

function logOut() {
    firebase.auth().signOut().then(function(){
        window.location.href="index.html";
    });
}

// add user to database if they are a new user
function isUserInDB(user) {
    firebase.database().ref('users/' + user.uid).once('value').then(function(snapshot) {
        if (!snapshot.val()) {
            addUserToDB(user.uid, user.displayName, user.email);
        }
    });
}

function addUserToDB(uid, name, email) {
    firebase.database().ref('users/' + uid).set({
      name: name,
      email : email,
      listings: [0],
    });
}

function addListingToDB() {
    if (document.getElementById('add-listing-image').files) {
        var image = document.getElementById('add-listing-image').files[0];
    }
    var title = document.getElementById('add-listing-produce').value;
    var city = document.getElementById('add-listing-city').value;
    var weight = document.getElementById('add-listing-weight').value;
    // if any information is missing, don't do anything
    if (!userID || !image || !title || !city || !weight) {return;}

    var reader = new FileReader();    
    reader.addEventListener("load", function () {
        var listing = {
            uid: userID,
            image: reader.result,
            title: title,
            weight: weight,
            city: city
        };
      
        var listingID = firebase.database().ref('listings/').push().key;
        firebase.database().ref('listings/' + listingID).update(listing);
        addListingIdToUser(listingID);
        // close add listing modal window once completed
        hideAddListingModal();
    }, false);

    reader.readAsDataURL(image)
}

function updateImageHolder(event) {
    let reader = new FileReader();
    reader.onload = function(){
        document.getElementById('add-listing-image-holder').style.backgroundImage = `url(${reader.result})`;
        document.getElementById('add-listing-image-holder').style.backgroundSize = `cover`;
    };
    reader.readAsDataURL(event.target.files[0]);
}

// when user adds new listing, add the unique listing ID to user branch of the database
function addListingIdToUser(listingID) {
    firebase.database().ref('/users/' + userID + '/listings').once('value').then(function(snapshot) {
        var listings = snapshot.val();
        listings.push(listingID);
        firebase.database().ref('users/' + userID + '/listings/').set(listings);
    });
}

function displayAddListingModal() {
    document.getElementById('add-listing').style.display = "flex";
}

function hideAddListingModal() {
    document.getElementById('add-listing').style.display = "none";
}

function hideShowInfoModal() {
    document.getElementById('show-info').style.display = "none";
}

// modal window with information when user clicks on a listing in the Marketplace
function displayShowInfoModal(listingID) {
    document.getElementById('show-info').style.display = "flex";

    // get listing information from database
    firebase.database().ref('listings/' + listingID).once('value').then(function(listing) {
        document.getElementById('show-info-image').style.backgroundImage = `url(${listing.val().image})`;
        document.getElementById('show-info-title').innerHTML = listing.val().title;
        document.getElementById('show-info-city').innerHTML = listing.val().city;
        document.getElementById('show-info-weight').innerHTML = listing.val().weight + " lb";
        
        // get user information from database
        firebase.database().ref('users/' + listing.val().uid).once('value').then(function(user) {
            document.getElementById('show-info-name').innerHTML = "Listed by: " + user.val().name;
            document.getElementById('show-info-email').innerHTML = user.val().email;
            document.getElementById('show-info-email').href = `mailto:${user.val().email}`;
        });
    });
}

// modal window with information when user clicks on a listing in "Your Listings" section of the porfile page
function displayShowInfoMyListingModal(listingID) {
    document.getElementById('show-info').style.display = "flex";

    firebase.database().ref('listings/' + listingID).once('value').then(function(listing) {
        document.getElementById('show-info-image').style.backgroundImage = `url(${listing.val().image})`;
        document.getElementById('show-info-title').innerHTML = listing.val().title;
        document.getElementById('show-info-city').innerHTML = listing.val().city;
        document.getElementById('show-info-weight').innerHTML = listing.val().weight + " lb";
        document.getElementById('remove-listing').onclick = function() {removeListing(listingID, listing.val().uid);} 
    });
}

// add div block to page containing one listing and its information (for Marketplace)
function addListingToPage(listing) {
    document.getElementById("listings").innerHTML += `
        <div class="listing" id="${listing.key}" onclick="displayShowInfoModal(this.id)">
            <div class="listing-image" style="background-image: url(${listing.val().image});"></div>
            <div class="listing-title">${listing.val().title}</div>
            <div class="listing-city">${listing.val().city}</div>
            <div class="listing-weight">${listing.val().weight} lb</div>
        </div>
    `;
}

// add div block to page containing one listing and its information (for profile page)
function addMyListingsToPage(listing) {
    document.getElementById("listings").innerHTML += `
        <div class="listing" id="${listing.key}" onclick="displayShowInfoMyListingModal(this.id)">
            <div class="listing-image" style="background-image: url(${listing.val().image});"></div>
            <div class="listing-title">${listing.val().title}</div>
            <div class="listing-city">${listing.val().city}</div>
            <div class="listing-weight">${listing.val().weight} lb</div>
        </div>
    `;
}

function removeListing(listingID, uid) {
    firebase.database().ref("listings/" + listingID).remove();

    firebase.database().ref('/users/' + userID + '/listings').once('value').then(function(snapshot) {
        var listings = snapshot.val();
        for (let i = 0; i < listings.length; i++) {
            if (listings[i] == listingID) {
                listings.splice(i, 1); 
            }
        }
        firebase.database().ref('users/' + userID + '/listings/').set(listings);
        window.location.href="profile.html";
    });
}

// add each listing in database to page
function showAllListings() {
    firebase.database().ref("listings/").on('child_added', function(listing) {    
        addListingToPage(listing);
    });
}

// add each listing listed by logged in user to page
function showMyListings() {
    firebase.database().ref('/users/' + userID + '/listings').on('child_added', function(listingID) {
        if (listingID.val()) {
            firebase.database().ref("listings/" + listingID.val()).once('value').then(function(listing) {
                addMyListingsToPage(listing)
            });
        } 
    });
}

// load html elements based on whether a user is logged in and which page they are on

function loadIndexPageNotLoggedIn() {
    document.body.innerHTML += header_not_logged_in_HTML + welcome_HTML;
}

function loadIndexPageLoggedIn() {
    document.body.innerHTML += header_logged_in_HTML + indexPageTitle + listings_HTML + add_listing_HTML + show_info_HTML;
}

function loadProfilePage() {
    document.body.innerHTML += header_logged_in_HTML + user_profile_HTML + profilePageTitle + listings_HTML + add_listing_HTML + show_info_user_listing_HTML;
    addUserProfile();
}

function addUserProfile() {
    firebase.database().ref('/users/' + userID).once('value').then(function(user) {
        document.getElementById('user-profile-name').innerHTML = `Name: ${user.val().name}`;
        document.getElementById('user-profile-email').innerHTML = `Email: ${user.val().email}`;
    });
}

/////////////////////////////////////////////////////
// COMMON HTML //////////////////////////////////////
////////////////////////////////////////////////////

var header_not_logged_in_HTML = `
<div id="header">
    <div class="wrapper">
        <a id="logo" href="index.html">Harvest</a>
        <img id="logo-image" href="index.html">
        <a id="login-button" href="login.html">Login</a>
    </div>
</div>
`;

var listings_HTML = `
<div id="listings"></div>
`;

// html for add listing modal window
var add_listing_HTML = `
<div id="add-listing" class="container">
    <div class="modal">
        <div id="add-listing-image-holder"></div>
        <input id="add-listing-image" type="file" accept='image/*' onchange='updateImageHolder(event)'>
        <input id="add-listing-produce" type="text" placeholder="Produce Name"> 
        <br>
        <input id="add-listing-city" type="text" placeholder="City">
        <br>
        <input id="add-listing-weight" type="text" placeholder="Weight (lb)">
        <br>
        <input id="add-listing-submit" type="button" value="Submit" onclick="addListingToDB();">
        <span id="add-listing-close" onclick="hideAddListingModal();">close</span>
    </div>  
</div>
`;

// html for showing listing info modal window (for Marketplace)
var show_info_HTML=`
<div id="show-info" class="container">
    <div class="modal">
        <div id="show-info-image"></div>
        <div id="show-info-title"></div>
        <div id="show-info-weight"></div>
        <div id="show-info-city"></div>
        <div id="show-info-name"></div>
        <a id="show-info-email"></a>
        <span id="show-info-close" onclick="hideShowInfoModal();">close</span>
    </div>
</div>
`;

// html for showing listing info modal window (for profile page)
var show_info_user_listing_HTML=`
<div id="show-info" class="container">
    <div class="modal">
        <div id="show-info-image"></div>
        <div id="show-info-title"></div>
        <div id="show-info-weight"></div>
        <div id="show-info-city"></div>
        <div id="listed-by">Listed by: You</div>
        <span id="remove-listing">Remove Listing</span>
        <span id="show-info-close" onclick="hideShowInfoModal();">close</span>
    </div>
</div>
`;

var header_logged_in_HTML = `
<div id="header">
    <div class="wrapper">
        <a id="logo" href="index.html">Harvest</a>
        <img id="logo-image" href="index.html">
        <a id="login-button" href="#" onclick="logOut();">Logout</a>
        <a id="profile-button" href="profile.html">Profile</a>
        <a id="add-listing-button" href="#" onclick="displayAddListingModal();">Add Listing</a>
    </div>
</div>
`;

// html for page when not logged in
var welcome_HTML = `
<div id="welcome">
    <main>
        <div id="intro-index">
        </div>

        <div id="index-join-div">
            <div id="index-join-content">
                <h3>Harvest connects like-minded gardeners with each other so that excess produce is not wasted. Find home-grown food in your city to trade today.</h3>
                <button id="join-button" onclick="window.location.href='login.html';">Join now</button>
            </div>
        </div>

        <div id="index-howto">
            <div id="index-howto-div">
            <div id="how-it-works">
                How it works?</div>
            </div>
            <div "how-div"">
                
                <div class="how-description"><h1>Browse Listings</h1>
                    <h3>Find listings for vegetables or fruits nearby.</h3>
                </div>
                

                <div class="how-description"><h1>Add Your Own Listings</h1>
                    <h3>Put up your own produce for others to see.</h3>
                </div>

                <div class="how-description"><h1>Swap Produce</h1>
                    <h3>When a trade is accepted, contact your match to swap items.</h3>
                </div>
            </div>
        </div>

    </main>
</div>
`;

var user_profile_HTML = `
<div id="user-profile">
    <div id="user-profile-name"></div>
    <div id="user-profile-email"></div>
</div>
`;

var indexPageTitle = `
<div class="page-title-container">
    <br>
    <p id="page-title">Market Place</p>
    <br>
    <p class="description">Browse fresh fruit and vegetables available for trade.</p>
    <br>
</div>
`;

var profilePageTitle = `
<div class="page-title-container">
    <br>
    <p id="page-title">Your Listings</p>
    <br>
    <p class="description">Manage produce you have listed in the Marketplace.</p>
    <br>
</div>
`;

