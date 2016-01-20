﻿(function () {
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
             //   AppRate.promptForRating(true);
            });
        })
        .config(function ($stateProvider, $urlRouterProvider) {

            var idUserLogedIn = localStorage['idUserLogedIn'];
            var isDefaultRetailerSet = localStorage['defaultRetailer'];

            $urlRouterProvider.otherwise("/app/products");

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
            .state("app", {
                url: "/app",
                abstract: true,
                templateUrl: "app/templates/view-menu.html",
                controller: "appCtrl"
            })
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
            }).state("app.products", {
                url: "/products",
                templateUrl: "app/templates/view-products.html",
                controller: "productsCtrl"
                
            }).state("productsuggestion", {
                url: "/productsuggestion",
                templateUrl: "app/templates/view-productsuggestion.html",
                controller: "productsuggestionCtrl"
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
            }).state("legal", {
                url: "/legal",
                templateUrl: "app/templates/view-legal.html",
                controller: "legalCtrl"
            })
            .state("rateapp", {
                url: "/rateapp",
                templateUrl: "app/templates/view-rateapp.html",
                controller: "rateAppCtrl"
            })
            .state("vendorupdate", {
                url: "/vendorupdate",
                templateUrl: "app/templates/view-updatevendor.html",
                controller: "updateVendorCtrl"
            })
            .state("contactus", {
                url: "/contactus",
                templateUrl: "app/templates/view-contactus.html",
                controller: "contactUsCtrl"
            })//.state("addToCart", {
            //    url: "/addToCart",
            //    templateUrl: "app/templates/view-addtocart.html",
            //    controller: "addToCartCtrl"
            //});
        });


})();

