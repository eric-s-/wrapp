﻿(function () {

    // declare dependencies
    var giftApp = angular.module('giftApp',
        ['ngRoute', 'ngResource']);

    // config
    giftApp.config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {

        // adding an interceptor for client side auth
        // follow tutorial at https://vickev.com/#!/article/authentication-in-single-page-applications-node-js-passportjs-angularjs

        var checkLoggedin = function($q, $timeout, $http, $location, $rootScope) {

            // Initialize a new promise
            var deferred = $q.defer();
            // Make an AJAX call to check if the user is logged in

            $http.get('/loggedin').success(function(user){

            // Successful authentication
            if (user !== '0') {
                $rootScope.isNotLoggedIn = false; // hide login button
                $timeout(deferred.resolve, 0);
            }

            // Not Authenticated
            else {
                $rootScope.authMessage = true; // display user feedback
                $rootScope.message = 'You must log in to do that.';
                timer = $timeout(function () {
                    $timeout.cancel(timer);
                    $rootScope.message = '';
                    $rootScope.authMessage = false;
                }, 3000);
                $timeout(function(){deferred.reject();}, 0);
                $location.url('/login'); //redirect to login page
            }
      });

      return deferred.promise;
    };

    // Interceptor for ajax calls
    $httpProvider.interceptors.push(function($q, $location) {
        return function(promise) {
            alert();
            return promise.then(
            // Success: just return the response
            function(response){
                return response;
            },
            // Error: check the error status to get only the 401
            function(response) {
                if (response.status === 401){
                    $location.url('/login');
                }

                return $q.reject(response);
            }
            );
        }
    });

        // Define application routes
        var viewBase = '/views/';

        $routeProvider
            .when('/login', {
                controller: 'LoginController',
                templateUrl: viewBase + 'login.html',
            })
            .when('/register', {
                controller: 'LoginController',
                templateUrl: viewBase + 'register.html',
            })
            .when('/ideas', {
                controller: 'GiftIdeaController',
                templateUrl: viewBase + 'gifts.html'
            })
            .when('/giftlists', {
                controller: 'GiftListsController',
                templateUrl: viewBase + 'giftLists.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .when('/giftlistedit', {
                controller: 'GiftListController',
                templateUrl: viewBase + 'giftList.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .when('/giftlist/:giftListId', {
                controller: 'GiftListGiftController',
                templateUrl: viewBase + 'giftListGifts.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            })

            .otherwise({ redirectTo: '/ideas' });

            $locationProvider.html5Mode(true);

    }]);

    giftApp.run(function($rootScope, $http){
        $rootScope.isNotLoggedIn = true;
        $rootScope.canRegister = true;
        $rootScope.message = '';

        // Logout function is available in any pages
        $rootScope.logout = function(){
            $rootScope.message = 'Logged out.';
            $http.post('/logout');
        };
    });

}());
