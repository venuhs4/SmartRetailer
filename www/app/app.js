﻿/// <reference path="templates/view-product-detail.html" />
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
                //   AppRate.promptForRating(true);
            });
        })
        .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

            var isUserLogedIn = localStorage['isUserLogedIn'];
            var isDefaultRetailerSet = localStorage['defaultRetailer'];

            $ionicConfigProvider.views.forwardCache(true);
            $urlRouterProvider.otherwise("/register");

            if (isUserLogedIn == null) {
                console.warn("user not loged in");
                $urlRouterProvider.otherwise("/login");
            }
            else if (isDefaultRetailerSet == null) {
                console.warn("default retailer not set");
                $urlRouterProvider.otherwise("/retailers");
            }
            else {
                console.info('everything set');
                $urlRouterProvider.otherwise("/app/products");
            }
            $stateProvider
            .state("app", {
                url: "/app",
                abstract: true,
                templateUrl: "app/templates/view-menu.html",
                controller: "appCtrl"
            })
            .state('app.changelocation', {
                url: "/changelocation",
                templateUrl: "app/templates/view-change-my-location.html",
                controller: "changeLocationCtrl"
            })
            .state("initial", {
                url: "/initial",
                templateUrl: "app/templates/view-initial.html",
                controller: "initialCtrl"
            })
            .state("register", {
                url: "/register",
                params: { retailerID: '', phoneNo: '' },
                templateUrl: "app/templates/view-register.html",
                controller: "registerCtrl"
            })
            .state("login", {
                url: "/login",
                templateUrl: "app/templates/view-login.html",
                controller: "loginCtrl"
            })
            .state("app.retailers", {
                url: "/retailers",
                templateUrl: "app/templates/view-retailers.html",
                params: { phoneNo: '' },
                controller: "retailersCtrl"
            })
            .state("home", {
                url: "/home",
                templateUrl: "app/templates/view-home.html",
                controller: "homeCtrl"
            })
            .state("app.products", {
                url: "/products",
                templateUrl: "app/templates/view-products.html",
                controller: "productsCtrl"

            })
            .state("app.productdetail", {
                url: "/productdetail",
                templateUrl: "app/templates/view-product-detail.html",
                controller: "productDetailCtrl"
            })
            .state("app.productsuggestion", {
                url: "/productsuggestion",
                templateUrl: "app/templates/view-productsuggestion.html",
                controller: "productsuggestionCtrl"
            })
            //.state("app.viewprofile", {
            //    url: "/viewprofile",
            //    templateUrl: "app/templates/view-viewprofile.html",
            //    controller: "viewprofileCtrl"
            //})
            .state("app.orders", {
                url: "/orders",
                templateUrl: "app/templates/view-orders.html",
                controller: "ordersCtrl"
            })
            .state("app.orderDetail", {
                url: '/orderdetails',
                templateUrl: "app/templates/view-order-detail.html",
                controller: 'orderDetailCtrl',
                params: {
                    orderID: ''
                }
            })
            .state("app.settings", {
                url: "/settings",
                templateUrl: "app/templates/view-settings.html",
                controller: "settingsCtrl"
            })
            .state("app.feedback", {
                url: "/feedback",
                templateUrl: "app/templates/view-feedback.html",
                controller: "feedbackCtrl"
            })
            .state("app.legal", {
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
            .state("app.contactus", {
                url: "/contactus",
                templateUrl: "app/templates/view-contactus.html",
                controller: "contactUsCtrl"
            })
            .state("app.addToCart", {
                url: "/addToCart",
                templateUrl: "app/templates/view-addtocart.html",
                controller: "addToCartCtrl"
            })
            .state("app.editProfile", {
                url: "/editProfile",
                templateUrl: "app/templates/view-editprofile.html",
                controller: "editprofileCtrl"
            })
            .state("app.viewprofile", {
                url: "/viewprofile",
                templateUrl: "app/templates/view-viewprofile.html",
                controller: "viewprofileCtrl"
            })
            .state("app.wishlist", {
                url: "/wishlist",
                templateUrl: "app/templates/view-wishlist.html",
                controller: "wishlistCtrl"
            })
            .state("app.bannerdetails", {
                url: "/bannerdetails",
                templateUrl: "app/templates/view-banner-detail.html",
                controller: "bannerDetailsCtrl",
                params: {
                    bannerID: 'default',
                },
            })
            ;
        });
})();

