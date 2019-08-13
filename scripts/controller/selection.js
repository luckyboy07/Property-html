(function() {
    'use strict';
    angular.module('myApp')

        .controller('selectionCtrl', selectionCtrl);

    selectionCtrl.$inject = ['$scope', '$http', 'API_URL', '$state', '$localForage','$timeout','$rootScope'];

    function selectionCtrl($scope, $http, API_URL, $state, $localForage,$timeout,$rootScope) {
        console.log('selectionCtrl');
         gtag('config', 'UA-113798651-1', {
            'page_title': 'homeselectedpage',
            'page_path': $state.current.url
        });
         $timeout(function(){
            $rootScope.showLoader = false;
         },1000)
        $localForage.getItem('property_data').then(function(data) {
            console.log('data;',data);
            if (data) {
                $scope.titleHome = data.home_design_name
            }
        })
    };
})();