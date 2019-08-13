(function() {
    'use strict';


    angular.module('myApp', [
            'ui.router',
            'ngSanitize',
            'ui.bootstrap',
            'angularGrid',
            'ngAnimate',
            'ngMaterial',
            'LocalForageModule',
            'toastr',
            'angucomplete-alt',
            'ngResize'
        ])

        // .constant('API_URL', 'http://chuckformetricon.australiasoutheast.cloudapp.azure.com')
        .constant('API_URL', 'http://chuckformetricon.australiasoutheast.cloudapp.azure.com:81')
        // .constant('API_URL', 'http://192.168.1.133:3001')
        .config(['$qProvider', '$stateProvider', '$httpProvider', '$urlRouterProvider', 'API_URL', '$localForageProvider', '$urlMatcherFactoryProvider', 'toastrConfig',

            function($qProvider, $stateProvider, $httpProvider, $urlRouterProvider, API_URL, $localForageProvider, $urlMatcherFactoryProvider, toastrConfig) {

                angular.extend(toastrConfig, {
                    autoDismiss: true,
                    tapToDismiss: true,
                });

                var driverPreferenceOrder = [
                    localforage.INDEXEDDB,
                    localforage.WEBSQL,
                    localforage.LOCALSTORAGE
                ];
                $localForageProvider.config({
                    driver: driverPreferenceOrder,
                    name: 'propertyLocal',
                    storeName: 'allData',
                });

                $urlMatcherFactoryProvider.strictMode(false);

                $stateProvider
                    .state('main', {
                        url: '/main',
                        templateUrl: 'views/main.html'
                    })
                    .state('main.welcome', {
                        url: '/welcome',
                        templateUrl: 'views/welcome.html',
                        controller: 'dashboardCtrl'
                    })
                    .state('main.home', {
                        url: '/home',
                        templateUrl: 'views/home.html',
                        controller: 'homeCtrl'
                    })
                    .state('main.selection', {
                        url: '/homeselection',
                        templateUrl: 'views/selection.html',
                        controller: 'selectionCtrl'
                    })
                    .state('main.interior', {
                        url: '/interior',
                        templateUrl: 'views/interior.html',
                        controller: 'interiorCtrl'
                    })
                    .state('main.interiormodel', {
                        url: '/interior/model',
                        templateUrl: 'views/interior.model.html',
                        controller: 'modelCtrl'
                    })
                    .state('main.kitchen', {
                        url: '/kitchen',
                        templateUrl: 'views/kitchen.html',
                        controller: 'interiorCtrl'
                    })
                    .state('main.client', {
                        url: '/client',
                        templateUrl: 'views/client.html',
                        controller: 'clientCtrl'
                    })
                    .state('main.model', {
                        url: '/model',
                        templateUrl: 'views/model.html',
                        controller: 'modelCtrl'
                    })
                    .state('main.scheme', {
                        url: '/spaces',
                        templateUrl: 'views/scheme.html',
                        controller: 'schemeCtrl'
                    })
                    .state('main.exp', {
                        url: '/exp',
                        templateUrl: 'views/experiment.html'
                    })
                    .state('main.exterior', {
                        url: '/exterior',
                        templateUrl: 'views/exterior.html',
                        controller: 'exteriorCtrl'
                    });

                $urlRouterProvider.otherwise('/main/welcome');
            }
        ])
        .run(function($rootScope, $window, $http, $templateCache, $timeout, $localForage, $state) {
            // $templateCache.put('./views/welcome.html');
            // $templateCache.put('./views/home.html');

            $rootScope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams) {


                $localForage.getItem('property').then(function(data) {
                    if (fromState.name == 'main.welcome' || fromState.name == 'main.home') {
                        if (!data) {
                            $state.go('main.welcome');
                        } else {
                            $localForage.getItem('property_data').then(function(items) {
                                if (toState.name !== 'main.home') {
                                    if (!items) {
                                        $state.go('main.welcome');
                                    }
                                }

                            })
                        }
                    } else {
                        if (fromState.name == '') {
                            $localForage.getItem('property_data').then(function(items) {
                                if (!items) {
                                    $state.go('main.welcome');
                                }
                            })
                        }
                    }
                    $rootScope.goBack = function() {
                        $window.history.back();
                    };
                });
            });
        }).directive('errSrc', function() {
            return {
                link: function(scope, element, attrs) {
                    scope.$watch(function() {
                        return attrs['ngSrc'];
                    }, function(value) {
                        if (!value) {
                            element.attr('src', attrs.errSrc);
                        }
                    });

                    element.bind('error', function() {
                        element.attr('src', attrs.errSrc);
                    });
                }
            };
        }).directive('ngEnter', function() {
            return function(scope, element, attrs) {
                element.bind("keydown keypress", function(event) {
                    if (event.which === 13) {
                        scope.$apply(function() {
                            scope.$eval(attrs.ngEnter);
                        });

                        event.preventDefault();
                    }
                });
            };
        }).directive('numbersOnly', function() {
            return {
                require: 'ngModel',
                link: function(scope, element, attr, ngModelCtrl) {
                    function fromUser(text) {
                        if (text) {
                            var transformedInput = text.replace(/[^0-9-]/g, '');
                            if (transformedInput !== text) {
                                ngModelCtrl.$setViewValue(transformedInput);
                                ngModelCtrl.$render();
                            }
                            return transformedInput;
                        }
                        return undefined;
                    }
                    ngModelCtrl.$parsers.push(fromUser);
                }
            };
        }).directive('resizeTest', ['resize', function(resize) {
            return {
                restrict: 'A',
                controller: function($scope) {

                    $scope.$on('resize', function(data, $event) {
                        $scope.size = $event;
                    });

                },
                link: function($scope, $element, $attribute) {

                }
            };
        }]);
})();