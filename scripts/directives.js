(function() {
    'use strict';

    angular.module('myApp')
        .directive('errSrc', function() {
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