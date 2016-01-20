(function () {
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
            }
        };

        return $customlocalstorage;
    }]).factory('$productlist', ['$http',function ($http) {
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
    }]);


})();


//angular.module('myApp', [])
//    .service('sharedProperties', function () {
//        var property = 'First';

//        return {
//            getProperty: function () {
//                return property;
//            },
//            setProperty: function(value) {
//                property = value;
//            }
//        };
//    });
//Using the service in a controller:

//    function Ctrl2($scope, sharedProperties) {
//        $scope.prop2 = "Second";
//        $scope.both = sharedProperties.getProperty() + $scope.prop2;
//    }