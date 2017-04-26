'use strict';

var Util = angular.module('Util');

/**
 * UnderscoreJS Util Factory
 *
 * Make underscore injectable within angular, to minize errors with testing or using 'strict' mode
 *
 */
Util.factory('underscore', function() {
    return window._; // assumes underscore has already been loaded on the page
});