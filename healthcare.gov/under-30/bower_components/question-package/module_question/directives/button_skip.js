(function () {
    'use strict';

    angular.module('Question').directive('buttonSkip', ['$rootScope',function ($rootScope) {

        return {
            scope: {
                label: '@label',
                t: '@'
            },
            replace: true,
            restrict: 'A',
            link: function (scope, element) {

                //TODO: remove event handlers and pub/sub on view destroy to prevent memory leaks

                var _moveForward = function(){
                    $rootScope.$broadcast("requestNewScreen", true);
                };

                scope.moveForward = function(){
                    _moveForward();
                };
            },
            templateUrl: 'bower_components/question-package/module_question/directives/templates/button_skip.html'
        };
    }]);
})();

