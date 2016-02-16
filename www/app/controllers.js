(function () {
    "use strict";

    angular.module("myapp.controllers", ['myapp.utils', 'ionic', 'ngCordova', 'ionic-toast'])

    .controller("appCtrl", ["$scope", "$customlocalstorage", "$ionicPopover", "$rootScope", "$http", "$state", "$filter", "$cordovaGeolocation", "$popupService", "ionicToast", "$config", "$Location", "$ionicLoading", function ($scope, $customlocalstorage, $ionicPopover, $rootScope, $http, $state, $filter, $cordovaGeolocation, $popupService, ionicToast, $config, $Location, $ionicLoading) {
        $scope.retailer = "";
        $scope.category = [];
        $scope.categorySelection = {
            category: '',
            segment: '',
            subSegment: ''
        }
        $scope.shownSeg = null;
        console.log($scope.sampleData);

        navigator.geolocation.getCurrentPosition(function (pos) {
            console.log(pos);
            //$ionicLoading.hide();
        }, function (error) {
            alert('Unable to get location: ' + error.message);
        });
       

        //var deviceInfo = cordova.require("cordova/plugin/DeviceInformation");
        //deviceInfo.get(function (result) {
        //    console.log("result = " + result);
        //}, function () {
        //    console.log("error");
        //});

        $scope.parentProducts = {
            products: []
        };
        $scope.parentObj = {
            cartCount: $customlocalstorage.getObject('cartlist', '[]').length,
            prods: ["sdfdsfsd", "dfds"],
            selectedProduct: {}
        };

        $http({
            method: "GET",
            url: 'http://' + $config.IP_PORT + '/category',
        }).then(function (res) {
            $scope.category = res.data;
            console.log("category success1");
        }, function () {
            console.log("category request failed");
        });
        $scope.getProducts = function (id1, id2, id3, subSegName) {
            $ionicLoading.show({
                template: "Loading products...",
            });
            $scope.categorySelection.subSegment = subSegName;
            console.log($scope.categorySelection);
            $http({
                method: "GET",
                url: 'http://' + $config.IP_PORT + '/product/category/' + id1 + '/segment/' + id2 + '/subsegment/' + id3,
            }).success(function (res) {
                $ionicLoading.hide();
                console.log("success");
                $scope.parentProducts.products = res;
                $scope.parentObj.prods.push(res);
                console.log($scope.parentProducts.products);
            });
        }
        $scope.loadSegments = function (cat) {
            $scope.categorySelection.category = cat.name;
            if ($scope.shownGroup === cat && cat.segments === undefined) {
                $http({
                    method: "GET",
                    url: 'http://' + $config.IP_PORT + '/category/segment/' + cat.id,
                }).then(function (res) {
                    cat.segments = res.data;
                });
            }
        };
        $scope.loadSubSegments = function (seg) {
            $scope.categorySelection.segment = seg.segmentname;
            if ($scope.shownSeg === seg && seg.subSegments === undefined) {
                $http({
                    method: "GET",
                    url: 'http://' + $config.IP_PORT + '/category/segment/subsegment/' + seg.id,
                }).then(function (res) {
                    seg.subSegments = res.data;
                    console.log(seg.subSegments);
                });
            }
        };
        $scope.toggleGroup = function (group) {
            if ($scope.isGroupShown(group)) {
                console.log("if toggle");
                $scope.shownGroup = null;
            } else {
                console.log("else toggle");
                $scope.shownGroup = group;
            }
            console.log(group);
        };
        $scope.isGroupShown = function (group) {
            if ($scope.shownGroup === group) {
                return true;
            }
            else {
                return false;
            }
        };
        $scope.toggleSeg = function (group) {
            if ($scope.isSegShown(group)) {
                console.log("if toggle");
                $scope.shownSeg = null;
            } else {
                console.log("else toggle");
                $scope.shownSeg = group;
            }
            console.log(group);
        };
        $scope.isSegShown = function (group) {
            if ($scope.shownSeg === group) {
                return true;
            }
            else {
                return false;
            }
        };

        $rootScope.$on("CallSetFooterRetailer", function () {
            $scope.setRetailerFooter();
        });

        $scope.onProductClick = function (item) {
            console.log(item);
            $scope.parentObj.selectedProduct = item;
            $state.go("app.productdetail");
        };

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
            console.log("openPo-pover");
        };
        $scope.closePopover = function () {
            $scope.popover.hide();
            console.log($scope.popover);
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

        $scope.getsmiley = function () {
            console.log("smiley called");

            var reqObj = {
                date: $filter('date')(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                customerId: $config.CONSUMER_ID,
                orderId: localStorage['lastOrderID'] | '',
                rate: 3,
                uuid: device.uuid,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded;' }
            };
            $http.put('http://' + $config.IP_PORT + '/satisfaction/add/' + reqObj.date + '/' + reqObj.rate + '/' + reqObj.customerId + '/' + reqObj.orderId)
            .success(function () {
                ionicToast.show('Thank you for liking us!', 'middle', false, 1000);
            })
            console.log('smiley submitted with data');
        }
    }
    ])

    .controller("changeLocationCtrl", ["$scope", "$customlocalstorage", "$state", "$popupService", "$stringResource", "$compile", "$ionicLoading", function ($scope, $customlocalstorage, $state, $popupService, $stringResource, $compile, $ionicLoading) {

        $ionicLoading.show({
            template: '<ion-spinner></ion-spinner>Getting current location...',
            showBackdrop: true
        });
        navigator.geolocation.getCurrentPosition(function (pos) {
            console.log(pos);
            $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
                map: map,
                title: 'Uluru (Ayers Rock)'
            });
            $ionicLoading.hide();
        }, function (error) {
            alert('Unable to get location: ' + error.message);
        });

        var mapOptions = {
            center: new google.maps.LatLng(0, 0),
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map"),
            mapOptions);

        

        $scope.map = map;
        $scope.centerOnMe = function () {
            if (!$scope.map) {
                return;
            }

            $scope.loading = $ionicLoading.show({
                template: 'Getting current location...',
                showBackdrop: true
            });

            navigator.geolocation.getCurrentPosition(function (pos) {
                $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
                $ionicLoading.hide();
            }, function (error) {
                alert('Unable to get location: ' + error.message);
            });
        };

        $scope.clickTest = function () {
            alert('Example of infowindow with ng-click')
        };
    }])

    .controller("initialCtrl", ["$scope", "$customlocalstorage", "$state", "$popupService", "$stringResource", function ($scope, $customlocalstorage, $state, $popupService, $stringResource) {
        $scope.data = {
            agree: true
        };
        $scope.proceed = function () {
            if ($scope.data.agree) {
                $state.go("retailers");
            }
            else {
                var value = $stringResource.getValue('AgreeTerms');
                $popupService.showAlert("<b>Alert!</b>", value);
            }
        };
        $scope.gotoRetailers = function () {
            $state.go("retailers");
        }
    }])

    .controller("registerCtrl", ["$scope", "$state", "$http", "$popupService", "$stateParams", "$filter", "$config", "$cordovaGeolocation", "$customlocalstorage",
    function ($scope, $state, $http, $popupService, $stateParams, $filter, $config, $cordovaGeolocation, $customlocalstorage) {
        $scope.iderrormessage = '';
        console.log($stateParams.phoneNo);
        $scope.retailerID = $stateParams.retailerID;
        $scope.retailerID = '19';
        $scope.user = {
            id: '',
            deviceID: ''
        };
        $scope.form = {
            gender: "Male",
            mobileNo: $stateParams.phoneNo
        };

        $scope.validateForm = function () {
            var popupContent = '';
            if ($scope.form.firstName === undefined || $scope.form.firstName.length < 3) {
                popupContent = popupContent.concat("<li>First name must have correct value.</li>");
            }
            if ($scope.form.surname === undefined || $scope.form.firstName.length < 3) {
                popupContent = popupContent.concat("<li>Last name must have correct value.</li>");
            }
            if ($scope.form.email === undefined || !$scope.form.email.match(/^[\w|\d|\._]{4,}@[\w|\d|\._]{2,}\.[\w|\d|\._]+$/g)) {
                popupContent = popupContent.concat("<li>Enter Correct email address</li>");
            }
            if ($scope.form.mobileNo === undefined || !$scope.form.mobileNo.match(/^(\+\d{1,3})?-?\d{10}$/)) {
                popupContent = popupContent.concat("<li>Enter correct phone number</li>");
            }
            if ($scope.form.password === undefined || $scope.form.password.length < 5) {
                popupContent = popupContent.concat("<li>Enter the correct password</li>");
            }
            if ($scope.form.againpassword !== $scope.form.password) {
                popupContent = popupContent.concat("<li>Passwords do not match</li>");
            }

            if (popupContent !== '') {
                $popupService.showAlert('Validation Error<i class="icon item-icon-left"></i>', popupContent);
            }
            else {
                return true;
            }

            return false;
        }
        $scope.register = function (form) {

            if ($scope.validateForm()) {
                console.log(form);

                var reqObj =
                    {
                        mobileNo: $scope.form.mobileNo,
                        deviceId: device.uuid,
                        name: $scope.form.firstName + ' ' + $scope.form.surname,
                        //gender: $scope.form.gender == "Male" ? "M" : "F",
                        dateOfBirth: $scope.form.dateOfBirth,
                        latitude: "",
                        longitude: "",
                        mailId: $scope.form.email,
                        passWord: $scope.form.password,
                        retailer: {
                            id: $scope.retailerID
                        },
                        residenceaddress: {
                            zipCode: $scope.form.zipcode,
                            street: $scope.form.street
                        },
                        preference: {
                            deliveryTime: $filter('date')(new Date(), 'yyyy-MM-dd'),
                            paymentMode: "cash"
                        },
                        consumerPhone: [{
                            contactType: "PRIMARY",
                            phoneNumber: $scope.form.mobileNo,
                            type: "MOBILE"
                        }]
                    };


                $cordovaGeolocation.getCurrentPosition({
                    enableHighAccuracy: true,
                    timeout: 20000,
                    maximumAge: 0
                }).then(function (position) {
                    reqObj.latitude = position.coords.latitude;
                    reqObj.longitude = position.coords.longitude;
                }, function (err) {
                    console.log("position fail");
                    console.log(err);
                });

                console.log(reqObj);

                var req = {
                    method: 'POST',
                    url: 'http://' + $config.IP_PORT + '/consumer/create',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify(reqObj)
                }

                $http(req).then(function (res) {
                    console.log(res.data);
                    if (res.data.status == '1') {
                        $customlocalstorage.setObject('registration', res.data.id);
                        $customlocalstorage.set('isUserLogedIn', 'true');
                        $customlocalstorage.setObject('constomer', reqObj);
                        localStorage['consumerId'] = res.data.id;
                        $state.go("app.products");
                    }
                    else {
                        $popupService.showAlert('Registration Fail', res.data.message)
                    }
                }, function (err) {
                    console.warn(err);
                });
            }
        };
        $scope.toogleGender = function () {
            if ($scope.form.gender == "Male") {
                $scope.form.gender = "Female";
            }
            else {
                $scope.form.gender = "Male";
            }
        };
        $scope.validateID = function () {
            console.log($scope.user.id);
            if ($scope.user.id != null) {
                $scope.iderrormessage = ''
                //console.log('not show');
                return false;
            }
            else {
                $scope.iderrormessage = 'not a valid input';
                console.log('show');
                return true;
            }
        }
    }])

    .controller("loginCtrl", ["$scope", "$state", "$customlocalstorage", "$http", "$popupService", "$stringResource", "$config", function ($scope, $state, $customlocalstorage, $http, $popupService, $stringResource, $config) {
        $scope.data = {};
        $scope.proceed = function () {
            $http.post('http://' + $config.IP_PORT + '/user/login', {
                mobileNo: $scope.data.phone,
                uuid: device.uuid
            }).then(function (res) {
                console.log(res.data);
                if (res.data.status === "1") {
                    $customlocalstorage.setObject('defaultRetailer', res.data.retailer);
                    $popupService.showAlert('Success', 'Login success! The retailer <b>' + res.data.retailer.storename + '</b> has been set as default.')
                        .then(function () {
                            localStorage['isUserLogedIn'] = 'true';
                            localStorage['consumerId'] = res.data.user_id;
                            $state.go('app.products');
                        });
                }
                else if (res.data.status === "0") {
                    //$popupService.showAlert(res.data.message, $stringResource.getValue('invalid-user'));
                    $http.get('http://' + $config.IP_PORT + '/invitation/' + $scope.data.phone).then(function (res) {
                        console.log(res.data);
                        if (res.data.status === "1") {
                            $popupService.showAlert('Invitation', 'You have got an Invitation from the retailer <b>' + res.data.invitation.retailer.storename + '</b>. The retailer will be set as a Default retailer.');
                            $customlocalstorage.setObject('defaultRetailer', res.data.invitation.retailer);
                            $state.go('register', { retailerID: res.data.invitation.retailer.id, phoneNo: $scope.data.phone });
                        }
                        else {
                            $state.go('app.retailers', { phoneNo: $scope.data.phone });
                        }
                    });
                }
                else {
                    $popupService.showAlert('Oops!', 'Some thing went wrong! ' + JSON.stringify(res.data.message));
                }
            }, function (err) {
                $popupService.showAlert('Error', err);
            });
        };
    }])

    .controller("homeCtrl", ["$scope", "$state", "$customlocalstorage", "$http", "$stateParams", function ($scope, $state, $customlocalstorage, $http, $stateParams) {
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
                    $state.go('app.products');
                }
            });

            console.log("set default retailer.");
        }
    }])

    .controller('bannerDetailsCtrl', ["$scope", "$stateParams", "$state", function ($scope, $stateParams, $state) {
        $scope.id = $stateParams.bannerID;
        // console.log($stateParams.bannerID);
    }])

    .controller("retailersCtrl", ["$scope", "$state", "$customlocalstorage", "$http", '$rootScope', '$config', 'ionicToast', '$stateParams', function ($scope, $state, $customlocalstorage, $http, $rootScope, $config, ionicToast, $stateParams) {
        $scope.data = {
            searchkey: '',
            suggestions: [],
            isSuggestionShown: false,
            isSearchResultShown: false,
            retailers: []
        };
        $scope.data.choice = '';
        $scope.phoneNo = $stateParams.phoneNo;
        console.log($scope.phoneNo);
        $scope.refresh = function () {
            //refresh binding
            $scope.$broadcast("scroll.refreshComplete");
        };
        $scope.search = function (header, value) {
            $scope.data.isSearchResultShown = true;
            $scope.data.isSuggestionShown = false;
            var url = '';
            if (header === 'StoreName') {
                url = 'http://' + $config.IP_PORT + '/retailer/storename/' + value;
            } else if (header === 'Area') {
                url = 'http://' + $config.IP_PORT + '/retailer/area/' + value;
            } else if (header === 'Pincode') {
                url = 'http://' + $config.IP_PORT + '/retailer/pincode/' + value;
            }

            $http.get(url)
               .then(function (res) {
                   $scope.data.retailers = res.data;
               }, function () { });

        };
        $scope.searchSuggestion = function () {
            $scope.data.isSuggestionShown = true;
            $scope.data.isSearchResultShown = false;

            if ($scope.data.searchkey === '') {
                $scope.data.suggestions = [];
                return;
            }

            $http.get('http://' + $config.IP_PORT + '/retailer/suggestion/1/' + $scope.data.searchkey)
                .then(function (res) {
                    $scope.data.suggestions = res.data;
                    console.log(res.data);
                }, function (err) {
                    console.log(err);
                });

            console.log("suggestion called");

        };
        $scope.closePopover = function () {
            $scope.popover.hide();
            console.log("closePopover from retailer");
        };
        $scope.setAsDefaultRetailer = function () {
            console.log($customlocalstorage.getObject("defaultRetailer"));
            angular.forEach($scope.data.retailers, function (value, index) {
                if (value.id == $scope.data.choice) {

                    $http({
                        url: 'http://' + $config.IP_PORT + '/consumer/setDefaultRetailer/' + 12 + '/' + value.id,
                        method: 'PUT'
                    }).then(function (res) {
                        console.log(res);
                        if (res.status === 200) {
                            $customlocalstorage.setObject("defaultRetailer", value);
                            console.log(value.storename);
                            var setStoreName = value.storename;
                            ionicToast.show("Your default Retailer has been changed to " + value.storename.toUpperCase(), "middle", false, 2500);
                            console.log("default reatiler set");
                            console.log(value);
                            if (localStorage['isUserLogedIn'] !== 'true') {
                                $state.go('register', { retailerID: value.id, phoneNo: $scope.phoneNo });
                            }
                            else {
                                $state.go('app.products');
                            }

                        }
                        else {
                            ionicToast.show("Oops! Default Retailer not set", "middle", false, 2500);
                        }
                    }, function (err) {
                        console.log(err);
                        ionicToast.show("Oops! Default Retailer not set", "middle", false, 2500);
                    });
                }
            });
            $rootScope.$emit("CallSetFooterRetailer", {});
            console.log("set default retailer.");
        };
    }])

    .controller("productsCtrl", ["$scope", "$state", "$customlocalstorage", "$http", "$ionicPopover", "$productlist", "$window", "$ionicSlideBoxDelegate", "$popupService", function ($scope, $state, $customlocalstorage, $http, $ionicPopover, $productlist, $window, $ionicSlideBoxDelegate, $popupService) {
        $scope.data = { searchkey: '' };
        $scope.parentObj.products = $productlist.getProducts();
        $scope.popupData = {
            confirm: false,
            resposneData: ''
        };

        $ionicSlideBoxDelegate.slide(0);
        $ionicSlideBoxDelegate.enableSlide(2000);
        //$ionicSlideBoxDelegate.update();
        //$scope.$apply();

        //var defaultRequest = $http.get('http://'+$config.IP_PORT+'/product').success(function (res) {
        //    $scope.products = res;
        //     console.log(res)
        //});
        $scope.showBannerDetails = function (id) {
            $state.go('app.bannerdetails', { bannerID: id });
            console.log(id);
        };
        $scope.showPopup = function () {
            var ret = $popupService.showConfirm("Title", "Templete", $scope.popupData);
            ret.then(function (e) {
                console.log("then");
                console.log($scope.popupData.confirm);
            });
        };
        $scope.showAlert = function () {

            $http.get("http://www.google.com").then(function (res) {
                $popupService.showAlert("Success", JSON.stringify(res.data));
            }, function (res) {
                $popupService.showAlert("Fail", JSON.stringify(res));
            })
            //var ret = $popupService.showAlert("Title", "This is the text from the called method. This the test to make the text <b>BOLD</>.");
        };
        $scope.search = function () {

            $scope.products = [];
            console.log($scope.data.searchkey)
            $window.location = "#/view-productsuggestion.html";

            //var req = $http.get('data/products.json').success(function (res) {
            var req = {
                method: 'GET',
                url: 'http://' + $config.IP_PORT + '/product',
            }
            //  $scope.products = res;
            var searchString = $scope.data.searchkey.toLowerCase();
            var keyObj = {
                Key: $scope.data.searchkey,
                device: device.uuid
            };

            $http(req).then(function (res) {
                var x = +searchString;
                if (x.toString() === searchString) {
                    angular.forEach(res.data, function (item) {
                        if (("" + item.name).toLowerCase().indexOf(searchString) !== -1) {

                            $scope.products.push(item);

                        }
                        else {
                            console.log();
                        }
                    });
                }
                else {
                    angular.forEach(res.data, function (item) {
                        if (item.name.toLowerCase().indexOf(searchString) !== -1) {
                            $scope.products.push(item);
                        }
                    });
                }
            }, function () {
                console.warn("search post failed");
            });

            // console.log(res)
            //  });

        };

        $scope.searchSuggestion = function () {

            console.log("suggestion called");
            $scope.productsSuggest = [];

            //  $window.location.href = 'app/templates/view-productsuggestion.html';

            var searchString = $scope.data.searchkey.toLowerCase();


            if (searchString == "") {
                $scope.productsSuggest = [];
                return;
            }
            var keyObj = {
                Key: $scope.data.searchkey,
                device: device.uuid
            };

            var req = {
                method: 'GET',
                url: 'http://' + $config.IP_PORT + '/product',
            }

            $http(req).then(function (res) {
                var x = +searchString;
                if (x.toString() === searchString) {
                    angular.forEach(res.data, function (item) {
                        if (("" + item.name).toLowerCase().indexOf(searchString) !== -1) {

                            $scope.productsSuggest.push(item);

                        }
                        else {
                            console.log();
                        }
                    });
                }
                else {
                    angular.forEach(res.data, function (item) {
                        if (item.name.toLowerCase().indexOf(searchString) !== -1) {
                            var datacaptured = $scope.productsSuggest.push(item);
                        }
                    });
                }
            }, function () {
                console.warn("search post failed");
            });
        };
        $scope.changeSlide = function (index) {
            console.log(index);
            $ionicSlideBoxDelegate.slide(index);
        };

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
        //$scope.closePopover = function () {
        //    $scope.popover.hide();
        //    console.log("closePopover");
        //};
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
            console.log("refresh");
            $scope.$broadcast("scroll.refreshComplete");
        };
        $scope.gotoWishlist = function () {
            $state.go('app.wishlist');
        };
        $scope.gotoOrders = function () {
            $state.go('app.orders');
        };
        //$scope.setAsDefaultRetailer = function () {
        //    console.log($customlocalstorage.getObject("defaultRetailer"));

        //    angular.forEach($scope.retailers, function (value, index) {
        //        if (value.id == $scope.data.choice) {
        //            $customlocalstorage.setObject("defaultRetailer", value);
        //        }
        //    });

        //    console.log("set default retailer.");
        //}
    }])

    .controller("productsuggestionCtrl", ["$scope", "$state", "$customlocalstorage", "$http", "ionicToast", '$config', '$filter', "$ionicLoading", function ($scope, $state, $customlocalstorage, $http, ionicToast, $config, $filter, $ionicLoading) {
        console.log('productsuggestionCtrl');
        $scope.data = { searchkey: '' };
        $scope.productList = [];
        $scope.searchList = [];
        $scope.productDetailList = $scope.parentProducts.products;
        $scope.suggestionShow = false;
        $scope.productShow = false;
        $scope.categoryProductShow = true;
        $scope.productCount = 0;
        $scope.recentSearch = $customlocalstorage.getObjectorDefault('recentSearch', '[]');

        $scope.searchSuggestion = function () {
            $scope.suggestionShow = true;
            $scope.productShow = false;
            $scope.categoryProductShow = false;
            var productToCache = [];
            $scope.searchList = [];
            $http.get('http://' + $config.IP_PORT + '/product/suggestion/' + $scope.data.searchkey).then(function (res) {
                $scope.searchList = res.data;
            });

        };
        $scope.suggestionClick = function (text) {
            $ionicLoading.show({
                template: "<p>Products Loading..</p>",
            });
            $scope.suggestionShow = false;
            $scope.productShow = true;
            $scope.categoryProductShow = false;
            $scope.productCache = [];

            var productsReq = {
                method: 'GET',
                url: 'http://' + $config.IP_PORT + '/product/search/' + text,
            }

            $http(productsReq).then(function (res) {
                $ionicLoading.hide();
                $scope.productDetailList = res.data;
                $scope.productCache = $customlocalstorage.getObjectorDefault('recentSearch', '[]');
                var foundFlag = false;
                angular.forEach($scope.productCache, function (value, index) {
                    if (value.key === text) {
                        foundFlag = true;
                        $scope.productCache[index].hitCount++;
                    }
                });
                if (!foundFlag) {
                    $scope.productCache.push({ key: text, hitCount: 1 });
                }
                $scope.productCache = $filter('orderBy')($scope.productCache, 'hitCount', true);

                $customlocalstorage.setObject("recentSearch", $scope.productCache);
            }, function () {
                console.warn("search post failed");
            });
        };
        $scope.minusQty = function (id) {
            console.log(cartList);
            var cartList = $customlocalstorage.getObjectorDefault('cartlist', '[]');
            var found = false;
            angular.forEach(cartList, function (value, index) {
                if (value.productId === id) {
                    found = true;
                    if (cartList[index].Qty <= 1) {
                        cartList.splice(index, 1);
                    }
                    else if (cartList[index].Qty != 0) {
                        cartList[index].Qty--;
                    }
                    else if (cartList[index].Qty == 0) {
                        $scope.productShow = false;
                        console.log("cleared");
                    }
                }
            });
            $scope.parentObj.cartCount = cartList.length;
            console.log($scope.parentObj.cartCount)
            $customlocalstorage.setObject('cartlist', cartList);
            console.log(cartList);
        };
        $scope.plusQty = function (id) {
            console.log(cartList);
            var cartList = $customlocalstorage.getObjectorDefault('cartlist', '[]');
            var found = false;
            angular.forEach(cartList, function (value, index) {
                if (value.productId === id) {
                    found = true;
                    cartList[index].Qty++;
                }
            });
            if (found == false) {
                cartList.push({
                    'productId': id,
                    'Qty': 1
                });
            }
            $scope.parentObj.cartCount = cartList.length;
            console.log($scope.parentObj.cartCount)
            $customlocalstorage.setObject('cartlist', cartList);
        };
        $scope.returnNumber = function (itemid) {
            var cartList = $customlocalstorage.getObject('cartlist', '[]');
            var qty = 0;
            angular.forEach(cartList, function (value, index) {
                if (value.productId == itemid) {
                    qty = value.Qty;
                }
            });
            return qty;
        };
        $scope.isFavourite = function (itemid) {
            var wishlist = $customlocalstorage.getObjectorDefault('wishlist', '[]');
            var found = false;
            angular.forEach(wishlist, function (value, index) {
                if (value.id === itemid) {
                    found = true;
                }
            });
            return found;
        }
        $scope.toggleFavourite = function (item) {
            var wishlist = [];
            var wishlist = $customlocalstorage.getObjectorDefault('wishlist', '[]');
            var found = false;
            angular.forEach(wishlist, function (value, index) {
                if (value.id === item.id) {
                    found = true;
                    wishlist.splice(index, 1);
                    ionicToast.show('<b>' + item.name + '</b> removed from Wishlist', 'bottom', false, 2000);
                }
            });
            if (!found) {
                wishlist.push(item);
                ionicToast.show('<b>' + item.name + '</b> added to Wishlist', 'bottom', false, 2000);
            }
            $customlocalstorage.setObject('wishlist', wishlist);
        }
    }])

    .controller("productDetailCtrl", ["$scope", function ($scope) {
        $scope.product = { Name: "sdfdsf" };
    }])

    .controller("addToCartCtrl", ["$scope", "$state", "$customlocalstorage", "$http", "$filter", "$popupService", "$stringResource", "ionicToast", '$config','$ionicLoading',
    function ($scope, $state, $customlocalstorage, $http, $filter, $popupService, $stringResource, ionicToast, $config, $ionicLoading) {
        $scope.displayProductDetailList = [];
        $scope.initProductDetailList = [];
        angular.forEach($customlocalstorage.getObjectorDefault('cartlist', '[]'), function (value, index) {
            $ionicLoading.show({
                template: "Loading Items...",
                duration: 5000
            });
            var req = {
                method: 'GET',
                url: 'http://' + $config.IP_PORT + '/product/' + value.productId,
            }
            $http(req).then(function (res) {
                $scope.initProductDetailList.push(res.data);
                $scope.displayProductDetailList.push(res.data);
                $ionicLoading.hide();
            }, function () {
                console.warn("search post failed");
            });
        });

        $scope.data = {
            confirm: false
        };
        $scope.placeOrder = function () {
            $popupService.showConfirm("Order Confirmation", $stringResource.getValue("orderconfirm"), $scope.data)
            .then(function () {
                if ($scope.data.confirm) {
                    $ionicLoading.show({
                        template: "Placing Order. Please wait...",
                    });
                    var cartList = $customlocalstorage.getObject('cartlist', '[]');
                    if (cartList.length <= 0) {
                        $popupService.showAlert("No Items in the Cart! Please add some items");
                    }
                    var orderData = {
                        orderDate: $filter('date')(new Date(), 'yyyy-MM-dd'),
                        customerId: $config.CONSUMER_ID,
                        status: 0,
                        orderRequiredDate: $filter('date')(new Date(), 'yyyy-MM-dd'),
                        orderItems: []
                    };

                    angular.forEach(cartList, function (value, index) {
                        orderData.orderItems.push({
                            productId: value.productId,
                            productName: "Get product name by ID",
                            count: value.Qty
                        });
                    });

                    var orderReq = {
                        url: 'http://' + $config.IP_PORT + '/order/placeOrder',
                        method: "POST",
                        data: JSON.stringify(orderData)
                    };
                    console.log(orderData);
                    $http(orderReq).success(function (res) {
                        console.log(res);
                        $popupService.showAlert('Order Request', 'Your order submitted successfully!(#' + res.orderId + ')');
                        $ionicLoading.hide();
                        localStorage['lastOrderID'] = res.orderId;
                        $customlocalstorage.setObject('cartlist','[]');
                    }).then(
                    function (data) {
                        console.log(data);
                    });
                }
            });
        };
        $scope.updateCartList = function () {
            var cartList = $customlocalstorage.getObjectorDefault('cartlist', []);
            $scope.displayProductDetailList = [];
            angular.forEach($scope.initProductDetailList, function (value, index) {
                if ($scope.returnNumber(value.id) !== 0) {
                    $scope.displayProductDetailList.push(value);
                }
            });
            console.log($scope.displayProductDetailList);
        }

        $scope.returnNumber = function (itemid) {
            var cartList = $customlocalstorage.getObjectorDefault('cartlist', '[]');
            var qty = 0;
            angular.forEach(cartList, function (value, index) {
                if (value.productId == itemid) {
                    qty = value.Qty;
                }
            });
            return qty;
        };
        $scope.minusQty = function (id) {
            console.log(cartList);
            var cartList = $customlocalstorage.getObject('cartlist', '[]');
            var found = false;
            angular.forEach(cartList, function (value, index) {
                if (value.productId === id) {
                    found = true;
                    if (cartList[index].Qty <= 1) {
                        cartList.splice(index, 1);
                    }
                    else if (cartList[index].Qty != 0) {
                        cartList[index].Qty--;
                    }
                }
            });
            $scope.parentObj.cartCount = cartList.length;
            $customlocalstorage.setObject('cartlist', cartList);
            $scope.updateCartList();
        };
        $scope.plusQty = function (id) {
            console.log(cartList);
            var cartList = $customlocalstorage.getObject('cartlist', '[]');
            var found = false;
            angular.forEach(cartList, function (value, index) {
                if (value.productId === id) {
                    found = true;
                    cartList[index].Qty++;
                }
            });
            if (found == false) {
                cartList.push({
                    'productId': id,
                    'Qty': 1
                });
            }
            $scope.parentObj.cartCount = cartList.length;
            $customlocalstorage.setObject('cartlist', cartList);
            $scope.updateCartList();
        };
    }])

    .controller("wishlistCtrl", ["$scope", "$state", "$customlocalstorage", "$http", "$filter", "$popupService", "$stringResource", '$config', function ($scope, $state, $customlocalstorage, $http, $filter, $popupService, $stringResource, $config) {
        $scope.wishlist = $customlocalstorage.getObjectorDefault('wishlist', '[]');
    }])

    .controller("profileCtrl", ["$scope", "$state", "$customlocalstorage", "$http", '$cordovaCamera', '$popupService', '$config', function ($scope, $state, $customlocalstorage, $http, $cordovaCamera, $popupService, $config) {
        $scope.imageInfo = [];

        navigator.camera.getPicture(function (imageData, vals) {
            console.log(imageData);
            console.log(vals);
            var imageBase64 = "image base64 data";
            var blob = new Blob([imageBase64], { type: 'image/png' });
            console.log(blob);
            var file = new File([imageData], 'imageFileName.png');
            console.log(file);
            $scope.imageInfo = imageData;
            $http({
                method: 'POST',
                url: 'http://' + $config.IP_PORT + '/consumer/uploadImageFile/',
                headers: { 'Content-Type': false },
                transformRequest: function (data) {
                    var formData = new FormData();
                    formData.append("consumer_id", '12');
                    formData.append('image_file', blob);
                    return formData;
                },
                data: {}
            }).then(function (res) {
                console.log(res);
                $popupService.showAlert('RESPONSe', res);
            });

        }, function (err) {
            console.log(err);
            $popupService.showAlert('Error', err);
        }, {
            quality: 50,
            destinationType: Camera.DestinationType.FILE_URI
        });

        $scope.dataURItoBlob = function (dataURI) {
            // convert base64/URLEncoded data component to raw binary data held in a string
            var byteString = window.atob(dataURI.split(',')[1]);
            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

            var ab = new ArrayBuffer(byteString.length);
            var ia = new Uint8Array(ab);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }

            var bb = new Blob([ab], { "type": mimeString });
            return bb;
        }

        console.log('profileCtrl');
    }])

    .controller("editprofileCtrl", ["$scope", "$customlocalstorage", "$http", "$cordovaImagePicker", "$cordovaContacts", "ionicToast", '$cordovaCamera', '$popupService', '$config', function ($scope, $customlocalstorage, $http, $cordovaImagePicker, $cordovaContacts, ionicToast, $cordovaCamera, $popupService, $config) {
        console.log('editprofileCtrl called');
        $scope.image = {
            currentImage: ''
        };
        $scope.editProfileImage = function () {
            $scope.imageInfo = '';

            navigator.camera.getPicture(function (imageData, vals) {
                console.log(imageData);
                console.log(vals);
                var imageBase64 = "image base64 data";
                var blob = new Blob([imageBase64], { type: 'image/png' });
                console.log(blob);
                var file = new File([imageData], 'imageFileName.png');
                console.log(file);
                $scope.imageInfo = imageData;
                var Parsefile = new Parse.File("img.png", imageData);
                console.log(Parsefile);

                $http({
                    method: 'POST',
                    url: 'http://' + $config.IP_PORT + '/consumer/uploadImageFile/',
                    headers: { 'Content-Type': false },
                    transformRequest: function (data) {
                        var formData = new FormData();
                        formData.append("consumer_id", '12');
                        formData.append('image_file', $scope.image.currentImage);
                        return formData;
                    },
                    data: {}
                }).then(function (res) {
                    console.log(res);
                    $popupService.showAlert('RESPONSe', res);
                });

            }, function (err) {
                console.log(err);
                $popupService.showAlert('Error', err);
            }, {
                quality: 50,
                destinationType: Camera.DestinationType.FILE_URI
            });

            $scope.dataURItoBlob = function (dataURI) {
                // convert base64/URLEncoded data component to raw binary data held in a string
                var byteString = window.atob(dataURI.split(',')[1]);
                var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

                var ab = new ArrayBuffer(byteString.length);
                var ia = new Uint8Array(ab);
                for (var i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }

                var bb = new Blob([ab], { "type": mimeString });
                return bb;
            }
        };
        $scope.updateProfile = function (form) {

            var reqObj = {
                phone: $scope.form.phone,
                address: $scope.form.address,
                pincode: $scope.form.pincode,
                email: $scope.form.email,
                alternate_number: $scope.form.alternate_number,
                uuid: device.uuid
            };
            $http.put('http://' + $config.IP_PORT + '/feedback/add/' + reqObj.date + '/' + reqObj.feedbackText + '/' + reqObj.customerId)
                .success(function (res) {
                    console.log(res);

                });

            $scope.updateProfile = $customlocalstorage.setObject("UpdatedProfile", reqObj);
            ionicToast.show('Profile Updated Successfully!', 'middle', false, 2500);
            $state.go("app.products");

            //var req = {
            //    method: 'PUT',
            //    url: 'http://'+$config.IP_PORT+'/register/add',
            //    headers: {
            //        'Content-Type': 'application/json'
            //    },
            //    data: JSON.stringify(reqObj)
            //}

            //$http(req).then(function (res) {
            //    console.log(res.data);
            //    if (res.data.registrationStatus == 'OK') {
            //        loginSuccess = true;
            //        $customlocalstorage.setObject('registration', res.data.id);
            //        $customlocalstorage.set('isUserLogedIn', 'YES');
            //        //console.log("CHK:" + $customlocalstorage.get('isUserLogedIn'));
            //        console.log(res.data);
            //        $state.go("retailers");
            //    }
            //    console.info("registration post success");
            //}, function () {
            //    console.warn("registration post failed");
            //});

        };
        $scope.paymentoption = [];
        var req = $http({
            method: "GET",
            url: "..//data//preferences.json",
        }).then(function (res) {
            $scope.paymentoption = res.data;
            console.log(res.data[0]);
            JSON.stringify(res.data[0]);
            console.log(res.data[0].paymentoptions);
            console.log(res.data[1].deliverytime);

            console.log("payment selection success1");
        }, function () {
            console.log("category request failed");
        });

        $scope.toggleGroup = function (group) {
            if ($scope.isGroupShown(group)) {
                $scope.shownGroup = null;
            } else {
                $scope.shownGroup = group;
            }
        };
        $scope.isGroupShown = function (group) {
            return $scope.shownGroup === group;
        };




        //$scope.myImage = '';
        //$scope.myCroppedImage = '';

        //var handleFileSelect = function (evt) {
        //    var file = evt.currentTarget.files[0];
        //    var reader = new FileReader();
        //    reader.onload = function (evt) {
        //        $scope.$apply(function ($scope) {
        //            $scope.myImage = evt.target.result;
        //        });
        //    };
        //    reader.readAsDataURL(file);
        //};
        //angular.element(document.querySelector('#fileInput')).on('change', handleFileSelect);




    }])

    .controller("viewprofileCtrl", ["$scope", "$customlocalstorage", "$http", "$cordovaImagePicker", "$cordovaContacts", "ionicToast", '$config', function ($scope, $customlocalstorage, $http, $cordovaImagePicker, $cordovaContacts, ionicToast, $config) {
        console.log('viewprofileCtrl called');

        // $scope.yourProfileData = $customlocalstorage.getObjectorDefault("UpdatedProfile", "[]");
        var req = {
            url: 'http://' + $config.IP_PORT + '/consumer/id/' + $config.CONSUMER_ID,
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },

        }
        $scope.yourProfileDetails = {

        }
        $http(req).success(function (res) {
            angular.forEach(res, function () {
                $scope.yourProfileDetails = res;
                // $scope.yourProfileDetails=JSON.stringify(res);   
            })


            console.log($scope.yourProfileDetails);

        })

    }])

    .controller("ordersCtrl", ["$scope", "$state", "$customlocalstorage", "$http", "$config", "$ionicLoading", function ($scope, $state, $customlocalstorage, $http, $config, $ionicLoading) {
        $ionicLoading.show({
            template: "Loading your orders...",
        });
        $scope.ordersList = [];
        var customerID = $config.CONSUMER_ID;
        $http.get('http://' + $config.IP_PORT + '/order/customer/' + customerID).then(function (res) {
            $scope.ordersList = res.data[1];
            $ionicLoading.hide();
        }, function (err) {
            console.log(err);
        });
        $scope.showOrderItems = function (order) {
            $state.go('app.orderDetail', { orderID: order.id });
        };
        console.log('ordersCtrl');
    }])

    .controller("orderDetailCtrl", ['$scope', '$http', '$customlocalstorage', '$stateParams', '$config','$ionicLoading',
    function ($scope, $http, $customlocalstorage, $stateParams, $config, $ionicLoading) {
        $scope.orderDetail = {};
        $ionicLoading.show({
            template: "Loading order details...",
        });
        console.log($stateParams.orderID);
        $http.get('http://' + $config.IP_PORT + '/order/order_id/' + $stateParams.orderID).then(function (res) {
            $scope.orderDetail = res.data;
            console.log($scope.orderDetail);
            $ionicLoading.hide();
        }, function (err) {
            console.log(err);
        });

    }])

    .controller("settingsCtrl", ["$scope", "$state", "$customlocalstorage", "$http", "$popupService", function ($scope, $state, $customlocalstorage, $http, $popupService) {
        console.log('settingsCtrl');
        $scope.resetData = function () {
            $scope.data = {
                confirm: false
            }

            $popupService.showConfirm("Reset Confirm", "Are you sure, You want to reset the Smart Retailer data!", $scope.data).then(function () {
                if ($scope.data.confirm) {
                    localStorage.clear();
                    $popupService.showAlert("Reset Done!", "All the app related data has beed removed. Including logged in details.").then(function () {
                        $state.go('login');
                    });
                }
            });
        }
    }])

    .controller("feedbackCtrl", ["$scope", "$state", "$customlocalstorage", "$http", "ionicToast", "$filter", "$config", function ($scope, $state, $customlocalstorage, $http, ionicToast, $filter, $config) {
        $scope.form = {
            feedbackText: ""
        };

        console.log('feedbackCtrl called');
        $scope.submitfeedback = function (form) {
            console.log("submit feedback called");
            var reqObj = {
                feedbackText: $scope.form.feedbackText,
                date: $filter('date')(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                customerId: "11",
                uuid: device.uuid,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded;' }

            };
            $http.put('http://' + $config.IP_PORT + '/feedback/add/' + reqObj.date + '/' + reqObj.feedbackText + '/' + reqObj.customerId)
                .success(function () {
                    ionicToast.show('Thanks for Your feedback!', 'middle', false, 1000);
                    $state.go('app.products');
                });
        };
    }])

    .controller("legalCtrl", ["$scope", "$state", "$customlocalstorage", "$http", "ionicToast", function ($scope, $state, $customlocalstorage, $http, ionicToast) {
        console.log('legalCtrl');

        $scope.confirmTerms = function () {
            ionicToast.show("Terms has been accepted", "middle", false, 1000);
            $state.go('app.retailers');
        }
    }])

    .controller("updateVendorCtrl", ["$scope", "$state", "$customlocalstorage", "$http", function ($scope, $state, $customlocalstorage, $http) {
        console.log('updateVendorCtrl');
    }])

    .controller("rateAppCtrl", ["$scope", "$state", "$customlocalstorage", "$http", function ($scope, $state, $customlocalstorage, $http) {

        console.log('rateAppCtrl');
    }])

    .controller("contactUsCtrl", ["$scope", "$state", "$customlocalstorage", "$http", function ($scope, $state, $customlocalstorage, $http) {
        console.log('contactUsCtrl');




    }])

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