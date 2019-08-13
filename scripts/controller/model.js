(function() {
    'use strict';
    angular.module('myApp')

        .controller('modelCtrl', modelCtrl);

    modelCtrl.$inject = ['$scope', '$http', 'API_URL', '$stateParams', '$timeout', '$state', '$localForage'];

    function modelCtrl($scope, $http, API_URL, $stateParams, $timeout, $state, $localForage) {
            $localForage.getItem('property_data').then(function(data) {
            console.log('data:', data);
            var exterior = _.find(data.model_selected, { 'type': 'exterior' });
            var interior = _.find(data.model_selected, { 'type': 'interior' });
            console.log('exterior', exterior);
            console.log('interior', interior);
            $scope.model = exterior;
            $scope.model1 = interior;
            console.log('$scope.model:', $scope.model);
            console.log('$scope.model1:', $scope.model1);
            $scope.classes = 'background: url(' + $scope.model.image + ') no-repeat center center fixed';
            $scope.classes1 = 'background: url(' + $scope.model1.image + ') no-repeat center center fixed';
        });

    };
})();