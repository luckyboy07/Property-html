(function() {
    'use strict';
    angular.module('myApp')

        .controller('interiorCtrl', interiorCtrl);

    interiorCtrl.$inject = ['$scope', '$rootScope', '$state', 'angularGridInstance', '$uibModal', 'API_URL', '$localForage', '$timeout'];

    function interiorCtrl($scope, $rootScope, $state, angularGridInstance, $uibModal, API_URL, $localForage, $timeout) {
        gtag('config', 'UA-113798651-1', {
            'page_title': 'interiorpage',
            'page_path': $state.current.url
        });

        $scope.themes = [];
        $localForage.getItem('property_data').then(function(datas) {
            // $scope.prop_data = datas;
            // if ($scope.prop_data.request_info.spaces.length == 1) {
            //     $scope.prop_data.request_info.spaces.push({
            //         space_id: 2
            //     });
            // }
            var interior = _.filter(datas.packages, { 'package_type': 'Interior' });
            _.each(interior, function(row) {
                row.image = './img/buckwheat.jpg';
                $scope.themes.push(row)
            });
            $timeout(function() {
                $scope.getTheme($scope.themes[0], 0);
            }, 300)
            // $localForage.getItem('property').then(function(item) {
            //     var interior = _.filter(item.data[0].home_designs[0].packages, { 'package_type_parent': 'interior' });
            //     _.each(interior, function(row) {
            //         if (row && row.package_type_parent == 'interior') {
            //             row.image = './img/buck.png';
            //             $scope.themes.push(row)
            //         }
            //     })
            //     $timeout(function() {
            //         $scope.getTheme($scope.themes[0], 0);
            //     }, 300)
            // });
        });


        // $scope.themes = localStorageService.get('property').interior_schemes;

        $scope.modal = function() {
            var modalInstance = $uibModal.open({
                animation: true,
                scope: $scope,
                templateUrl: './views/interior.modal.html',
                size: 'sm'
            });

            modalInstance.result.then(function(selectedItem) {
                $state.reload();
            }, function() {});

            $scope.cancel = function() {
                modalInstance.dismiss('cancel');
            }
        };

        $scope.getTheme = function(data, index) {
            $scope.selected = index;
            _.each($scope.themes, function(row) {
                if (row.package_id == data.package_id) {
                    row.selected = true;
                } else {
                    row.selected = false;
                }
            });
            var selectedtheme = _.find($scope.themes, { 'selected': true });
            $scope.themedetail = selectedtheme;
            var da = _.orderBy(data.package_items, function(row) {
                return row.surface.surface_name;
            }, ['asc']);
            $scope.themedetail.package_items = da;
              gtag('event', 'select', {
                'event_category': 'Interior',
                'event_label': data.package_name
            });
        }

        $scope.goNext = function(name) {
            $localForage.getItem('property_data').then(function(item) {
                if (item) {
                    item.selectedpackage.push($scope.themedetail);
                    _.each($scope.themedetail.package_items, function(row) {
                        var p = {
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
                        }

                        item.items.push(p);
                    });
                    item.scheme_id = $scope.themedetail.package_id;
                    item.model_selected.push({
                        type: 'interior',
                        image: $scope.themedetail.image,
                        title_name: $scope.themedetail.package_name
                    });
                    _.uniq(item.selectedpackage);
                    _.uniq(item.model_selected);
                    $scope.items = item;
                    var uniqitems = _.uniqBy($scope.items.items, function(e) {
                        return e.item_id;
                    });
                    $scope.items.items = uniqitems;
                }

                if (name == 'zoom') {
                     gtag('event', 'view', {
                            'event_category': 'Interior',
                            'event_label': $scope.themedetail.package_name,
                            'value': $scope.themedetail.image
                        });
                    $localForage.setItem('property_data', $scope.items);
                    $timeout(function() {
                        $state.go('main.interiormodel', null, { reload: true });
                    }, 200)
                    // $localForage.setItem('property_data', $scope.prop_data);
                } else {
                    $localForage.setItem('property_data', $scope.items);
                    $timeout(function() {
                        $state.go('main.client', null, { reload: true });
                    }, 200)
                }
            });

            // $scope.prop_data.request_info.spaces[1].theme_id = $scope.themedetail.theme_id;
            // $scope.prop_data.request_info.spaces[1].space_selected = $scope.themedetail;
            // // localStorageService.set('property_data', $scope.prop_data);
            // $localForage.setItem('property_data', $scope.prop_data)
        };

        $scope.goToClient = function() {
            $scope.prop_data.request_info.spaces[1].theme_id = $scope.themedetail.theme_id;
            $scope.prop_data.request_info.spaces[1].space_selected = $scope.themedetail;
            // localStorageService.set('property_data', $scope.prop_data);
            $localForage.setItem('property_data', $scope.prop_data)
            $state.go('main.client');
        }
    };
})();