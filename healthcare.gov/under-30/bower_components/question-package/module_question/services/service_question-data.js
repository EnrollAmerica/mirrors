(function () {
'use strict';

var questions = angular.module('Question');

questions.factory('questionsDataService', ['$http', '$q', 'underscore', 'session', function ($http, $q, _, session) {
    var QuestionsDataService = function () {

    };

    QuestionsDataService.prototype.dataPath = null;

    QuestionsDataService.prototype.getData = function () {
        var self = this, deferred = $q.defer();

        if (! _.isNull(this.getDataPath())) {
            $http.get(this.getDataPath())
                .success(function (data) {
                    self.data = data;
                })
                .error(function (data) {
                    self.data = {}
                })
                ['finally'](function (data) {
                    deferred.resolve(self.data);
            });
        }


        return deferred.promise;
    };

    QuestionsDataService.prototype.getScreens = function () {
        var self = this, deferred = $q.defer();

        self.getData().then(function (data) {
            var screens;

            if (_.has(data, 'screens')) {
                screens = data.screens;
            } else {
                screens = [];
            }

            deferred.resolve(screens);
        });

        return deferred.promise;
    };

    QuestionsDataService.prototype.setDataPath = function(path) {
        var path = _.isNull(path) ? null : path;
        this.dataPath = path;
    }

    QuestionsDataService.prototype.getDataPath = function() {
        return this.dataPath;
    }

    return new QuestionsDataService();    
}]);
})();