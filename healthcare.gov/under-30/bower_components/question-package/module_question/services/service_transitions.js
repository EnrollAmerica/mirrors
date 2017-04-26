(function () {
'use strict';

var questions = angular.module('Question');

/*
 * Transition Service handles determining how the user should move from 
 * one action to another, given the user provided answer to a question.  
 *
 * Transitions support _modifiers_, and _operators_.  Modifiers are applied to 
 * the user's answer value before checking the value.  Operators are used to 
 * define the boolean operation to use to determine if the answer matches 
 * the transition conditions.  The logic for modifiers and operators are 
 * defined in their respective services.  
 */ 

questions.factory('transitionsService', ['underscore', 'modifiersService', 'operatorsService', function (_, modifiersService, operatorsService) {
    var TransitionsService = function (modifiers, operators) {
        this.modifiers = modifiers;
        this.operators = operators;
    };

    TransitionsService.prototype.getOperator = function (name) {
        if (!name || !this.hasOperator(name)) {
            return _.noop;
        }

        return this.operators[name];
    };

    TransitionsService.prototype.getModifier = function (name) {
        if (!name || !this.hasModifier(name)) {
            return _.noop;
        }

        return this.modifiers[name];
    };

    TransitionsService.prototype.hasOperator = function (name) {
        return _.isString(name) && _.has(this.operators, name);
    };

    TransitionsService.prototype.hasModifier = function (name) {
        return _.isString(name) && _.has(this.modifiers, name);
    };

    TransitionsService.prototype.getDependentQuestions = function (transitions) {
        var dependent = [];

        if (!_.isArray(transitions)) {
            return dependent;
        }

        for (var i = 0; i < transitions.length; i++) {
            var transition = transitions[i];

            if (_.has(transition, 'action') && _.has(transition.action, 'goTo')) {
                var destination = transition.action.goTo;

                if (_.has(destination, 'question')) {
                    dependent.push(destination.question);
                }
            }
        }

        return dependent;
    };

    TransitionsService.prototype.applyModifiers = function (modifiers, value, validAnswers) {
        if (!_.isArray(modifiers)) {
            return value;
        } else if (!validAnswers) {
            validAnswers = null;
        }

        // loop over all modifiers, and apply them in order
        for (var j = 0; j < modifiers.length; j++) {
            var modifierStr = modifiers[j];
            if (_.isString(modifierStr)) {
                // split modifier into parts using whitespace
                // first part is the name of the modifier to apply
                // other parts are arguments to pass to the modifier 
                var modifierParts = modifierStr.split(/\s+/),
                    modifierName = modifierParts.shift();

                if (this.hasModifier(modifierName)) {
                    var modifier = this.getModifier(modifierName);

                    // put the cur value to the front of the array 
                    // (needs to be the first argument to the modifier)
                    modifierParts.unshift(validAnswers);
                    modifierParts.unshift(value);
                    // then, call the modifier with given arguments
                    value = modifier.apply(null, modifierParts);
                }
            }
        }

        return value;
    };

    TransitionsService.prototype.getAction = function (transitions, answer, validAnswers) {
        var finalAction = { goTo: null, setFlag: [] }, util;

        if (!_.isArray(transitions)) {
            return finalAction;
        }

        util = {
            areCompleteConditions: function (conditions) {
                return _.isArray(conditions) &&
                    _.every(conditions, function (condition) { 
                        return util.isCompleteCondition(condition); 
                    });
            },
            isCompleteCondition: function (condition) {
                return _.isObject(condition) &&
                    _.has(condition, 'operator');
            },
            isCompleteTransition: function (transition) {
                // requires operator, and action
                return _.isObject(transition) && 
                    _.has(transition, 'action') &&
                    util.areCompleteConditions(transition.conditions);
            },
            mergeActions: function (action1, action2) {
                if (!_.isObject(action1.goTo)) {
                    // only set the goTo object if it has not already been set
                    // (this object can only be set once)
                    action1.goTo = action2.goTo;
                }
                // combine flags 
                action1.setFlag = _.union(action1.setFlag, action2.setFlag);
                return action1;
            }
        };

        // iterate over each transition, and check if it applies to the 
        // provided answer; if so, update the finalAction object
        for (var i = 0; i < transitions.length; i++) {
            var transition = transitions[i];

            if (util.isCompleteTransition(transition)) {
                var conditions = transition.conditions, 
                    matchesConditions = true,
                    conditionsCount = 0;

                // loop over all conditions 
                while(matchesConditions && conditionsCount < conditions.length) {
                    var value = answer,
                        condition = conditions[conditionsCount++];

                    // apply any modifiers first
                    if (_.isString(condition.modifier) || _.isArray(condition.modifier)) {
                        var modifiers = (_.isArray(condition.modifier)) 
                            ? condition.modifier : [condition.modifier];
                        value = this.applyModifiers(modifiers, value, validAnswers);
                    }

                    // then use the operator to determine if this is a match
                    if (this.hasOperator(condition.operator)) {
                        var operator = this.getOperator(condition.operator);
                        var expected = condition.value;

                        matchesConditions = operator(value, expected);
                    } else {
                        matchesConditions = false;
                    }
                }

                // if all the conditions match, then apply this action
                if (matchesConditions) {
                    finalAction = util.mergeActions(finalAction, 
                        transition.action);
                }
            }
        }

        return finalAction;
    };

    return new TransitionsService(modifiersService.get(), operatorsService.get());
}]);
})();
