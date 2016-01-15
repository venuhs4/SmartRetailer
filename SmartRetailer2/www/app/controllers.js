(function () {
    "use strict";

    angular.module("myapp.controllers", ['myapp.utils', 'ionic'])

    .controller("appCtrl", ["$scope", "$customlocalstorage", "$ionicPopover", "$rootScope", function ($scope, $customlocalstorage, $ionicPopover, $rootScope) {

        $scope.retailer = "";

        $rootScope.$on("CallSetFooterRetailer", function () {
            $scope.setRetailerFooter();
        });

        $scope.setRetailerFooter = function () {
            var retailer = $customlocalstorage.getObject('defaultRetailer');
            console.log("called parent");
            console.log(retailer);
            if (retailer == '{}') {
                retailer = 'No Retailer set!';
            }
            else {
                $scope.retailer = retailer.storename;
                console.log(retailer.storename);
            }
        };

        $scope.setRetailerFooter();

        $ionicPopover.fromTemplateUrl('my-popover.html', {
            scope: $scope
        }).then(function (popover) {
            $scope.popover = popover;
        });

        $scope.openPopover = function ($event) {
            $scope.popover.show($event);
            console.log("openPopover");
        };
        $scope.closePopover = function () {
            $scope.popover.hide();
            console.log("clo-sePopover");
        };
        //Cleanup the popover when we're done with it!
        $scope.$on('$destroy', function () {
            $scope.popover.remove();
            console.log("$destroy");
        });
        // Execute action on hide popover
        $scope.$on('popover.hidden', function () {
            // Execute action
            console.log("hidden");
        });
        // Execute action on remove popover
        $scope.$on('popover.removed', function () {
            // Execute action
            console.log("removed");
        });
    }])

    .controller("registerCtrl", ["$scope", "$state", function ($scope, $state) {
        $scope.iderrormessage = '';
        $scope.user = {
            id: '',
            deviceID: ''
        };

        console.log("registerCtrl");
        $scope.register = function (form) {
            console.log(form);
            $state.go('home');
        };
        $scope.validateID = function () {
            console.log($scope.user.id);
            if ($scope.user.id != null) {
                $scope.iderrormessage = ''
                console.log('not show');
                return false;
            }
            else {
                $scope.iderrormessage = 'not a valid input';
                console.log('show');
                return true;
            }
        }
    }])

    .controller("loginCtrl", ["$scope", "$state", "$customlocalstorage", "$http", function ($scope, $state, $customlocalstorage, $http) {
    $scope.iderrormessage = '';
    $scope.user = {
        id: '',
        deviceID: ''
    };

    console.log("loginCtrl");
    $scope.login = function () {
        $scope.user.deviceID = device.uuid;
        var loginSuccess = false;

        var req = {
            method: 'POST',
            url: 'http://localhost:36485/api/registation',
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify($scope.user)
        }

        $http(req).then(function (res) {
            console.log(res.data);
            if (res.data.registrationStatus == 'OK') {
                loginSuccess = true;
                $customlocalstorage.setObject('registration', $scope.user)
                $customlocalstorage.set('idUserLogedIn', $scope.user.id);
                console.log("CHK:" + $customlocalstorage.get('idUserLogedIn'));
            }
            console.info("registration post success");
        }, function () {
            console.warn("registration post failed");
        });

        if (loginSuccess) {
            $state.go('home');
        }
    };
    $scope.validateID = function () {
        console.log($scope.user.id);
        if ($scope.user.id != null) {
            $scope.iderrormessage = ''
            console.log('not show');
            return false;
        }
        else {
            $scope.iderrormessage = 'not a valid input';
            console.info('show');
            return true;
        }
    }
    $scope.gotoRegistration = function () {
        $state.go('register');
    };
}])

    .controller("homeCtrl", ["$scope", "$state", "$customlocalstorage", "$http", function ($scope, $state, $customlocalstorage, $http) {
    $scope.data = { searchkey: '' };
    $scope.data.choice = '';
    $scope.retailers = null;

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
            $scope.retailers = res.data;

        }, function () {
            console.warn("search post failed");
        });
    };

    $scope.searchSuggestion = function () {

        nconsole.log("suggestion called");
    };

    $scope.setAsDefaultRetailer = function () {
        console.log($customlocalstorage.getObject("defaultRetailer"));

        angular.forEach($scope.retailers, function (value, index) {
            if (value.id == $scope.data.choice) {
                $customlocalstorage.setObject("defaultRetailer", value);
                $state.go('products');
            }
        });

        console.log("set default retailer.");
    }
}])

    .controller("retailersCtrl", ["$scope", "$state", "$customlocalstorage", "$http", '$rootScope', function ($scope, $state, $customlocalstorage, $http, $rootScope) {
    $scope.data = { searchkey: '' };
    $scope.data.choice = '';
    $scope.retailers = null;

    $scope.refresh = function () {
        //refresh binding
        $scope.$broadcast("scroll.refreshComplete");
    };

    $scope.search = function () {
        $scope.retailers = [];
        var searchString = $scope.data.searchkey.toLowerCase();
        var keyObj = {
            Key: $scope.data.searchkey,
            device: device.uuid
        };

        var req = {
            method: 'GET',
            url: 'http://192.168.1.35:8080/retailer/all',
        }

        $http(req).then(function (res) {
            var x = +searchString;
            if (x.toString() === searchString) {
                angular.forEach(res.data, function (item) {
                    if (("" + item.storeaddress.zipCode).toLowerCase().indexOf(searchString) !== -1) {
                        $scope.retailers.push(item);
                    }
                    else {
                        console.log();
                    }
                });
            }
            else {
                angular.forEach(res.data, function (item) {
                    if (item.storename.toLowerCase().indexOf(searchString) !== -1) {
                        $scope.retailers.push(item);
                    }
                });
            }
        }, function () {
            console.warn("search post failed");
        });
    };

    $scope.searchSuggestion = function () {
        console.log("suggestion called");
        $scope.retailers = [];
        var searchString = $scope.data.searchkey.toLowerCase();

        if (searchString == "") {
            $scope.retailers = [];
            return;
        }
        var keyObj = {
            Key: $scope.data.searchkey,
            device: device.uuid
        };

        var req = {
            method: 'GET',
            url: 'http://192.168.1.35:8080/retailer/all',
        }

        $http(req).then(function (res) {
            var x = +searchString;
            if (x.toString() === searchString) {
                angular.forEach(res.data, function (item) {
                    if ((""+item.storeaddress.zipCode).toLowerCase().indexOf(searchString) !== -1) {
                        $scope.retailers.push(item);
                    }
                    else
                    {
                        console.log();
                    }
                });
            }
            else {
                angular.forEach(res.data, function (item) {
                    if (item.storename.toLowerCase().indexOf(searchString) !== -1) {
                        $scope.retailers.push(item);
                    }
                });
            }
        }, function () {
            console.warn("search post failed");
        });
    };

    $scope.closePopover = function () {
        $scope.popover.hide();
        console.log("closePopover from retailer");
    };

    $scope.setAsDefaultRetailer = function () {
        console.log($customlocalstorage.getObject("defaultRetailer"));

        angular.forEach($scope.retailers, function (value, index) {
            if (value.id == $scope.data.choice) {
                $customlocalstorage.setObject("defaultRetailer", value);
                console.log("default reatiler set");
                console.log(value);
                $state.go('app.products');
            }
        });
        $rootScope.$emit("CallSetFooterRetailer", {});
        console.log("set default retailer.");
    };
}])

