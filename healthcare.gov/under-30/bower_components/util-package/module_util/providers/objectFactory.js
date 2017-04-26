'use strict';

var Util = angular.module('Util');

Util.factory('obj', ['underscore', 'helper', function(_, Helper){


    var coreObject = function(){
        this.data = {};
        this.id = Math.random().toString(36).substring(7);
    };


    /**
     * Store key, value pair into thisData
     *
     * @param key
     * @param value
     */
    coreObject.prototype.set = function (key, value) {
        this.data[key] = value;
    };

    /**
     * Retrieve an element stored in thisData store
     *
     * @param key
     * @returns {*}
     */
    coreObject.prototype.get = function (key) {
        var data = Helper.getPropertyFromPath(key, this.data);

        if( data ){
            return data;
        }else{
            return null;
        }
    };

    coreObject.prototype.insert = function (key, insert) {
        var element = this.get(key);

        if(_.isObject(insert)){
            _.each(insert, function (value, key) {
                element[key] = value;
            });
        }
    };

    /**
     * Check if a key exists in the this object
     *
     * @param key
     * @returns boolean
     */
    coreObject.prototype.has = function (key) {
        return _.has(this.data, key);
    };

    /**
     * Reset the thisData
     *
     */
    coreObject.prototype.reset = function () {
        this.data = {};
    };

    return coreObject;

}]);