(function () {
var question = angular.module('Question');

question.factory('questionContentService', ['underscore', 'session', function (_, session) {
    var QuestionContentService = function () { },
        has,
        getContent;

    has = function (object, property) {
        return _.has(object, property) && 
            (_.isObject(object[property]) || _.isString(object[property]));
    };

    getContent = function (forObject) {
        var content;

        if (_.isObject(forObject)) {
            var lang = session.get('lang');
            if (_.has(forObject, lang)) {
                content = forObject[lang];
            }
        } else if (_.isString(forObject)) {
            content = forObject;
        }

        return content;
    };

    QuestionContentService.prototype.processScreen = function (screen) {
        if (!_.isObject(screen)) {
            return screen;
        }

        if (has(screen, 'header')) {
            screen.header.content = getContent(screen.header);
        }

        if (has(screen, 'intro')) {
            screen.intro.content = getContent(screen.intro);
        }

        if (has(screen, 'questions')) {
            var questions = screen.questions;

            for (var i = 0; i < questions.length; i++) {
                questions[i] = this.processQuestion(questions[i]);
            }
        }

        return screen;
    };

    QuestionContentService.prototype.processQuestion = function (question) {
        if (!_.isObject(question)) {
            return question;
        }

        if (has(question, 'text')) {
            question.text.content = getContent(question.text);
        } 

        if (has(question, 'placeholder')) {
            question.placeholder.content = getContent(question.placeholder);
        } 

        if (has(question, 'help')) {
            question.help.content = getContent(question.help);
        }

        if (has(question, 'validation')) {
            // validation is an object with multiple properties
            var validationProperties = _.keys(question.validation);

            for (var i = 0; i < validationProperties.length; i++) {
                var property = validationProperties[i],
                    validation = question.validation[property];
                if (has(validation, 'text')) {
                    validation.text.content = getContent(validation.text);
                }
            }
        }

        if (has(question, 'answers')) {
            var answers = question.answers;

            for (var i = 0; i < answers.length; i++) {
                answers[i] = this.processAnswer(answers[i]);
            }
        }

        return question;
    };

    QuestionContentService.prototype.processAnswer = function (answer) {
        if (!_.isObject(answer)) {
            return answer;
        }

        if (has(answer, 'text')) {
            answer.text.content = getContent(answer.text);
        }

        return answer;
    };

    return new QuestionContentService();
}]);
})();