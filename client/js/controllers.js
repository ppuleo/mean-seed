/* Controllers */
angular.module('myApp.controllers', [])


/**
 * Admin Page Controller
 */
.controller('AdminCtrl', ['$scope', 'People', function ($scope, People) {

    'use strict';

    if ($scope.appState.debug) { console.log('*** AdminCtrl: Init ***'); }

    // Populate the list of people
    People.query(

        // Sucess
        function (response) {
            $scope.accounts = response;
        },

        // Failure
        function (response) {
            $scope.appState.message = {
                active: true,
                title: 'Error',
                body: response.data.message
            };
        }
    );

    // Public edit account method
    $scope.editAccount = function (_id) {
        $scope.$location.path('/myaccount/' + _id);
    };

    // Public remove account method
    $scope.removeAccount = function (_id, $index) {

        People.delete({personId: _id}, function () {
            $scope.accounts.splice($index, 1);
        });
    };
}])

/**
 * Application Controller
 */
.controller('AppCtrl', ['$scope', '$route', '$timeout', '$window', '$q', 'appState', 'People', function ($scope, $route, $timeout, $window, $q, appState, People) {

    'use strict';

    // Private Methods

    function loadApp() {


        //appState.page.access = $route.current.$$route.access;

        // Expose appState to scope here
        $scope.appState = appState;

        $scope.$route = $route;

        // Set up debugging
        if ($scope.$location.search().debug) {
            $scope.appState.debug = true;
        }

        if ($scope.appState.debug) { console.log('*** AppCtrl: Init ***'); }

        // Add the user object to appState if it's not there
        if (typeof(appState.user) === 'undefined') {

            $scope.appState.user = $window.myApp.user;
        }

        // Automatically hide 'banner style' system messages after 2 seconds.
        $scope.$watch('appState.message.active', function (newValue) {
            if (newValue === true && $scope.appState.message.type === 'banner') {
                $timeout(function () {
                    $scope.appState.message.active = false;
                }, 3000);
            }
        });

        // TEMP: Add the fastclick library since angular touch isn't working yet
        $window.addEventListener('load', function () {
            FastClick.attach(document.body);
        }, false);
    }


    // Public Methods

    /**
     * Gets the current user's Person object
     * @return {promise} Resolves to an object representing the current Person
     */
    $scope.getCurrentPerson = function () {

        // Set up a promise to return
        var deferred = $q.defer();

        People.get({personId: $scope.appState.user._id},

            // Success
            function (response) {

                // Update our appState user object with any changed values
                angular.extend($scope.appState.user, response);

                deferred.resolve(response);
            },

            // Error
            function (error) {

                deferred.resolve(error);
            }
        );

        return deferred.promise;
    };

    // Initialize the app
    loadApp();
}])

/**
 * Confirm Account Page Controller
 */
.controller('ConfirmCtrl', ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {

    'use strict';

    if ($scope.appState.debug) { console.log('*** ConfirmCtrl: Init ***'); }

    var confirmPath = '/confirm/' + $routeParams.id;

    $http.get(confirmPath)
        .success(function (data, status) {
            if (typeof(data.name) !== 'undefined') {

                $scope.title = 'Account Confirmed';
                $scope.username = data.name.first;
                $scope.message = 'Thank you. Your account has been confirmed.';
            }
            else {

                $scope.title = 'Error';
                $scope.message = 'Sorry, we were unable to confirm your account. ';
                $scope.message += 'Are you sure you signed up?';
            }
        })
        .error(function (err) {
            $scope.resent = false;
            $scope.title = 'Error';
            $scope.message = 'Sorry, we were unable to confirm your account. The server said: ' + err;
        });
}])

/**
 * Forgot Password Page Controller
 */
