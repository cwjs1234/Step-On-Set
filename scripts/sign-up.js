$(document).ready(function () {

    //login state - checks for login status and provides user information
    firebase.auth().onAuthStateChanged(function (user) {
        console.log("fired")
        if (user) {
            if (window.location.href == "http://localhost/steponset/public/login.html"){
                window.location.replace("index.html");
            }
            console.log("signed in");
            // User is signed in.
            var displayName = user.displayName;
            var email = user.email;
            var emailVerified = user.emailVerified;
            var photoURL = user.photoURL;
            var isAnonymous = user.isAnonymous;
            var uid = user.uid;
            var providerData = user.providerData;

            $("#sign-in-status").text('Signed in as' + " " + user.email);
            $("#logged-in-options").show();
        } else if (!user && window.location.href !== "http://localhost/steponset/public/login.html"){
            window.location.replace("login.html");
        }
    });

    //form validation - jQuery validation method to validate login/register forms
    $('form').each(function () { 
        $(this).validate({ 
            validClass: 'valid', 
            rules: {
                name: {
                    required: true
                },
                email: {
                    required: true,
                    email: true
                },
                psw: {
                    required: true,
                }
            }
        });
    });

    //REGISTER 
    $("#registerForm").on('submit', event => {
        event.preventDefault();
        var fullName = $("#name").val();
        var userEmail = $("#email").val();
        var password = $("#password").val();

        if ($("#registerForm").valid()) { 
            firebase.auth().createUserWithEmailAndPassword(userEmail, password).then(function (user) {
                $(".registermodal-container").empty().append("<p>Thank you registering " + fullName + ". Please check your emails and follow " + 
                "the link to complete your sign up.<p>  <input id=\"sign-up-confirm\" type=\"submit\" onclick=\"location.href='index.html';\" name=\"login\" class=\"login loginmodal-submit\" value=\"Continue\">")
                var id = user.uid;
                sendEmailVerification();
                //write users details to firestore
                firebase.firestore().collection("users").doc(id).set({
                    email: userEmail,
                    name: fullName
                }) 
            .catch(function (error) {
                    console.error("Error writing document: ", error);
                });
            })
        };
    });

    //Email verification. called during sign-up
    function sendEmailVerification() {
        // [START sendemailverification]
        firebase.auth().currentUser.sendEmailVerification().then(function () {});
    }

    //LOGIN
    $("#signInForm").on('submit', event => {
        event.preventDefault();

        var email = $("#email-signin").val();
        var password = $("#password-signin").val();

        if ($("#signInForm").valid()) {
            firebase.auth().signInWithEmailAndPassword(email, password).then(function (){
                window.location.replace("index.html");
            }).catch(function (error) {
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
        } else {
            console.log("validation failed")
        };

    });

    //sign out
    $("#logout-confirm").on('click', function (event) {
        event.preventDefault();
        firebase.auth().signOut().then(function(){
            window.location.replace("login.html");
        });
    });

    //forgot password UI change
    $("#password-reset").on("click", function(event){
        event.preventDefault();

        $("#login-content, .login-help").hide();
        $("#password-reset-container").show();
    })

    function returnToLogin(){
        $("#password-reset-container").hide()
        $("#login-content, .login-help").show();
    }

    $(document).on('click','#password-reset-confirm', function(){
        var email = $("#email-passwordreset").val();
        console.log(email);
        firebase.auth().sendPasswordResetEmail(email).then(function(){
            console.log("email sent")
            returnToLogin();
            $("#login-content").prepend("<p> Password reset has been sent! Check your emails </p>");
        }).catch(function(error){
            console.log(error);

        })
    })
 
    $(document).on('click','#back-to-login', function(event){
        event.preventDefault();
        returnToLogin();
    })

});