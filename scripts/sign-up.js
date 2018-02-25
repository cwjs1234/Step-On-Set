$(document).ready(function () {

    //sign-up 
    $("#sign-up-confirm").on('click', function () {

        var fullName = $("#name").val();
        var userEmail = $("#email").val();
        var password = $("#password").val();

        firebase.auth().createUserWithEmailAndPassword(userEmail, password).then(function (user) {
            var id = user.uid;
            sendEmailVerification();
            firebase.database().ref('users/' + id).set({
                email: userEmail,
                name: fullName
            });
        }).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode == 'auth/weak-password') {
                alert('The password is too weak.');
            } else {
                alert(errorMessage);
            }
            console.log(error);
        });

    });

    function sendEmailVerification() {
        // [START sendemailverification]
        firebase.auth().currentUser.sendEmailVerification().then(function() {
        });
      }


    $("#sign-in-confirm").on('click', function () {

        var email = $("#email-signin").val();
        var password = $("#password-signin").val();
        console.log(email);

        firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // [START_EXCLUDE]
            if (errorCode === 'auth/wrong-password') {
                alert('Wrong password.');
            } else {
                alert(errorMessage);
            }
            console.log(error);
            document.getElementById('quickstart-sign-in').disabled = false;
        });
        // [EN D authwithemail]
    });

    //sign out
    $("#logout-confirm").on('click', function () {
        firebase.auth().signOut();
    });

    //login state
    firebase.auth().onAuthStateChanged(function (user) {
        console.log("fired")

        if (user) {
            // User is signed in.
            var displayName = user.displayName;
            var email = user.email;
            var emailVerified = user.emailVerified;
            var photoURL = user.photoURL;
            var isAnonymous = user.isAnonymous;
            var uid = user.uid;
            var providerData = user.providerData;

            var userId = user.uid; //userId exists in submitLocation.html

            $("#sign-in-status").text('Signed in as' + " " + user.email);
            $("#logged-out-options").hide();
            $("#logged-in-options").show();
        } else {
            $("#sign-in-status").text('Signed out');
            $("#logged-in-options").hide();
            $("#logged-out-options").show();

        }
    });
});