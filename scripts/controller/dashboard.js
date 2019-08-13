(function() {
    'use strict';
    angular.module('myApp')

        .controller('dashboardCtrl', dashboardCtrl);

    dashboardCtrl.$inject = ['$scope', '$rootScope', '$state', '$http', 'API_URL', '$localForage', '$timeout'];

    function dashboardCtrl($scope, $rootScope, $state, $http, API_URL, $localForage, $timeout) {
        console.log('dashboardCtrl:');
        gtag('config', 'UA-113798651-1', {
            'page_title': 'welcomepage',
            'page_path': $state.current.url
        });

        $localForage.removeItem('property_data');
        $localForage.removeItem('property');

        async.waterfall([
            function(cb) {
                $rootScope.showLoader = true;
                $http.post(API_URL + "/login", { email_address: 'test@gmail.com' })
                    .then(function(response) {
                        if (response.data.status && response.data.message == 'accepted') {
                            $http.defaults.headers.common['Authorization'] = response.data.token;
                            $localForage.setItem('token', response.data.token);
                            cb();
                        }
                    })
            },
            function(cb) {
                $http.get(API_URL + '/consolidated').then(function(resp) {
                    $scope.data = resp;
                    if (resp.status == 200 && resp.statusText == 'OK') {
                        _.each(resp.data.interior_schemes, function(row) {
                            row.image = API_URL + '/' + row.media_file.media_url
                        });
                        _.each(resp.data.exterior_schemes, function(row) {
                            row.image = API_URL + '/' + row.media_file.media_url;
                        });
                        $localForage.setItem('property', resp.data);
                        $timeout(function() {
                            $rootScope.showLoader = false;
                        }, 500)
                    }
                });
            }
        ])

        $scope.click = function() {
            $scope.slide = 'slideInUp';
            $state.go('main.home');
            // $scope.slide = 'slideInUp';

        }

        $rootScope.$on('$stateChangeStart', function() {
            $scope.slide = 'slideInUp';
        });
    };
})();