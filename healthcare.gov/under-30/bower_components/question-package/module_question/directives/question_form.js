(function () {

    "use strict";

    angular.module('Question')
        .directive("questionForm", ['$timeout', function($timeout) {
            return {
                restrict: 'EA',
                transclude: true,
                scope:{
                    data: "="
                },
                controller: 'QuestionFormController',
                templateUrl: 'bower_components/question-package/module_question/directives/templates/form.html',
                replace: true,
                link: function(scope,element,attrs){

                    scope.$watch(function(){
                        return element.hasClass('ng-valid');
                    },function(newVal){
                        if(newVal){
                            $('#questionNext').prop("disabled",false);
                        } else {
                            $('#questionNext').prop("disabled",true);
                        }
                    });



                }
            };
        }])
})();