.controller('ForgotCtrl', ['$scope', '$http', 'appState', function ($scope, $http, appState) {

    'use strict';

    if ($scope.appState.debug) { console.log('*** ForgotCtrl: Init ***'); }

    $scope.resetSuccess = false;

    $scope.requestPasswordReset = function (userAccount) {

        var forgotPath = '/api/forgot';
        var data = {
            email: userAccount.email
        };

        $http.post(forgotPath, data)
            .success(function (data) {

                if (typeof(data.name) !== 'undefined') {

                    $scope.resetSuccess = true;
                    $scope.resetUser = data;
                }
                else {

                    appState.message = {
                        active: true,
                        type: 'alert',
                        title: 'Error',
                        body: 'Sorry, we were unable to find your account information.'
                    };
                }
            })
            .error(function (err) {

                appState.message = {
                    active: true,
                    type: 'alert',
                    title: 'Error',
                    body: 'Sorry, we were unable to send your password reset email.'
                };

                console.error(err);

            });
    };
}])

/**
 * Login Page Controller
 */
.controller('LoginCtrl', ['$scope', '$http', '$window', '$sce', function ($scope, $http, $window, $sce) {

    'use strict';

    if ($scope.appState.debug) { console.log('*** LoginCtrl: Init ***'); }

    // Set the page title
    $scope.appState.page.title = 'Login';

    $scope.login = function (account) {

        if (account.$valid) {
            var person = { email: account.email, password: account.password };
            $http.post('/login', person)
                .success(function (data, status) {

                    $scope.appState.message = {
                        active: false
                    };
                    $window.myApp.user.authenticated = true;
                    $scope.appState.user = data;
                    $scope.go('/main', 'slideDown');
                })
                .error(function (err) {

                    $scope.appState.message = {
                        active: true,
                        type: 'alert',
                        title: 'Sorry',
                        body: $sce.trustAsHtml(err)
                    };
                });
        }
        else {
            $scope.appState.message = {
                active: true,
                type: 'alert',
                title: 'Sorry',
                body: 'We do not recognize that email & password. '
            };
        }
    };

    $scope.focusField = '';
}])

/**
 * Main Page Controller
 */
.controller('MainCtrl', ['$scope', function ($scope) {

    'use strict';

    if ($scope.appState.debug) { console.log('*** MainCtrl: Init ***'); }

    $scope.$on('viewContentLoaded', function () {
        console.log('view loaded');
    });
}])

/**
 * Message Controller
 */
.controller('MessageCtrl', ['$scope', 'appState', function ($scope, appState) {

    'use strict';

    $scope.closeMessage = function () {

        appState.message.active = false;
    };
}])

/**
 * My Account Page Controller
 */
.controller('MyaccountCtrl', ['$scope', '$routeParams', '$location', 'People', 'appState', function ($scope, $routeParams, $location, People, appState) {

    'use strict';

    if ($scope.appState.debug) { console.log('*** MyaccountCtrl: Init ***'); }

    // Language options
    $scope.languageOptions = ['English US', 'Spanish'];

    if ($routeParams.id) {

        // Get the person specified
        People.get({personId: $routeParams.id},

            // Success
            function (response) {

                if (response.hasOwnProperty('name') !== false) {
                    $scope.user = response;
                }
                else {
                    $scope.appState.message = {
                        active: true,
                        type: 'alert',
                        title: 'Sorry',
                        body: 'We couldn\'t find a person with the supplied id.'
                    };
                }
            },

            // Error
            function (response) {
                appState.message = {
                    active: true,
                    type: 'alert',
                    title: 'Server Error',
                    body: response.data.message
                };
            }
        );
    }
    else {

        // Copy the user object so we can revert if form is cancelled
        $scope.user = angular.copy(appState.user);
    }

    // Update a user account
    $scope.updateAccount = function (account) {

        if (account.$valid) {

            var Person = new People($scope.user);

            Person.$update(

                // Success
                function (response) {

                    // Update our appState user object with any changed values
                    angular.extend($scope.appState.user, response);

                    // User feedback
                    appState.message = {
                        active: true,
                        type: 'banner',
                        title: 'Success',
                        body: 'Your account has been updated.'
                    };
                },

                // Error
                function (response) {
                    console.log(response);
                    appState.message = {
                        active: true,
                        type: 'alert',
                        title: 'Server Error',
                        body: response.data.message
                    };
                }
            );
        }
    };
}])

