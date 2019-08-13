(function() {
    'use strict';
    angular.module('myApp')

        .controller('exteriorCtrl', exteriorCtrl);

    exteriorCtrl.$inject = ['$scope', '$http', 'API_URL', '$stateParams', '$timeout', '$state', '$localForage'];

    function exteriorCtrl($scope, $http, API_URL, $stateParams, $timeout, $state, $localForage) {
        $scope.themes = [];
        $scope.themedetail = {};
        $scope.selecteds = 0;
        gtag('config', 'UA-112833309-1', {
            'page_title': 'exteriorpage',
            'page_path': $state.current.url
        });
        $localForage.getItem('property_data').then(function(data) {
            console.log('data:', data);
        })
        $http.get('http://chuckformetricon.australiasoutheast.cloudapp.azure.com/consolidated').then(function(item) {
            // console.log('item:', item);
            // var datas = item.data.floorplanSpaces;
            // var data = item.data.exterior_schemes;
            // $scope.floorplan = _.find(datas[0].spaces, { 'space_id': 1 });
            // console.log('$scope.floorplan:', $scope.floorplan);
            // var index = 1;
            // $scope.themes = _.orderBy(data, ['theme_name'], ['asc']);
            // console.log('$scope.themes:', $scope.themes);
            // $localForage.getItem('property_data').then(function(items) {
            //     console.log('items:',items);
            //     $scope.prop_data = items;
            //     $scope.prop_data.request_info.spaces = [];

            //     if ($scope.prop_data.request_info.spaces.length == 0) {
            //         $scope.prop_data.request_info.spaces.push({
            //             space_id: 1
            //         });
            //     }
            // })
            //     console.log('$scope.prop_data:',$scope.prop_data);
            // $scope.getTheme($scope.themes[0], 0);
        })

        $localForage.getItem('property_data').then(function(item) {
            var exterior = _.filter(item.packages, { 'package_type': 'Exterior' });
            _.each(exterior, function(row) {
                row.image = './img/error.jpg';
                $scope.themes.push(row)
            });

            $timeout(function() {
                $scope.getTheme($scope.themes[0], 0);
            }, 300)

            // var datas = item.floorplanSpaces;
            // var data = item.exterior_schemes;
            // $scope.floorplan = _.find(datas[0].spaces, { 'space_id': 1 });
            // var index = 1;
            // $scope.themes =  _.orderBy(data,['theme_name'],['asc']);
            // $localForage.getItem('property_data').then(function(items) {
            //     $scope.prop_data = items;
            //     $scope.prop_data.request_info.spaces = [];

            //     if ($scope.prop_data.request_info.spaces.length == 0) {
            //         $scope.prop_data.request_info.spaces.push({
            //             space_id: 1
            //         });
            //     }
            // })
        });


        $scope.getTheme = function(data, index) {
            console.log('data:', data);
            _.each($scope.themes, function(row) {
                if (row.package_id == data.package_id) {
                    row.selected = true;
                } else {
                    row.selected = false;
                }
            });
            var selectedtheme = _.find($scope.themes, { 'selected': true });
            $scope.themedetail = selectedtheme;
            // var d1 = $scope.themedetail.styles;
            var da = _.orderBy(data.package_items, function(row) {
                return row.surface.surface_name;
            }, ['asc']);

            $scope.themedetail.package_items = da;
            $scope.selecteds = index;
            
            gtag('event', 'select', {
                'event_category': 'Exterior',
                'event_label': data.package_name
            });
            console.log('$scope.themedetail:', $scope.themedetail)
        }

        $scope.goNext = function(name) {
            // $scope.prop_data.request_info.spaces[0].theme_id = $scope.themedetail.theme_id;
            // $scope.prop_data.request_info.spaces[0].space_selected = $scope.themedetail;
            $localForage.getItem('property_data').then(function(item) {
                if (item) {
                    item.model_selected = [];
                    item.items = [];
                    item.selectedpackage = [];
                    item.selectedpackage.push($scope.themedetail);
                    _.each($scope.themedetail.package_items, function(row) {
                        item.items.push({
                            'item_id': row.item_id,
                            'space_id': row.space_id,
                            'surface_id': row.surface_id,
                            'product_id': row.product_id,
                            'level': 1,
                            'price': row.product.sell_price,
                            'is_addon': false,
                            'quantity': 1,
                            'is_upgrade': false,
                            'quantity_unit': '1',
                            'product': row.product,
                            'space': row.space,
                            'surface': row.surface
                        });
                    });
                    item.package_id = $scope.themedetail.package_id;

                    if (item.model_selected.length == 0) {
                        item.model_selected.push({
                            type: 'exterior',
                            image: $scope.themedetail.image,
                            title_name: $scope.themedetail.package_name
                        });
                    }
                    $scope.items = item;
                    if (name == 'zoom') {
                        console.log('item:',item)
                        gtag('event', 'view', {
                            'event_category': 'Exterior',
                            'event_label': $scope.themedetail.package_name,
                            'value': $scope.themedetail.image
                        });
                        $localForage.setItem('property_data', $scope.items);
                        $state.go('main.model', null, { reload: true });
                        // $localForage.setItem('property_data', $scope.prop_data);
                    } else {
                        $localForage.setItem('property_data', $scope.items);
                        $state.go('main.interior', null, { reload: true });
                    }
                }

            });


        }
    };
})();