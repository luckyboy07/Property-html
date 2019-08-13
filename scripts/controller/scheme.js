(function() {
    'use strict';
    angular.module('myApp')

        .controller('schemeCtrl', schemeCtrl);

    schemeCtrl.$inject = ['$scope', '$http', 'API_URL', '$state', '$localForage'];

    function schemeCtrl($scope, $http, API_URL, $state, $localForage) {
        console.log('schemeCtrl');
        gtag('config', 'UA-113798651-1', {
            'page_title': 'spacespage',
            'page_path': $state.current.url
        });
        $scope.spaces = [];
        $scope.floorDimensions = [];
        $scope.getspaceId;
        $scope.roomDimensions = [];
        $localForage.getItem('property_data').then(function(data){
        $scope.selectedHome = data.home_design_name+' '+data.floor_name;
        });
        $localForage.getItem('property').then(function(data) {
            $scope.floorplans = data.floorplans[0];
            $scope.roomDimensions =data.floorplans[0].floorplan_spaces;
            $scope.beds = _.filter($scope.roomDimensions,{'space_type':'Bedroom'});
            $scope.shower = _.filter($scope.roomDimensions,{'space_type':'Bathroom'});
            $scope.garage = _.filter($scope.roomDimensions,{'space_type':'Garage'});
            $scope.doublegarage = _.filter($scope.roomDimensions,{'space_type':''});
            if (data) {
                $scope.floorDimensions = data.floorplans[0].home_dimensions;
                var _initialfloor = _.filter($scope.floorDimensions,{'is_summed_for_total':true});
                $scope.totalSq = _.sumBy(_initialfloor,function(row){
                    return row.dimension;
                });
                // $scope.spaces = data.floorplanSpaces[0];
                // $scope.floorDimensions = data.floorplans[0].dimensions;
            }
        })
        $scope.getSpaces = function(space) {
            $scope.getspaceId = space.space_id;
        };

        $scope.next = function() {
            $state.go('main.exterior', { space_id: $scope.getspaceId }, { reload: false });
        };

        $scope.findDimension = function(name) {
            return _.findIndex($scope.floorDimensions, function(row) {
                return row.dimension_name == name;
            });
        };

    };
})();