.controller("productsCtrl", ["$scope", "$state", "$customlocalstorage", "$http", "$ionicPopover", function ($scope, $state, $customlocalstorage, $http, $ionicPopover) {
    $scope.data = { searchkey: '' };
    $scope.data.choice = '';
    $scope.products = null;
    $http.get('http://192.168.1.35:8080/product/all').success(function (res) {
        $scope.products = res;
    });

    $scope.logout = function () {
        localStorage.clear()
        console.log('logout');
        $state.go('register');
    };

    $ionicPopover.fromTemplateUrl('my-popover.html', {
        scope: $scope
    }).then(function (popover) {
        $scope.popover = popover;
    });

    $scope.openPopover = function ($event) {
        $scope.popover.show($event);
        console.log("openPopover");
    };
    $scope.closePopover = function () {
        $scope.popover.hide();
        console.log("closePopover");
    };
    //Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function () {
        $scope.popover.remove();
        console.log("$destroy");
    });
    // Execute action on hide popover
    $scope.$on('popover.hidden', function () {
        // Execute action
        console.log("hidden");
    });
    // Execute action on remove popover
    $scope.$on('popover.removed', function () {
        // Execute action
        console.log("removed");
    });

    $scope.refresh = function () {
        //refresh binding
        $scope.$broadcast("scroll.refreshComplete");
    };

    $scope.search = function () {

        console.log($scope.data.searchkey)
        $http.get('http://192.168.1.35:8080/product/all').success(function (res) {
            $scope.products = res;
        });

    };

    $scope.searchSuggestion = function () {
        console.log("suggestion called");
    };

    $scope.setAsDefaultRetailer = function () {
        console.log($customlocalstorage.getObject("defaultRetailer"));

        angular.forEach($scope.retailers, function (value, index) {
            if (value.id == $scope.data.choice) {
                $customlocalstorage.setObject("defaultRetailer", value);
            }
        });

        console.log("set default retailer.");
    }
}])

.controller("profileCtrl", ["$scope", "$state", "$customlocalstorage", "$http", function ($scope, $state, $customlocalstorage, $http) {
    console.log('profileCtrl');
}])

.controller("ordersCtrl", ["$scope", "$state", "$customlocalstorage", "$http", function ($scope, $state, $customlocalstorage, $http) {
    console.log('ordersCtrl');
}])

.controller("settingsCtrl", ["$scope", "$state", "$customlocalstorage", "$http", function ($scope, $state, $customlocalstorage, $http) {
    console.log('settingsCtrl');
}])

.controller("feedbackCtrl", ["$scope", "$state", "$customlocalstorage", "$http", function ($scope, $state, $customlocalstorage, $http) {
    console.log('feedbackCtrl');
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