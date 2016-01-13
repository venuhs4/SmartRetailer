(function () {
    "use strict";

    angular.module("myapp", ["ionic", "myapp.controllers", "myapp.services"])
        .run(function ($ionicPlatform) {
            $ionicPlatform.ready(function () {
                if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                }
                if (window.StatusBar) {
                    StatusBar.styleDefault();
                }
            });
        })
        .config(function ($stateProvider, $urlRouterProvider) {

            var idUserLogedIn = localStorage['idUserLogedIn'];
            var isDefaultRetailerSet = localStorage['defaultRetailer'];

            $urlRouterProvider.otherwise("/products");

            //if (idUserLogedIn == null) {
            //    console.warn("user not loged in");
            //    $urlRouterProvider.otherwise("/products");
            //}
            //else if (isDefaultRetailerSet == null) {
            //    console.warn("default retailer not set");
            //    $urlRouterProvider.otherwise("/products");
            //}
            //else {
            //    console.info('everything set');
            //    $urlRouterProvider.otherwise("/products");
            //}
            $stateProvider
            .state("register", {
                url: "/register",
                templateUrl: "app/templates/view-register.html",
                controller: "registerCtrl"
            })
            .state("login", {
                url: "/login",
                templateUrl: "app/templates/view-login.html",
                controller: "loginCtrl"
            }).state("retailers", {
                url: "/retailers",
                templateUrl: "app/templates/view-retailers.html",
                controller: "retailersCtrl"
            })
            .state("home", {
                url: "/home",
                templateUrl: "app/templates/view-home.html",
                controller: "homeCtrl"
            }).state("products", {
                url: "/products",
                templateUrl: "app/templates/view-products.html",
                controller: "productsCtrl"
            }).state("profile", {
                url: "/profile",
                templateUrl: "app/templates/view-profile.html",
                controller: "profileCtrl"
            }).state("orders", {
                url: "/orders",
                templateUrl: "app/templates/view-orders.html",
                controller: "ordersCtrl"
            }).state("settings", {
                url: "/settings",
                templateUrl: "app/templates/view-settings.html",
                controller: "settingsCtrl"
            }).state("feedback", {
                url: "/feedback",
                templateUrl: "app/templates/view-feedback.html",
                controller: "feedbackCtrl"
            });

        });
})();