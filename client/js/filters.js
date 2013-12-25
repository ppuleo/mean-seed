/* Filters */

angular.module('myApp.filters', [])

.filter('padzero', function () {

    'use strict';

    return function (number, unit) {

        if (unit === 'hours') {
            if (number < 10) {
                return '0' + number;
            }

            else {
                return number.toString();
            }
        }

        else if (unit === 'minutes') {

            if (number === 0) {
                return '00';
            }

            else {
                return number.toString();
            }
        }

    };
});