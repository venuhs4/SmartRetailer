// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";

    document.addEventListener( 'deviceready', onDeviceReady.bind( this ), false );

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener( 'pause', onPause.bind( this ), false );
        document.addEventListener('resume', onResume.bind(this), false);

        // Should be called once the notification is clicked
        // **important** Doesn't work with iOS while app is closed
        //PushbotsPlugin.initializeAndroid('55347ccb17795958748b457c', '145091056519');
        var Pushbots = PushbotsPlugin.initialize("56a64a3317795906438b456a", { "android": { "sender_id": "942601407343" } });

        Pushbots.on("registered", function (token) {
            localStorage['token'] = token;
            console.log(token);
        });

        Pushbots.getRegistrationId(function (token) {
            console.log("Registration Id:" + token);
        });
        //PushbotsPlugin.initializeAndroid('55347ccb17795958748b457c', '145091056519');
        // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
    };

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };
} )();