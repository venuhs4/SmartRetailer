(function () {
    "use strict";

    angular.module("myapp.controllers", ['myapp.utils', 'ionic'])

    .controller("appCtrl", ["$scope", function ($scope) {
    }])

    //homeCtrl provides the logic for the home screen
    .controller("homeCtrl", ["$scope", "$state", "$customlocalstorage", "$http", function ($scope, $state, $customlocalstorage, $http) {
        $scope.data = { searchkey : ''};

        $scope.refresh = function () {
            //refresh binding
            $scope.$broadcast("scroll.refreshComplete");
        };
        $scope.search = function () {

            console.log($scope.data.searchkey)
            var keyObj = {
                Key: $scope.data.searchkey,
                device: device.uuid
            };

            var req = {
                method: 'POST',
                url: 'http://localhost:36485/api/parties/key',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(keyObj)
            }

            $http(req).then(function (res) {
                console.log(res.data);
            }, function () {
                console.log("failed");
            });
        };

        $scope.searchSuggestion = function () {

            console.log("suggestion called");
        };
    }])

    //errorCtrl managed the display of error messages bubbled up from other controllers, directives, myappService
    .controller("errorCtrl", ["$scope", "myappService", function ($scope, myappService) {
        //public properties that define the error message and if an error is present
        $scope.error = "";
        $scope.activeError = false;

        //function to dismiss an active error
        $scope.dismissError = function () {
            $scope.activeError = false;
        };

        //broadcast event to catch an error and display it in the error section
        $scope.$on("error", function (evt, val) {
            //set the error message and mark activeError to true
            $scope.error = val;
            $scope.activeError = true;

            //stop any waiting indicators (including scroll refreshes)
            myappService.wait(false);
            $scope.$broadcast("scroll.refreshComplete");

            //manually apply given the way this might bubble up async
            $scope.$apply();
        });
    }]);
})();