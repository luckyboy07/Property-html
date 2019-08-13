(function() {
    'use strict';
    angular.module('myApp')

        .controller('homeCtrl', homeCtrl);

    homeCtrl.$inject = ['$scope', '$rootScope', '$state', 'angularGridInstance', "$http", 'API_URL', '$timeout', '$localForage', 'toastr', '$window'];

    function homeCtrl($scope, $rootScope, $state, angularGridInstance, $http, API_URL, $timeout, $localForage, toastr, $window) {
        console.log('homeCtrl');
        gtag('config', 'UA-113798651-1', {
            'page_title': 'homedesignpage',
            'page_path': $state.current.url
        });
        $scope.homesdesign = [];
        $scope.home = false;
        $scope.facades = [];
        $scope.facade = false;
        $scope.floorplans = [];
        $scope.floorplan = false;
        $scope.title = '';
        $scope.homeText = '';
        $scope.data = {};
        // $scope.data.request_info = {};
        // $scope.data.home_type_id = null;
        // $scope.data.space_type_id = null;
        // $scope.data.floorplan_id = null;
        $scope.floordetail = {};
        $scope.sizeheight = $window.outerHeight;

        $scope.datas = [];

        $scope.half = true;

        $scope.angularGridoptions = {
            cssGrid: true,
            refreshOnImgLoad: false,
            gutterSize: 10,
        };

        // $scope.showLoader = true;

        // $timeout(function(){
        //     $scope.showLoader = false;
        // },2500)

        $scope.images = [{
                image: 'img/bg2.jpg',
            },
            {
                image: 'img/bg2.jpg'
            },
            {
                image: 'img/bg2.jpg'
            }, {
                image: 'img/bg2.jpg'
            }, {
                image: 'img/bg2.jpg'
            },
            {
                image: 'img/bg2.jpg'
            },
            {
                image: 'img/bg2.jpg'
            }, {
                image: 'img/bg2.jpg'
            }, {
                image: 'img/bg2.jpg'
            },
            {
                image: 'img/bg2.jpg'
            },
            {
                image: 'img/bg2.jpg'
            }, {
                image: 'img/bg2.jpg'
            }
        ];

        function detectmob() {
            if (navigator.userAgent.match(/Android/i) ||
                navigator.userAgent.match(/webOS/i) ||
                navigator.userAgent.match(/iPhone/i) ||
                navigator.userAgent.match(/iPad/i) ||
                navigator.userAgent.match(/iPod/i) ||
                navigator.userAgent.match(/BlackBerry/i) ||
                navigator.userAgent.match(/Windows Phone/i)
            ) {
                return true;
            } else {
                return false;
            }
        }

        // $scope.$watch('size', function(newVal, oldVal) {
        //     if (newVal) {
        //         if (!detectmob()) {
        //             if (newVal.height > 700) {
        //                 $scope.screenHeight = 500;
        //             } else if (newVal.height < 700) {
        //                 $scope.screenHeight = 250;
        //             } else {
        //                 $scope.screenHeight = newVal.height;
        //             }
        //         } else {
        //             $scope.screenHeight = 250;
        //         }
        //         $localForage.setItem('screen_size', $scope.screenHeight);
        //     } else {
        //         $localForage.getItem('screen_size').then(function(data) {
        //             $scope.screenHeight = data;
        //         });
        //     }
        // });

        $localForage.getItem('property').then(function(data, error) {
            if (data) {
                $scope.datas = data.home_designs;
                _.each($scope.datas, function(row) {
                    row.image = 'img/bg2.jpg';
                    _.each(row.facade_designs, function(row2) {
                        row2.image = 'http://chuckformetricon.australiasoutheast.cloudapp.azure.com/public/uploads/facade_types/callulatraditional.jpg';
                    })
                });
                // $scope.datas.home_designs[0].image = 'img/bg2.jpg';
                // $scope.datas.home_designs[0].facade_designs[0].image = 'http://chuckformetricon.australiasoutheast.cloudapp.azure.com/public/uploads/facade_types/callulatraditional.jpg';
                $scope.design = $scope.datas;
                $scope.homecopy = angular.copy($scope.design);
                $scope.floorplans = data.floorplans;
                // var static_image = 'img/floor.png';
                // $scope.floorplans[0].image = 'img/floor.png';
                // $scope.floorplans[0].image = API_URL + '/' + $scope.datas.floorplans[0].media_files[0].media_url;
                // $http.get('http://chuckformetricon.australiasoutheast.cloudapp.azure.com/consolidated').then(function(resp) {
                //    console.log('resdp:',resp);
                // })
            } else {
                $http.get('http://chuckformetricon.australiasoutheast.cloudapp.azure.com:81/consolidated').then(function(resp) {
                    if (resp.status == 200 && resp.statusText == 'OK') {
                        $scope.datas = resp.home_designs;
                        _.each($scope.datas, function(row) {
                            row.image = 'img/bg2.jpg';
                            _.each(row.facade_designs, function(row2) {
                                row2.image = 'http://chuckformetricon.australiasoutheast.cloudapp.azure.com/public/uploads/facade_types/callulatraditional.jpg';
                            })
                        });
                        $scope.design = $scope.datas;
                        $scope.homecopy = angular.copy($scope.design);
                        $scope.floorplans = data.floorplans;
                        $localForage.setItem('property', resp.data);
                    }
                })
            }
            // $localForage.getItem('property_data').then(function(resp) {
            //     console.log('resp:',resp);
            //     if (resp) {
            //         $scope.data = resp;
            //     }
            // });
        });
        $scope.$watch('activeState', function(newVal, oldVal) {
            if (newVal !== oldVal) {
                $scope.close();
            } else {}
        });

        $scope.getDetail = function(name, event) {
            event.stopPropagation();
            $scope.selected = null;
            $scope.activeState = name;
            // if( $scope.homeText.length){

            // }else{

            // }

            if (name == 'home') {
                // $scope.close();
                $timeout(function() {
                    $scope.title = 'Home Designs';
                    // angularGridInstance.home.refresh();
                    $scope.home = true;
                    $scope.design = $scope.homecopy;
                    // $scope.facade = false;
                    $scope.floorplan = false;
                    $scope.half = false;
                    $timeout(function() {
                        angularGridInstance.home.refresh();
                    }, 500)
                }, 300)

            } else if (name == 'facade') {
                if ($scope.data.home_design_name) {
                    // $scope.close();
                    $timeout(function() {
                        $scope.title = 'Facade Types';
                        $scope.home = true;
                        // $scope.design = $scope.homecopy.home_designs.facade_designs;
                        var selectedhome = _.find($scope.homecopy, { 'selected': true });
                        $scope.design = selectedhome.facade_designs;
                        $scope.half = false;
                        $timeout(function() {
                            angularGridInstance.home.refresh();
                        }, 500)
                    }, 300)
                } else {
                    toastr.clear();
                    $timeout(function() {
                        toastr.warning('Please choose  home design first', 'Warning');
                    }, 300)
                }
            } else if (name == 'floorplan') {

                if ($scope.data.space_name) {
                    // $scope.close();
                    $timeout(function() {
                        $scope.title = 'Floorplan';
                        $scope.detail = true;
                        $scope.floorplan = true;
                        $scope.facade = false;
                        $scope.home = false;
                        $scope.half = false;
                    }, 300)

                } else if (!$scope.data.space_name && !$scope.data.home_name) {
                    toastr.clear();
                    $timeout(function() {
                        toastr.warning('Please choose  home design & facade type first', 'Warning');
                    }, 300)
                } else {
                    toastr.clear();
                    $timeout(function() {
                        toastr.warning('Please choose facade type first', 'Warning');
                    }, 300)
                }
            }

        };
        $scope.getText = function(name) {
            $scope.homeText = name;
        };

        $scope.clearText = function() {
            $scope.homeText = '';
        };


        $scope.getHomeDesign = function(data, index) {
            // $scope.selected = index;
            console.log('data:', data);

            if (data.home_design_id) {
                console.log('$scope.design:', $scope.design)
                _.each($scope.design, function(row) {
                    if (row.home_design_id == data.home_design_id) {
                        row.selected = true;
                    } else {
                        row.selected = false;
                    }
                });

                gtag('event', 'select', {
                    'event_category': 'Home Designs',
                    'event_label': data.home_design_name
                });
                // $scope.data.request_info.home_type_id = data.home_type_id;
                // $scope.data.request_info.home_type = data.home_type;
                $scope.data.home_design_id = data.home_design_id;
                $scope.data.home_design_name = data.home_design_name;
            } else if (data.space_id) {
                _.each($scope.design, function(row) {
                    if (row.space_id == data.space_id) {
                        row.selected = true;
                    } else {
                        row.selected = false;
                    }
                })
                $scope.data.price = data.price;
                $scope.data.facade_id = data.space_id;
                $scope.data.space_name = data.space_name;
                gtag('event', 'select', {
                    'event_category': 'Facade Type',
                    'event_label':  data.space_name
                });
            }
            $scope.close();
        };

        $scope.getFloorplan = function(floor, index) {
            $scope.selected = index;
            _.each($scope.floorplans, function(row) {
                if (row.fp_design_id == floor.fp_design_id) {
                    row.selected = true;
                } else {
                    row.selected = false;
                }
            });
            $scope.data.fp_design_id = floor.fp_design_id;
            $scope.data.floor_name = floor.fp_design_name;
            gtag('event', 'select', {
                'event_category': 'Floor plan',
                'event_label': floor.fp_design_name
            });
            $scope.close();
        };

        $scope.close = function() {
            $scope.selected = null;
            $scope.home = false;
            $scope.facade = false;
            $scope.floorplan = false;
            $scope.half = true;
        };

        $scope.viewDetails = function(item) {
            if (item) {
                $scope.floordetail = item.dimensions;
            }
            $scope.detail = !$scope.detail;

        };

        $scope.start = function() {
            var selected = _.find($scope.homecopy, { 'selected': true });
            selected.floor_name = $scope.data.floor_name;
            selected.fp_design_id = $scope.data.fp_design_id;
            selected.price = parseFloat($scope.data.price);
            $localForage.setItem('property_data', selected);
            $rootScope.showLoader = true;
            $state.go('main.selection');
        };

        $scope.findDimension = function(name) {
            return _.findIndex($scope.floordetail, function(row) {
                return row.dimension_name == name;
            });
        };

    };
})();