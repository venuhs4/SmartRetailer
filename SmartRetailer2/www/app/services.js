﻿(function () {
    "use strict";

    angular.module("myapp.services", []).factory("myappService", ["$rootScope", "$http", function ($rootScope, $http) {
        var myappService = {};

        //starts and stops the application waiting indicator
        myappService.wait = function (show) {
            if (show)
                $(".spinner").show();
            else
                $(".spinner").hide();
        };

        return myappService;
    }]);

    angular.module('myapp.utils', []).factory('$customlocalstorage', ['$window', function ($window) {

        var $customlocalstorage = {
            set: function (key, value) {
                $window.localStorage[key] = value;
            },
            get: function (key, defaultValue) {
                return $window.localStorage[key] || defaultValue;
            },
            setObject: function (key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function (key) {
                return JSON.parse($window.localStorage[key] || '{}');
            },
            getObject: function (key, defaultValue) {
                return JSON.parse($window.localStorage[key] || defaultValue);
            }
        };

        return $customlocalstorage;
    }]).factory('$productlist', ['$http', function ($http) {
        var products = null;
        console.log("get products");
        $http.get("http://192.168.1.35:8080/product").success(function (res) {
            products = res;
            console.log(products);
            console.log("get products success");
        }).then(function () {
        });

        return {
            getProducts: function () {
                return products;
            },
        };
    }]).factory('$categoryTree', ['$http', function ($http) {
        var category = [];
        $http({
            method: "GET",
            url: "http://192.168.1.35:8080/category",
        }).then(function (res) {
            category = res.data;
            angular.forEach(category, function (value, index) {
                $http({
                    method: "GET",
                    url: "http://192.168.1.35:8080/category/segment/" + value.id
                }).then(function (segmentsRes) {
                    category[index].segments = segmentsRes.data;
                    angular.forEach(category[index].segments, function (value2,index2) {
                        $http({
                            method: "GET",
                            url: "http://192.168.1.35:8080/category/segment/subsegment/" + value2.id
                        }).then(function (subsegmentsRes) {
                            category[index].segments[index2].subsegment = subsegmentsRes.data;
                        });
                    });
                });
            });
        }, function () {
        });
        return {
            getTree: function () {
                return category;
            },
        };
    }])
    ;
})();