/**
 * Profile Page Controller
 */
.controller('ProfileCtrl', ['$scope', '$routeParams', 'People', '$q', function ($scope, $routeParams, People, $q) {

    'use strict';

    // Debug message
    if ($scope.appState.debug) { console.log('*** ProfileCtrl: Init'); }
}])

/**
 * Resend Confirmation Email Page Controller
 */
.controller('ResendCtrl', ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {

    'use strict';

    if ($scope.appState.debug) { console.log('*** ResendCtrl: Init ***'); }

    $scope.appState.message.active = false;

    var resendPath = '/resend/' + $routeParams.id;

    $http.get(resendPath)
        .success(function (data) {

            if (typeof(data.name) !== 'undefined') {

                $scope.title = 'Confirmation Resent';
                $scope.username = data.name.first;
                $scope.message = 'Thank you. Check your email inbox and follow the link to confirm your account. Don\'t see it? Check your spam folder and mark it as not spam.';
            }
            else {

                $scope.title = 'Error';
                $scope.message = 'Sorry, we were unable to resend your account confirmation email. ';
                $scope.message += 'Are you sure you signed up?';
            }
        })
        .error(function (err) {
            $scope.resent = false;
            $scope.title = 'Error';
            $scope.message = 'Sorry, we were unable to resend your account confirmation email. The server said: ' + err;
        });
}])

/**
 * Reset Password Page Controller
 */
.controller('ResetCtrl', ['$scope', '$http', '$routeParams', 'appState', function ($scope, $http, $routeParams, appState) {

    'use strict';

    $scope.resetPassword = function (password) {

        var resetRequest = {
            token: $routeParams.id,
            password: password
        };

        $http.post('/api/reset', resetRequest)

        .success(function (data) {

            $scope.resetSuccess = true;
        })

        .error(function (error) {

            appState.message = {
                active: true,
                type: 'alert',
                title: 'Error',
                body: 'We were unable to reset your password.'
            };
        });

    };
}])

/**
 * Settings Page Controller
 */
.controller('SettingsCtrl', ['$scope', 'People', '$http', '$window', function ($scope, People, $http, $window) {

    'use strict';

    if ($scope.appState.debug) { console.log('*** SettingsCtrl: Init ***'); }

    $scope.logout = function () {

        $http.get('/logout')
            .success(function (data, status) {
                delete $window.myApp.user;
                delete $scope.appState.user;
                $window.myApp.user = {
                    authenticated: false
                };
                $scope.go('/login', 'slideUp');
                $scope.appState.message = {
                    active: true,
                    type: 'banner',
                    title: 'Signed Out',
                    body: data.message
                };
            })
            .error(function (err) {
                $scope.go('/login', 'slideUp');
                $scope.appState.message = {
                    active: true,
                    type: 'alert',
                    title: 'Error',
                    body: err
                };
            });
    };
}])

/**
 * Signup Page Controller
 */
.controller('SignupCtrl', ['$scope', 'People', function ($scope, People) {

    'use strict';

    if ($scope.appState.debug) { console.log('*** SignupCtrl: Init ***'); }

    $scope.newAccount = {};
    $scope.focusField = '';

    // Create a person
    $scope.createAccount = function (account) {

        if (account.$valid) {

            var newPerson = new People(account); // Create a person object
            newPerson.$save(

                // Success
                function (response) {

                    $scope.newAccount = {}; // Clear the form model
                    $scope.$location.path('/login');
                    $scope.appState.message = {
                        active: true,
                        title: 'Welcome, ' + response.name.first + '!',
                        body: 'Check your inbox for an email and follow the link. Not there? Check your spam folder.'
                    };
                },

                // Error
                function (response) {
                    $scope.appState.message = {
                        active: true,
                        title: 'Sorry',
                        body: 'There was an error creating your account. The server said: ' + response.message
                    };
                }
            );
        }
    };
}]);