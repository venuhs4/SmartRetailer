(function () {
    "use strict";

    angular.module("myapp.controllers", ['myapp.utils', 'ionic', 'ngCordova', 'ionic-toast'])

    .controller("appCtrl", ["$scope", "$customlocalstorage", "$ionicPopover", "$rootScope", "$http", "$state", "$filter", "$cordovaGeolocation", "$popupService", "ionicToast", function ($scope, $customlocalstorage, $ionicPopover, $rootScope, $http, $state, $filter, $cordovaGeolocation, $popupService, ionicToast) {
        $scope.retailer = "";
        $scope.category = [];
        $scope.categorySelection = {
            category: '',
            segment: '',
            subSegment:''
        }
        $scope.shownSeg = null;
        console.log($scope.sampleData);

        var posOptions = {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 0
        };
        console.log($cordovaGeolocation);
        $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
            var lat = position.coords.latitude;
            var long = position.coords.longitude;

            $popupService.showAlert("Location Success", "<p>Lat:" + lat + "</p>" + "<p>Long:" + long + "</p>" + "<p>Token:" + localStorage['token'] + "</p>");//localStorage['token']
            console.log(posOptions);
        }, function (err) {
            $popupService.showAlert("Geo Fail", JSON.stringify(err));
            console.log("position fail");
            console.log(err);
        });

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
            url: "http://192.168.1.40:8080/category",
        }).then(function (res) {
            $scope.category = res.data;
            console.log("category success1");
        }, function () {
            console.log("category request failed");
        });
        $scope.getProducts = function (id1, id2, id3, subSegName) {
            $scope.categorySelection.subSegment = subSegName;
            console.log($scope.categorySelection);
            $http({
                method: "GET",
                url: "http://192.168.1.40:8080/product/category/" + id1 + "/segment/" + id2 + "/subsegment/" + id3,
            }).success(function (res) {
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
                    url: "http://192.168.1.40:8080/category/segment/" + cat.id,
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
                    url: "http://192.168.1.40:8080/category/segment/subsegment/" + seg.id,
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

        $scope.submitfeedback = function () {
            console.log('feedbackCtrl called');
            // ionicToast.show(message, position, stick, time);
            ionicToast.show('Thank you for your feedback!', 'middle', false, 2500);

            $state.go("app.products");
            $scope.hideToast = function () {
                ionicToast.hide();
            };
            console.log('feedback submitted');


        }
        //$scope.maxlengthText = function () {
        //    console.log("maxlength reach called");
        //    ionicToast.show('Thanks for your liking us!', 'bottom', false, 2500);
        //    $scope.hideToast = function () {
        //        ionicToast.hide();
        //    };
        //}
        $scope.getsmiley = function () {
            console.log("smiley called");
            ionicToast.show('Thank you for liking us!', 'middle', false, 2000);
            $state.go("app.products");
            $scope.hideToast = function () {
                ionicToast.hide();
            };
            console.log('smiley submitted with data');
        }

    }
    ])

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

    .controller("registerCtrl", ["$scope", "$state", "$http", "$popupService", "$stateParams", function ($scope, $state, $http, $popupService, $stateParams) {
        $scope.iderrormessage = '';
        $scope.retailerID = $stateParams.retailerID;
        $scope.user = {
            id: '',
            deviceID: ''
        };
        $scope.form = {
            gender: "Male"
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
            if ($scope.form.phone === undefined || !$scope.form.phone.match(/^(\+\d{1,3})?-?\d{10}$/)) {
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
                var reqObj = {
                    email: $scope.form.email,
                    phone: $scope.form.phone,
                    firstName: $scope.form.firstName,
                    surname: $scope.form.surname,
                    gender: $scope.form.gender == "Male" ? "M" : "F",
                    isVerified: 1,
                    latitude: 0,
                    longitude: 0,
                    uuid: device.uuid,
                    message: "success",
                    password: $scope.form.password
                };

                var req = {
                    method: 'PUT',
                    url: 'http://192.168.1.40:8080/register/add',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify(reqObj)
                }

                $http(req).then(function (res) {
                    console.log(res.data);
                    if (res.data.registrationStatus == 'OK') {
                        loginSuccess = true;
                        $customlocalstorage.setObject('registration', res.data.id);
                        $customlocalstorage.set('idUserLogedIn', 'YES');
                        //console.log("CHK:" + $customlocalstorage.get('idUserLogedIn'));
                        console.log(res.data);
                        $state.go("retailers");
                    }
                    console.info("registration post success");
                }, function () {
                    console.warn("registration post failed");
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

    .controller("loginCtrl", ["$scope", "$state", "$customlocalstorage", "$http", "$popupService", "$stringResource", function ($scope, $state, $customlocalstorage, $http, $popupService, $stringResource) {
        $scope.data = {};
        $scope.proceed = function () {
            $http.post('http://192.168.1.42:8080/user/login', {
                mobileNo: $scope.data.phone,
                uuid: device.uuid
            }).then(function (res) {
                console.log(res.data);
                if (res.data.status === "1") {
                    $customlocalstorage.setObject('defaultRetailer', res.data.retailer);
                    $popupService.showAlert('Success', 'Login success! The retailer <b>' + res.data.retailer.storename + '</b> has been set as default.')
                        .then(function () {
                            localStorage['idUserLogedIn'] = 'true';
                            $state.go('app.products');
                        });
                }
                else if (res.data.status === "0") {
                    //$popupService.showAlert(res.data.message, $stringResource.getValue('invalid-user'));
                    $http.get('http://192.168.1.42:8080/invitation/' + $scope.data.phone).then(function (res) {
                        console.log(res.data);
                        if (res.data.status === "1") {
                            $popupService.showAlert('Invitation', 'You have got an INVITATION from the retailer <b>' + res.data.invitation.retailer.storename + '</b>. The retailer will be set as a Default retailer.');
                            $customlocalstorage.setObject('defaultRetailer', res.data.invitation.retailer);
                            $state.go('register', { retailerID: res.data.invitation.retailer.id });
                        }
                        else {
                            $state.go('retailers');
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
                    $state.go('products');
                }
            });

            console.log("set default retailer.");
        }
    }])

    .controller('bannerDetailsCtrl', ["$scope", "$stateParams", "$state", function ($scope, $stateParams, $state) {
        $scope.id = $stateParams.bannerID;
        // console.log($stateParams.bannerID);
    }])

    .controller("retailersCtrl", ["$scope", "$state", "$customlocalstorage", "$http", '$rootScope', '$config', function ($scope, $state, $customlocalstorage, $http, $rootScope, $config) {
        $scope.data = {
            searchkey: '',
            suggestions: [],
            isSuggestionShown: false,
            isSearchResultShown: false,
            retailers: []
        };
        $scope.data.choice = '';

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


                    $customlocalstorage.setObject("defaultRetailer", value);
                    console.log("default reatiler set");
                    console.log(value);
                    $state.go('register', { retailerID: value.id });
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

        //var defaultRequest = $http.get('http://192.168.1.40:8080/product').success(function (res) {
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
                url: 'http://192.168.1.40:8080/product',
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
                url: 'http://192.168.1.40:8080/product',
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
            console.log("refresh");
            $scope.$broadcast("scroll.refreshComplete");
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

    .controller("productsuggestionCtrl", ["$scope", "$state", "$customlocalstorage", "$http", function ($scope, $state, $customlocalstorage, $http) {
        console.log('productsuggestionCtrl');
        $scope.data = { searchkey: '' };
        $scope.productList = [];
        $scope.searchList = [];
        $scope.productDetailList = $scope.parentProducts.products;
        $scope.suggestionShow = false;
        $scope.productShow = false;
        $scope.categoryProductShow = true;
        $scope.productCount = 0;

        var req = {
            method: 'GET',
            url: 'http://192.168.1.40:8080/product',
        }

        $http(req).then(function (res) {
            angular.forEach(res.data, function (item) {
                $scope.productList.push(item.name);
            });
            console.log($scope.productList);
            console.log("initial list");
        }, function () {
            console.warn("search post failed");
        });

        $scope.searchSuggestion = function () {
            $scope.suggestionShow = true;
            $scope.productShow = false;
            $scope.categoryProductShow = false;

            $scope.searchList = [];
            $http.get('http://192.168.1.40:8080/product/suggestion/' + $scope.data.searchkey).then(function (res) {
                $scope.searchList = res.data;
            });

            //if ($scope.data.searchkey.length <3)
            //{
            //    return;
            //}

            //var searchString = $scope.data.searchkey.toLowerCase();
            //console.log("KEY:" + searchString);
            
            //angular.forEach($scope.productList, function (item) {
            //    if ((item).toLowerCase().indexOf(searchString) !== -1) {
            //        $scope.searchList.push(item);
            //    }
            //});
            //console.log($scope.searchList);
        };
        $scope.suggestionClick = function (text) {

            $scope.suggestionShow = false;
            $scope.productShow = true;
            $scope.categoryProductShow = false;
            var productsReq = {
                method: 'GET',
                url: 'http://192.168.1.40:8080/product/search/' + text,
            }

            $http(productsReq).then(function (res) {
                $scope.productDetailList = res.data;
                console.log("initial list");
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
    }])

    .controller("productDetailCtrl", ["$scope", function ($scope) {
        $scope.product = { Name: "sdfdsf" };
    }])

    .controller("addToCartCtrl", ["$scope", "$state", "$customlocalstorage", "$http", "$filter", "$popupService", "$stringResource", function ($scope, $state, $customlocalstorage, $http, $filter, $popupService, $stringResource) {
        $scope.displayProductDetailList = [];
        $scope.initProductDetailList = [];
        angular.forEach($customlocalstorage.getObjectorDefault('cartlist','[]'), function (value, index) {
            var req = {
                method: 'GET',
                url: 'http://192.168.1.40:8080/product/' + value.productId,
            }
            $http(req).then(function (res) {
                $scope.initProductDetailList.push(res.data);
                $scope.displayProductDetailList.push(res.data);
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
                    var cartList = $customlocalstorage.getObject('cartlist', '[]');
                    var orderData = {
                        orderDate: $filter('date')(new Date(), 'yyyy-MM-dd'),
                        customerId: "11",
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
                        url: "http://192.168.1.40:8080/order/placeOrder",
                        method: "POST",
                        data: JSON.stringify(orderData)
                    };
                    console.log(orderData);
                    $http(orderReq).success(function (res, status) {
                        console.log(res);
                        console.log(status);
                        console.log("post success");
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
                if ($scope.returnNumber(value.id) !== 0)
                {
                    $scope.displayProductDetailList.push(value);
                }
            });
            console.log($scope.displayProductDetailList);
            //$scope.productCount = $scope.productDetailList;
            //console.log($scope.productDetailList.length);
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

    .controller("profileCtrl", ["$scope", "$state", "$customlocalstorage", "$http", function ($scope, $state, $customlocalstorage, $http) {

        //$http.
        console.log('profileCtrl');
    }])

    .controller("editprofileCtrl", ["$scope", "$state", "$customlocalstorage", "$http", function ($scope, $state, $customlocalstorage, $http) {
        console.log('editprofileCtrl called');
        $scope.paymentoption = [];

        //var addPreference = function () {
        //    var paymentoption = {
        //        "Credit Card": "null",
        //    "Debit Card":"null"};

        var req = $http({
            method: "GET",
            url: "..//data//preferences.json",
        }).then(function (res) {
            $scope.paymentoption = res.data;
            console.log(res.data[0]);
            JSON.stringify(res.data[0]);
            console.log(res.data[0].paymentoptions);
            console.log(res.data[1].deliverytime);

            //angular.forEach(res.data, function (item) {
            //    if (item.$scope.paymentoption === "paymentoption") {


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

    .controller("ordersCtrl", ["$scope", "$state", "$customlocalstorage", "$http", function ($scope, $state, $customlocalstorage, $http) {
        console.log('ordersCtrl');
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
                    $popupService.showAlert("Reset Done!", "All the app related data has beed removed. Including logged in details.");
                }
            });
        }
    }])

    .controller("feedbackCtrl", ["$scope", "$state", "$customlocalstorage", "$http", "ionicToast", function ($scope, $state, $customlocalstorage, $http, ionicToast) {
        console.log('feedbackCtrl called');
        $scope.sendfeedback = function () {
            console.log("thanks for feedback");
        };
        var showToast = function () {

            ionicToast.show('Thanks for Your feedback!', 'middle', false, 500);
        };
        $scope.hideToast = function () {
            ionicToast.hide();
        };
    }])

    .controller("legalCtrl", ["$scope", "$state", "$customlocalstorage", "$http", function ($scope, $state, $customlocalstorage, $http) {
        console.log('legalCtrl');
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