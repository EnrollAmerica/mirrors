'use strict';

var Session = angular.module('Session');

/*
 * Session Factory
 *
 * Stores application session data, ie. user profile, screener history.
 *
 */

Session.factory('session', ['underscore', 'helper', 'obj', function (_, Helper, Obj) {

    /**
     * Constructor
     *
     * @constructor
     */
    var session = function(){
        this.data = {
            "profile": {},
            "history": []
        }
    };

    session.prototype = new Obj;
    session.prototype.constructor = session;
    session.prototype.parent = Obj.prototype;

    session.prototype.pushToHistory = function (history) {
        if (!_.isObject(history)) {
            return;
        }

        this.data.history.push(history);
    };

    session.prototype.popFromHistory = function () {
        return this.data.history.pop(history);
    };

    session.prototype.hasHistory = function () {
        return this.data.history.length > 0;
    };

    session.prototype.getHistory = function () {
        return this.data.history;
    };

    session.prototype.getProfile = function () {
        return angular.copy(this.data.profile);
    };

    session.prototype.getProfileProperty = function (property) {
        var value;

        if (this.hasProfileProperty(property)) {
            value = this.data.profile[property];
        }

        return value;
    };

    session.prototype.setProfileProperty = function (property, value) {
        if (_.isString(property)) {
            this.data.profile[property] = value;
        }
    };

    session.prototype.hasProfileProperty = function (property) {
        return _.has(this.data.profile, property);
    };

    return new session();
}]);