/**
 * Main App Object
 * @type {Object}
 */
var myApp = window.myApp || {};


// Declare the main app level module which depends on filters, controllers, and services
myApp.app = angular.module('myApp', [
    'ngRoute',
    'ngSanitize',
    'ngResource',
    'ngAnimate',
    //'ngTouch',
    'myApp.filters',
    'myApp.services',
    'myApp.directives',
    'myApp.controllers',
    'ui.map'
]);

// Initialize the myApp module
myApp.app.run(['$rootScope', '$location', '$window', function ($rootScope, $location, $window) {

    'use strict';

    // Provide the current location to all scopes
    $rootScope.$location = $location;

    /**
     * Helper method for main page transitions. Useful for specifying a new page partial and an
     * arbitrary transition.
     * @param  {String} path               The root-relative url for the new route
     * @param  {String} pageAnimationClass A classname defining the desired page transition.
     */
    $rootScope.go = function (path, pageAnimationClass) {

        // Default animation is crossfade.
        if (typeof(pageAnimationClass) === 'undefined') {
            $rootScope.pageAnimationClass = 'crossFade';
        }
        else {
            $rootScope.pageAnimationClass = pageAnimationClass;
        }

        if (path === 'back') {
            $window.history.back();
        }
        else {
            $location.path(path);
        }
    };

    // Don't allow state changes to non-public pages if the user is not logged in.
    $rootScope.$on('$routeChangeStart', function (current, next) {

        if (!$window.myApp.user.authenticated && next.access !== 'public') {
            current.preventDefault();
            $location.path('/login');
        }
    });
}]);

// myApp module config
myApp.app.config(['$routeProvider', function ($routeProvider) {

    'use strict';

    $routeProvider

        .when('/admin', {
            templateUrl: 'pages/admin.html',
            controller: 'AdminCtrl',
            access: 'private'
        })
        .when('/confirm/:id', {
            templateUrl: 'pages/confirm.html',
            controller: 'ConfirmCtrl',
            access: 'public'
        })
        .when('/forgot', {
            templateUrl: 'pages/forgot.html',
            controller: 'ForgotCtrl',
            access: 'public'
        })
        .when('/forgotconfirm', {
            templateUrl: 'pages/forgotconfirm.html',
            access: 'public'
        })
        .when('/login', {
            templateUrl: 'pages/login.html',
            controller: 'LoginCtrl',
            access: 'public'
        })
        .when('/main', {
            templateUrl: 'pages/main.html',
            controller: 'MainCtrl',
            access: 'private'
        })
        .when('/myaccount/:id?', {
            templateUrl: 'pages/myaccount.html',
            controller: 'MyaccountCtrl',
            access: 'private'
        })
        .when('/privacy', {
            templateUrl: 'pages/privacy.html',
            access: 'public'
        })
        .when('/profile/:id?', {
            templateUrl: 'pages/profile.html',
            controller: 'ProfileCtrl',
            access: 'private'
        })
        .when('/resend/:id', {
            templateUrl: 'pages/resend.html',
            controller: 'ResendCtrl',
            access: 'public'
        })
        .when('/reset', {
            templateUrl: 'pages/reset.html',
            access: 'public'
        })
        .when('/settings', {
            templateUrl: 'pages/settings.html',
            controller: 'SettingsCtrl',
            access: 'private'
        })
        .when('/signup', {
            templateUrl: 'pages/signup.html',
            controller: 'SignupCtrl',
            access: 'public'
        })
        .otherwise({ redirectTo: '/main'});
}]);