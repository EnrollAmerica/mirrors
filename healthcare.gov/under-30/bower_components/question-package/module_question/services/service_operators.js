(function () {
'use strict';

var questions = angular.module('Question');

questions.factory('operatorsService', ['underscore', 'session', function (_, session) {
    return {
        get: function () {
            return {
                'eq': function (actual, expected) {
                    return actual == expected;
                },
                'lt': function (actual, expected) {
                    return actual < expected;
                },
                'gt': function (actual, expected) {
                    return actual > expected;
                },
                'lte': function (actual, expected) {
                    return actual <= expected;
                },
                'gte': function (actual, expected) {
                    return actual >= expected;
                },
                'not': function (actual, expected) {
                    return actual != expected;
                },
                'all': function (actual, expected) {
                    // all values in expected must be in actual
                    // actual cannot contain any other values
                    var actualArr = (_.isArray(actual)) ? actual : [actual];
                    var expectedArr = (_.isArray(expected)) ? expected : [expected];
                    var containsAll = _.every(expectedArr, function (val) {
                        var match = false, i = 0;
                        while (!match && i < actualArr.length) {
                            match = val == actualArr[i++];
                        }
                        return match;
                    });

                    return containsAll && actualArr.length === expectedArr.length;
                },
                'allAllowOthers': function (actual, expected) {
                    // all values in expected must be in actual
                    // actual can contain other values
                    var actualArr = (_.isArray(actual)) ? actual : [actual];
                    var expectedArr = (_.isArray(expected)) ? expected : [expected];
                    var containsAll = _.every(expectedArr, function (val) {
                        var match = false, i = 0;
                        while (!match && i < actualArr.length) {
                            match = val == actualArr[i++];
                        }
                        return match;
                    });

                    return containsAll;
                },
                'some': function (actual, expected) {
                    // at least one value from expected must be in actual
                    // actual can contain other values
                    var actualArr = (_.isArray(actual)) ? actual : [actual];
                    var expectedArr = (_.isArray(expected)) ? expected : [expected];
                    var containsSome = _.some(expectedArr, function (val) {
                        var match = false, i = 0;
                        while (!match && i < actualArr.length) {
                            match = val == actualArr[i++];
                        }
                        return match;
                    });

                    return containsSome;
                },
                'only': function (actual, expected) {
                    // at least one value from expected must be in actual
                    // actual cannot contain any other values
                    var actualArr = (_.isArray(actual)) ? actual : [actual];
                    var expectedArr = (_.isArray(expected)) ? expected : [expected];
                    var containsAll = _.every(actualArr, function (val) {
                        var match = false, i = 0;
                        while (!match && i < expectedArr.length) {
                            match = val == expectedArr[i++];
                        }
                        return match;
                    });

                    return containsAll;
                },
                'none': function (actual, expected) {
                    // none of the values from expected can be in actual
                    // (only other values allowed in actual)
                    var actualArr = (_.isArray(actual)) ? actual : [actual];
                    var expectedArr = (_.isArray(expected)) ? expected : [expected];
                    var containsNone = _.every(expectedArr, function (val) {
                        var match = false, i = 0;
                        while (!match && i < actualArr.length) {
                            match = val == actualArr[i++];
                        }
                        return !match;
                    });

                    return containsNone;
                },
                'hasAllFlags': function (value, expectedFlags) {
                    // ignore value, checking the session here against the
                    // expected values
                    if (!expectedFlags) {
                        return false;
                    } else if (!_.isArray(expectedFlags)) {
                        expectedFlags = [expectedFlags];
                    }

                    return _.every(expectedFlags, function (flag) {
                        return session.hasFlag(flag);
                    });
                },
                'hasSomeFlags': function (value, expectedFlags) {
                    // ignore value, checking the session here against the
                    // expected values
                    if (!expectedFlags) {
                        return false;
                    } else if (!_.isArray(expectedFlags)) {
                        expectedFlags = [expectedFlags];
                    }

                    return _.some(expectedFlags, function (flag) {
                        return session.hasFlag(flag);
                    });
                },
                'hasNoFlags': function (value, expectedFlags) {
                    // ignore value, checking the session here against the
                    // expected values
                    if (!expectedFlags) {
                        return false;
                    } else if (!_.isArray(expectedFlags)) {
                        expectedFlags = [expectedFlags];
                    }

                    return _.every(expectedFlags, function (flag) {
                        return !session.hasFlag(flag);
                    });
                },
                'inState': function (value, expectedFlags) {
                    // ignore value, checking the session here for user's selected state
                    // against the expected values
                    if (!expectedFlags) {
                        return false;
                    } else if (!_.isArray(expectedFlags)) {
                        expectedFlags = [expectedFlags];
                    }

                    var userLocation = session.getProfileProperty("location");

                    return(_.indexOf(expectedFlags, userLocation.state) > -1);
                },
                'notInState': function (value, expectedFlags) {
                    // ignore value, checking the session here for user's selected state
                    // against the expected values
                    if (!expectedFlags) {
                        return false;
                    } else if (!_.isArray(expectedFlags)) {
                        expectedFlags = [expectedFlags];
                    }

                    var userLocation = session.getProfileProperty("location");

                    return(_.indexOf(expectedFlags, userLocation.state) < 0);
                },
                'default': function () {
                    // default always matches
                    return true;
                }
            };
        }
    };
}]);
})();
