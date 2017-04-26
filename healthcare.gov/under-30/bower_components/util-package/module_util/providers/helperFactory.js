'use strict';

var Util = angular.module('Util');

/**
 * 
 *
 * 
 *
 */
Util.factory('helper', ['underscore', function(_) {

    return {

        /**
         * Return a property from an object
         *
         * Support chaining of property to return deep properties
         *
         * ie. obj.one.two.three
         *
         * @param path
         * @param fromObject
         * @param deliminator
         * @returns {*}
         */
        getPropertyFromPath: function (path, fromObject, deliminator) {
            var parts, curProperty, curObject, i, propertyVal;

            if (!deliminator) {
                deliminator = '.';
            }

            parts = _.isString(path) ? path.split(deliminator) : [];
            curObject = fromObject;
            i = 0;

            if (_.isEmpty(parts)) {
                return;
            }

            while (curObject && i < parts.length) {
                if (_.has(curObject, parts[i])) {
                    curObject = curObject[parts[i]];
                } else {
                    curObject = undefined;
                }

                i += 1;
            }

            return curObject;
        },

        getContiguousGroups: function (values, expectedOrder) {
            var groups = [],
                curGroup = [],
                lastIndex;

            if (!_.isArray(values) || !_.isArray(expectedOrder)) {
                return groups;
            }

            for (var i = 0; i < values.length; i++) {
                var index = _.indexOf(expectedOrder, values[i]);

                if (index >= 0) {
                    if (_.isUndefined(lastIndex) || lastIndex + 1 == index) {
                        // part of a continguous group, add to grouping
                        curGroup.push(values[i]);
                    } else {
                        // new group, store the old group and start fresh
                        groups.push(curGroup);
                        curGroup = [values[i]];
                    }

                    // update last index
                    lastIndex = index;
                }
            }

            // add the last group
            if (curGroup.length > 0) {
                groups.push(curGroup);
            }

            return groups;
        },

        extractAnswerIds: function (fromAnswers) {
            if (_.isUndefined(fromAnswers) || _.isNull(fromAnswers)) {
                return [];
            } else if (!_.isArray(fromAnswers)) {
                return [fromAnswers.id];
            } else {
                return _.pluck(fromAnswers, 'id');
            }
        },

        formatString: function (formatStr) {
            var params = _.toArray(arguments).slice(1);

            if (!_.isString(formatStr)) {
                return '';
            }

            return formatStr.replace(/{(\d+)}/g, function (match, number) {
                // replace the placeholder with the argument, or blank str
                return !_.isUndefined(params[number]) ? params[number] : '';
            });
        }


    }

}]);