 (function() {
     'use strict';
     angular.module('myApp')
         .run(['$rootScope', '$window', '$http', '$timeout', '$localForage', '$state',

             function($rootScope, $window, $http, $timeout, $localForage, $state) {
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
             }
         ]);
 })();