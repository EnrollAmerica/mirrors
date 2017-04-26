(function () {
    'use strict';

    angular.module('Question').directive('buttonBack', ['$rootScope',function ($rootScope) {

        return {
            scope: {
                label: '@label',
                t: '@'
            },
            replace: true,
            restrict: 'A',
            link: function (scope, element) {

                //TODO: remove event handlers and pub/sub on view destroy to prevent memory leaks

                var _moveBackward = function(){
                    $rootScope.$broadcast("requestLastScreen");
                };

                scope.moveBackward = function(){
                    _moveBackward();
                };
            },
            templateUrl: 'bower_components/question-package/module_question/directives/templates/button_back.html'
        };
    }]);
})();

