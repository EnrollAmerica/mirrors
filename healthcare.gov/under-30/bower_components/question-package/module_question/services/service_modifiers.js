(function () {
'use strict';

var questions = angular.module('Question');

questions.factory('modifiersService', ['underscore', 'helper', function (_, Helper) {

    return {
        get: function () {
            return {
                'length': function (value) {
                    // get the number of selected answers
                    var valueArr = (_.isArray(value)) ? value: [value];
                    return _.compact(valueArr).length;
                },
                'objectify': function (value) {
                    // turn a JSON string into an object 
                    var obj;

                    if (!_.isString(value)) {
                        // not a JSON string, just return whatever the value was
                        return value;
                    }

                    try {
                        // attempt to parse JSON into object
                        obj = JSON.parse(value);
                    } catch (e) {
                        // bad JSON string (or not a JSON string)
                        obj = value;
                    }

                    return obj;
                },
                'property': function (value, answers, name) {
                    // get a property name from value 
                    var property;

                    if (!_.isString(name) && !_.isObject(value) && !_.isString(value)) {
                        return;
                    }

                    if (_.has(value, name)) {
                        property = value[name];
                    }

                    return property;
                },
                'longestContiguous': function (value, expected) {
                    var valueArr = (_.isArray(value)) ? value : [value],
                        answerIds = Helper.extractAnswerIds(expected),
                        groups = Helper.getContiguousGroups(valueArr, answerIds);

                    return _.size(_.max(groups, function (group) {
                        return group.length;
                    }));
                },
                'numContiguousGroups': function (value, expected) {
                    var valueArr = (_.isArray(value)) ? value : [value],
                        answerIds = Helper.extractAnswerIds(expected),
                        groups = Helper.getContiguousGroups(valueArr, answerIds);

                    return _.size(groups);
                },
                'parseCurrency': function (value) {
                    if (value === undefined || value === null) {
                        return NaN;
                    }

                    value = value.toString().replace('$', '').replace(/,/g,"");

                    return parseFloat(value);
                }
            };
        }
    };
}]);
})();
