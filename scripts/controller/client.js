(function() {
    'use strict';
    angular.module('myApp')

        .controller('clientCtrl', clientCtrl);

    clientCtrl.$inject = ['$scope', '$http', 'API_URL', '$stateParams', '$timeout', '$state', '$localForage', '$window', 'toastr'];

    function clientCtrl($scope, $http, API_URL, $stateParams, $timeout, $state, $localForage, $window, toastr) {
        gtag('config', 'UA-113798651-1', {
            'page_title': 'clientpage',
            'page_path': $state.current.url
        });

        $scope.details = {};
        $scope.thankyou = false;
        $scope.able = true;
        $localForage.getItem('property').then(function(item) {});
        $scope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams) {
            if (toState.name == 'main.client') {
                $localForage.getItem('property_data').then(function(data) {
                    // var extrior = .f
                    var facadeselected = _.find(data.facade_designs, { 'selected': true });
                    var selectedexterior = _.find(data.selectedpackage, { 'package_type': 'Exterior' });
                    var selectedinterior = _.find(data.selectedpackage, { 'package_type': 'Interior' });
                    var send = {
                        facade_id: facadeselected.space_id,
                        // floor_name: data.floor_name,
                        fp_design_id: data.fp_design_id,
                        home_design_id: data.home_design_id,
                        items: data.items,
                        package_id: data.package_id,
                        price: data.price,
                        scheme_id: data.scheme_id,
                        exterior_scheme_id: selectedexterior.package_id,
                        interior_scheme_id: selectedinterior.package_id
                    }
                    send.items = [];

                    _.each(data.items, function(row) {
                        var p = {
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
                            'material_name': row.product.material_name || 'default',
                            'surface_name': row.product.surface_name || 'default',
                            'space': row.space,
                            'surface': row.surface

                        }
                        send.items.push(p)
                    });
                    $scope.prop_data = send;
                    if (!data.items || data.items.length == 0) {
                        $window.history.back();
                    }
                });

            }
        });

        $scope.tagg = [];
        $scope.test = function(select) {
            var reg = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
            if (select.length == 1) {
                if (!reg.test(select[0])) {
                    toastr.error('Is not a valid email', 'Error');
                    $scope.tagg = [];
                }
            } else if (select.length > 5) {
                toastr.error('You reached the maximum amount of emails', 'Error');
                $scope.tagg.splice(-1, 1);
            } else {
                if (!reg.test(select[select.length - 1])) {
                    toastr.error('Is not a valid email', 'Error');
                    $scope.tagg.splice(-1, 1);
                }
            }
        };

        $scope.send = function() {
            $scope.able = false;
            $scope.details.secondary_email_addresses = [];
            if ($scope.tagg.length > 1) {
                var emails = angular.copy($scope.tagg);
                var firstemail = emails.shift();
                $scope.details.secondary_email_addresses = emails;
                $scope.details.primary_email_address = firstemail;
            } else {
                $scope.details.primary_email_address = $scope.tagg[0];
            }
            $scope.prop_data.client = $scope.details;
            $scope.prop_data.level = 1;
            gtag('event', 'send', {
                'event_category': 'Email',
                'value': 'too many to display'
            });
            $http.post(API_URL + '/homeconfig2', $scope.prop_data).then(function(data) {
                if (data.status) {
                    $scope.thankyou = true;
                }
            });
        }
    };
})();