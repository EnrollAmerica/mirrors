'use strict';

var Config = angular.module('Config');

/*
 * Config Factory
 *
 * 
 *
 */

Config.factory('config', ['$rootScope', '$http', '$q', 'underscore', 'obj', 'session', 'helper', function ($rootScope, $http, $q, _, Obj, Session, Helper) {

    var deferred = $q.defer();

    /**
     * Constructor
     *
     * @constructor
     */
    var config = function (path) {
        this.path = path;
        this.promise = getConfig(this.path, this);
    };

    config.prototype = new Obj;
    config.prototype.constructor = config;
    config.prototype.parent = Obj.prototype;


    var getConfig = function (path, context) {

        if (! _.isEmpty(path)) {
            $http.get(path)
                .success(function (data) {
                    context.data = data;
                    $rootScope.$broadcast('$configLoaded');
                })
                .error(function () {
                    context.data = {}
                })
                ['finally'](function (data) {
                deferred.resolve(context.data);
            });
        }else{
            deferred.resolve(context.data);
        }

        return deferred.promise;
    };

    config.prototype.getData = function () {
        var self = this;

        return deferred.promise.then(function (data) {
            return self.data;
        });
    };

    /**
     * Store key, value pair into thisData
     *
     * @param key
     * @param value
     */
    config.prototype.set = function (key, value) {
        var self = this;

        return deferred.promise.then(function (data) {
            self.data[key] = value;
        });
    };

    /**
     * Retrieve an element stored in thisData store
     *
     * @param key
     * @returns {*}
     */
    config.prototype.get = function (key) {
        var self = this;

        return deferred.promise.then(function (data) {
            var data = Helper.getPropertyFromPath(key, self.data);

            if( data ){
                return data;
            }else{
                return null;
            }
        });
    };

    config.prototype.insert = function (key, insert) {
        var self = this;

       return deferred.promise.then(function (data) {
            var element;

            self.get(key).then(function (data) {
                element = data;
                if(_.isObject(insert)){
                    _.each(insert, function (value, key) {
                        element[key] = value;
                    });
                }
            });
        });
    };

    /**
     * Check if a key exists in the this object
     *
     * @param key
     * @returns boolean
     */
    config.prototype.has = function (key) {
        var self = this;

        return deferred.promise.then(function (data) {
            return _.has(self.data, key);
        });
    };

    config.prototype.isSpanishLocation = function () {
        var self = this;

        return deferred.promise.then(function (data) {
            var spanishDomain = self.get('site.spanish.domain').then(function () {
                return window.location.host.indexOf(spanishDomain) >= 0 ||
                    window.location.pathname.indexOf('/es/') >= 0;
            });

            return spanishDomain;

        });
    };

    config.prototype.getLanguage = function () {
        var self = this;

        return deferred.promise.then(function (data) {
            return self.isSpanishLocation().then(function (data) {
                return data ? self.get('site.spanish.lang') : self.get('site.english.lang');
            });
        });
    };

    return config;

}]);