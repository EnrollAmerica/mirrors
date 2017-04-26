(function () {
    'use strict';

    var questions = angular.module('Question');

    questions.factory('questionsService', ['$q', '$rootScope', '$state', 'underscore', 'session', 'questionsDataService', 'questionContentService', 'transitionsService', function ($q, $rootScope, $state, _, session, dataService, questionContentService, transitionsService) {
        var QuestionsService = function (dataService) {
            $rootScope.questions = [];
            $rootScope.data = null;
            $rootScope.firstScreen = false;
            $rootScope.hideSkipQuestion = false;
            this.dataService = dataService;
        };

        $rootScope.$on('transitionBeforeDone', function(event, args) {

            if(args.transition || _.isNull(args.transition) || _.isUndefined(args.transition)){
                QuestionsService.prototype.getNextAction(args.data, 'screen');
            }else{

                return false
            }
        });

        QuestionsService.prototype.transitionBefore = function (data, callback) {
            if(_.isFunction(callback)){
                $rootScope.$broadcast('transitionBefore', {data: data, callback: callback});
            } else {
                $rootScope.$broadcast('transitionBeforeDone', {data: data, transition: true});
            }
        };

        QuestionsService.prototype.loadScreens = function(){
            var loadScreens = function (screens) {
                var screensIdx = {}, first, last;

                // load the screen array
                // index the screens array into a linked list structure for easy ref
                for (var i = 0; i < screens.length; i++) {
                    var aScreen = screens[i];
                    var id = aScreen.id;
                    var node = {
                        obj: questionContentService.processScreen(aScreen),
                        next: null
                    };

                    if (!first) {
                        first = id;
                    } else if (last) {
                        // treat as linked list to preserve order
                        screensIdx[last].next = id;
                    }

                    screensIdx[id] = node;
                    last = id;
                }

                // TODO cleanup
                return new (function(screensIndex, first) {
                    this.index = screensIndex;
                    this.first = first;

                    this.getScreen = function (screenId) {
                        var theScreen;

                        if (_.isString(screenId) && this.has(screenId)) {
                            // make a deep copy of the object
                            // to protect the original in the list
                            theScreen = angular.copy(this.getNode(screenId).obj);
                        }

                        return theScreen;
                    };

                    this.getFirstScreen = function () {
                        return this.getScreen(this.first);
                    };

                    this.getNode = function (screenId) {
                        return this.index[screenId];
                    };

                    this.has = function (screenId) {
                        return screenId && _.has(this.index, screenId);
                    };
                })(screensIdx, first);
            };

            // need to use the promise API to wait for object to be available
            // (allows for data to be loaded from a file dynamically)
            this.screensPromise = this.dataService.getScreens().then(function (screens) {
                return loadScreens(screens);
            });
        };

        /**
         * Retrieve the first screen in the traversal.
         * Returns a promise, since it is dependent on JSON file loading.
         */
        QuestionsService.prototype.getFirstScreen = function () {
            return this.screensPromise.then(function (screenIndex) {
                return screenIndex.getFirstScreen();
            });
        };

        // updated to return a promise, since it is dependent on JSON file loading
        QuestionsService.prototype.getScreen = function (screenId) {
            return this.screensPromise.then(function (screenIndex) {
                return screenIndex.getScreen(screenId);
            });
        };


        QuestionsService.prototype.showNewScreen = function (clearAnswers, beforeFilter) {
            if (!$rootScope.questions.length) return false;

            // make sure answers are set on the questions array
            var screen = $rootScope.data,
                questions = (clearAnswers)
                    ? this.clearAnswers($rootScope.questions)
                    : this.setAnswers($rootScope.questions);

            try {
                var questionServicePromise = this.nextScreen(screen, questions),
                    self = this;



                questionServicePromise.then(function (data) {

                    self.transitionBefore(data, beforeFilter);

                }, function (reason) {
                    // failed to retrieve next screen for some reason
                    alert(reason)
                });
            } catch (e) {
                // uncaught error
                alert(e);
            }
        };


        /**
         * Move the user to the next screen (if any), and update the user session
         * based on the answer.  This returns only the Destination object, with
         * screen populated to the next screen object, or results populated to
         * `true` if the user should be taken to the results screen.  (Should not
         * return screen = `null` and results = `false`, which would mean the user
         * would be taken nowhere).
         */
        QuestionsService.prototype.nextScreen = function (screen, questions) {
            var deferred = $q.defer(), self = this, goTo, setFlags, done;

            $rootScope.$on('transitionBefore', function(event, args){
                var returnBoolean = args.callback(screen, questions);
                var data = args.data;



                $rootScope.$broadcast('transitionBeforeDone', {data:data, transition:returnBoolean});
                $rootScope.$$listeners['transitionBefore'] = [];


            });


            if (!_.isObject(screen)) {
                deferred.reject('Missing required parameters (screen)');
                return deferred.promise;
            } else if (!questions) {
                questions = [];
            } else if (!_.isArray(questions)) {
                questions = [questions];
            }
            self.storeProfileForQuestions(questions);

            goTo = { question: null, screen: null, results: false, redirect: null, kickout: null };

            // TODO clean-up
            // after all of the quesitons have been processed, resolve the promise
            done = _.after(questions.length, function () {
                var storeAndResolve = function () {
                    // resolve the promise
                    if (!goTo.kickout) {
                        self.storeHistory(screen, questions, setFlags);
                        // self.storeProfileForQuestions(questions);
                    }
                    deferred.resolve(goTo);
                };

                if (!self.isCompleteDestination(goTo)) {
                    // next screen still not set, go to the next screen as defined
                    // in the array; if no more screens, go to results
                    self.getScreenNode(screen.id).then(function (node) {
                        if (node && node.next) {
                            self.getScreen(node.next).then(function (screen) {
                                goTo.screen = screen;
                                storeAndResolve();
                            });
                        } else {
                            goTo.results = true;
                            storeAndResolve();
                        }
                    });
                } else {
                    // next screen determined already, resolve
                    storeAndResolve();
                }
            });

            if (questions.length > 0) {
                // iterate over each question
                for (var i = 0; i < questions.length; i++) {
                    var question = questions[i];

                    if (question.show === false) {
                        // question wasn't visible, don't bother evaluating
                        done();
                    } else {
                        // get the next screen
                        this.getNextScreen(screen, question, question.selected).then(function (nextScreen) {
                            if (!self.isCompleteDestination(goTo)) {
                                goTo = nextScreen.goTo;
                            }
                            done();
                        }, function () {
                            done();
                        });
                    }
                }
            } else {
                done();
            }

            return deferred.promise;
        };

        /**
         * Determine the next _screen_, based on the provided answer to the given
         * question.  Returns an Action object with goTo.screen populated to the
         * next Screen object to show, or goTo.results set to `true` if the user
         * should be directed to the results page.  The setFlag parameter is
         * populated with all flags that should be set as a result of the answer.
         *
         * This method does _not_ update the user's session.
         *
         * Returns a promise, which will resolve to the defined action.
         */
        QuestionsService.prototype.getNextScreen = function (screen, question, answer) {
            var deferred = $q.defer(), nextScreen, nextAction, vm = this;

            if (!screen || !question) {
                deferred.reject('Missing required parameter (screen, question)');
                return deferred.promise;
            }

            // TODO handle invalid answer/validation errors here?

            nextScreen = { goTo: {
                previousQuestion: question,
                previousAnswer: answer,
                previousScreen: screen,
                question: null,
                screen: null,
                results: false,
                results_template: null,
                redirect: null,
                kickout: null
            }};


            nextAction = transitionsService.getAction(question.transitions, answer, question.answers);

            if (nextAction) {

                // carry over flags
                nextScreen.setFlag = nextAction.setFlag;

                // if there is a next action, use it
                if (_.has(nextAction, 'goTo')) {
                    // if the next action is to go to the results page or a screen,
                    // then carry that information over
                    // (ignore any questions)
                    // TODO cleanup; seems redundant to resolve the promise
                    if (this.isResultReference(nextAction.goTo)) {
                        nextScreen.goTo.results = true;
                        nextScreen.goTo.results_template = nextAction.goTo.results_template;
                        deferred.resolve(nextScreen);
                    } else if (this.isRedirectReference(nextAction.goTo)) {
                        nextScreen.goTo.redirect = nextAction.goTo.redirect;
                        deferred.resolve(nextScreen);
                    } else if (this.isScreenReference(nextAction.goTo)) {
                        // get the actual screen object
                        this.getScreen(nextAction.goTo.screen).then(function (screen) {

                            var checkPreconditions = function (screen) {
                                var deferred = $q.defer();

                                if (!_.isUndefined(screen.preconditions)) {
                                    var preconditionAction = transitionsService.getAction(screen.preconditions);
                                    if (preconditionAction.goTo && preconditionAction.goTo.screen) {
                                        vm.getScreen(preconditionAction.goTo.screen).then(function (screen) {
                                            checkPreconditions(screen).then(function (screen) {
                                                deferred.resolve(screen);
                                            });
                                        });
                                    } else {
                                        deferred.resolve(screen);
                                    }
                                } else {
                                    deferred.resolve(screen);
                                }

                                return deferred.promise;
                            };

                            checkPreconditions(screen).then(function (screen) {
                                nextScreen.goTo.screen = screen;
                                deferred.resolve(nextScreen);
                            });

                        });
                    } else if (this.isKickoutReference(nextAction.goTo)) {
                        nextScreen.goTo.kickout = nextAction.goTo.kickout;
                        deferred.resolve(nextScreen);
                    } else {
                        deferred.resolve(nextScreen);
                    }
                }
            }

            return deferred.promise;
        };

        /*
         * Unlike getScreen, this method returns the node object used in the list;
         * the actual screen is in node.obj, and the next node in the list is in
         * node.next.
         *
         * This returns a promise that resolves with the node object.
         */
        QuestionsService.prototype.getScreenNode = function (screenId) {
            return this.screensPromise.then(function (screenIndex) {
                var node;

                if (screenIndex.has(screenId)) {
                    node = screenIndex.getNode(screenId);
                }

                return node;
            });
        };

        QuestionsService.prototype.previousScreen = function () {
            var lastAction = session.popFromHistory(),
                deferred = $q.defer(),
                self = this;

            if (lastAction && lastAction.screen) {
                this.getScreen(lastAction.screen).then(function (lastScreen) {
                    if (lastScreen) {
                        if (_.isArray(lastAction.questions)) {
                            lastScreen.questions = lastAction.questions;
                        }
                    }

                    deferred.resolve(lastScreen);
                });
            } else {
                deferred.reject("No previous screen");
            }

            return deferred.promise;
        };

        QuestionsService.prototype.hasPreviousScreen = function () {
            return session.hasHistory();
        };

        QuestionsService.prototype.storeHistory = function (screen, questions, flags) {
            if (!screen) {
                return;
            }

            session.pushToHistory({
                screen: screen.id,
                questions: questions,
                flags: flags
            });
        };

        QuestionsService.prototype.storeProfileForQuestions = function (questions) {
            if (!_.isArray(questions)) {
                return;
            }

            for (var i = 0; i < questions.length; i++) {
                var question = questions[i];
                this.storeProfile(question.setProfile, question.selected);
            }
        };

        QuestionsService.prototype.storeProfile = function (profileAction, value) {
            if (!_.isObject(profileAction) || !_.has(profileAction, 'property')) {
                return;
            }

            // apply any modifiers to the value before saving it
            if (_.has(profileAction, 'modifier')) {
                var modifiers = (_.isArray(profileAction.modifier)) ? profileAction.modifier : [profileAction.modifier];
                value = transitionsService.applyModifiers(modifiers, value);
            }

            // set the profile property
            session.setProfileProperty(profileAction.property, value);

        };

        QuestionsService.prototype.isResultReference = function (destination) {
            return destination && _.has(destination, 'results') &&
                destination.results === true;
        };

        QuestionsService.prototype.isScreenReference = function (destination) {
            return destination && _.has(destination, 'screen') &&
                _.isString(destination.screen);
        };

        QuestionsService.prototype.isQuestionReference = function (destination) {
            return destination && _.has(destination, 'question') &&
                _.isString(destination.question);
        };

        QuestionsService.prototype.isRedirectReference = function (destination) {
            return destination && _.has(destination, 'redirect') &&
                _.isString(destination.redirect);
        };

        QuestionsService.prototype.isKickoutReference = function (destination) {
            return destination && _.has(destination, 'kickout') &&
                _.isString(destination.kickout);
        }

        QuestionsService.prototype.isCompleteDestination = function (destination) {
            return destination.screen || destination.results ||
                destination.redirect || destination.kickout;
        };

        QuestionsService.prototype.getNextAction = function (data, type) {
            var self = this;
            if (data.results && data.results === true) {
                // goto results
                self.goToResults(data);
            } else if (data.redirect) {
                //var selectedYear = session.getProfileProperty('year').value;
                // goto redirect
                //$state.go("stateExchange", { statename: data.redirect, Year: selectedYear });
            } else if (type === 'question' && data.question) {
                // show/hide questions as specified in data.question
                // data.question is an array of questions
                // each question will have property show;
                // show === false means it should be hidden; otherwise, show
                // because template ng-hide listens to model.show, don't
                // need to do anything here
            } else if (type === 'screen' && data.screen) {
                // swap to a new screen
                $rootScope.questions = [];
                this.swapScreens(data.screen);
            } else if (type === 'screen' && data.kickout) {
                // show a kickout
                // TODO implement kickout modal

                //contentService.get('questions.kickouts.' + data.kickout).then(function (content) {
                //
                //    angular.element('#kickoutModal div.modal-body h1').html(content.header);
                //    angular.element('#kickoutModal div.modal-body p').html(content.description);
                //    angular.element('#kickoutModal div.modal-body button.button1').html(content.button1.text);
                //    angular.element('#kickoutModal div.modal-body button.button2').html(content.button2.text);
                //    angular.element('#kickoutModal div.modal-body button.button1').attr("aria-label",content.button1.text);
                //    angular.element('#kickoutModal div.modal-body button.button2').attr("aria-label",content.button2.text);
                //
                //    angular.element('#kickoutModal div.modal-body button.button1').click(function(e) {
                //        e.preventDefault();
                //        window.location.href = content.button1.href;
                //    });
                //
                //    angular.element('#kickoutModal').modal('show');
                //});
            } else {
                // don't know what to do
                return;
            }
        };

        QuestionsService.prototype.goToFirstScreen = function () {
            var questionServicePromise = this.getFirstScreen(),
                self = this;

            questionServicePromise.then(function (data) {
                self.swapScreens(data);
            }, function (reason) {
                //alert('Failed: ' + reason);
            }, function (update) {
                //alert('Got notification: ' + update);
            });
        };

        QuestionsService.prototype.goToPreviousScreen = function (beforeFilter) {
            var self = this;

            if (this.hasPreviousScreen()) {
                this.previousScreen().then(function (lastScreen) {
                    $rootScope.questions = [];
                    self.transitionBefore(lastScreen, beforeFilter);
                    self.swapScreens(lastScreen);
                })
                    ['catch'](function (errorMessage) {
                });
            } else {
            }
        };

        QuestionsService.prototype.swapScreens = function (data) {
            this.setScope(data);
        };

        QuestionsService.prototype.setScope = function (data) {
            var self = this;

            if (data && data.questions.length) {
                $rootScope.data = (data);
                angular.forEach(data.questions, function (obj) {
                    // updateAnswers handles taking values in
                    // question.selected and setting them on the
                    // the appropriate answer objects in question.answers;
                    // this allows the object to define if a checkbox
                    // should be checked or not.
                    var question = self.updateAnswers(obj);
                    if (question.hasOwnProperty('text')) question.text = self.compiledQuestionText(question.text);
                    $rootScope.questions.push(question);
                });
            }

            $rootScope.firstScreen = false;
            if(data){
                $rootScope.hideSkipQuestion = data.hideskip;
            }
        };

        QuestionsService.prototype.updateAnswers = function (forQuestion) {
            // inverse of set answers
            var self = this,
                answers;

            // TODO this logic should be generalized
            if (this.allowMultiples(forQuestion) && forQuestion.selected) {
                var selected;

                if (!_.isArray(forQuestion.selected)) {
                    selected = [forQuestion.selected];
                } else {
                    selected = forQuestion.selected;
                }

                // for each answer, set answer.selected if the value is
                // contained in question.selected
                if (_.isArray(forQuestion.answers)) {
                    for (var i = 0; i < forQuestion.answers.length; i++) {
                        var answer = forQuestion.answers[i],
                            index = _.indexOf(selected, answer.id);

                        if (index >= 0) {
                            answer.selected = selected[index];
                        } else {
                            answer.selected = null;
                        }
                    }
                }

                forQuestion.selected = null;
            }

            return forQuestion;
        };

        QuestionsService.prototype.allowMultiples = function (forQuestion) {
            // TODO don't like hardcoding types here
            // should have attribute in model `allowMultiple` that if true,
            // singals multiple values are allowed (future improvement)
            return forQuestion && (forQuestion.type === 'checkbox' ||
                forQuestion.type === 'month-picker');
        };

        QuestionsService.prototype.compiledQuestionText = function(questionText) {
            // loops through the question.text object and compiles any template data
            if (typeof questionText === 'object') {
                var retQuestionText = {};
                angular.forEach(questionText, function(localizedQuestion, key) {
                    var questionTemplate = _.template(localizedQuestion);
                    retQuestionText[key] = questionTemplate(session.data);
                });
                return retQuestionText;
            } else {
                return questionText;
            }
        };

        QuestionsService.prototype.setAnswers = function (forQuestions) {
            // isolate the logic to set answers
            var self = this;

            angular.forEach(forQuestions, function (question) {

                // TODO this logic should be generalized
                // if multiples allowed, the ngmodel=answer.selected
                // so, if the value is selected, answer.selected=value;
                // otherwise, answer.selected=false
                // otherwise, all other types are mutually exclusive (for now)
                // so, their ngmodel=question.selected
                if (self.allowMultiples(question)) {
                    var selected = [];

                    // for all answer.selected values: need to combine
                    // into a single array and set it on question.selected
                    // (this is what the service expects)
                    if (_.isArray(question.answers)) {
                        for (var i = 0; i < question.answers.length; i++) {
                            var answer = question.answers[i];
                            // only add the selected value if it is truthy
                            if (_.has(answer, 'selected') && answer.selected) {
                                if (question.show !== false) {
                                    selected.push(answer.selected);
                                } else {
                                    answer.selected = null;
                                }
                            }
                        }
                    }

                    question['selected'] = selected;
                }
            });

            return forQuestions;
        };

        QuestionsService.prototype.clearAnswers = function (forQuestions) {
            // clear out all answers on the screen before continuing
            var self = this;

            angular.forEach(forQuestions, function (question ) {
                // clear out the selected answer for each question
                // TODO find an optimized way to do this
                question.selected = null;

                if (_.isArray(question.answers)) {
                    angular.forEach(question.answers, function (answer) {
                        answer.selected = null;
                    });
                }
            });

            return forQuestions;
        };

        QuestionsService.prototype.goToResults = function (questionData) {
            $rootScope.$broadcast('displayResult', questionData);
        };

        return new QuestionsService(dataService);
    }]);
})();
