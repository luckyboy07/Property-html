(function () {
    'use strict';

    angular.module('myApp')
     .config(['$qProvider', '$stateProvider', '$httpProvider', '$urlRouterProvider',

            function($qProvider, $stateProvider, $httpProvider, $urlRouterProvider) {

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
                     });

                $urlRouterProvider.otherwise('/main/welcome');

            }
        ]);
})();
