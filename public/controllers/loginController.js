// This controller helps with login and auth methods

(function () {

    var injectParams = ['$scope', '$rootScope', '$routeParams', 'giftService', '$rootScope', '$http', '$timeout', '$location'];

    var LoginController = function ($scope, $rootScope, $routeParams, giftService, $rootScope, $http, $timeout, $location) {

        $scope.user = {};
        $rootScope.isNotLoggedIn = true;
        $rootScope.canRegister = true;
        $rootScope.canLogOut = false;

        // posts to API to log the user in
        $scope.login = function() {
            $http.post('/login', {
                username: $scope.user.email,
                password: $scope.user.password,
            })
            .success(function(user){
            // No error: authentication OK
                $rootScope.isNotLoggedIn = false;
                $rootScope.canRegister = false;
                $rootScope.canLogOut = true;
                $rootScope.message = 'Authentication successful!';
                $rootScope.authMessage = true;
                startTimer();
                $location.url('/giftlists');
            })
            .error(function(){
            // Error: authentication failed
                $rootScope.authMessage = true;
                $rootScope.message = 'Authentication failed.';
                startTimer();
                $location.url('/login');
            });
        };

        // handles registering a new user
        $scope.register = function() {
            $http.post('/register', {
                username: $scope.user.email,
                password: $scope.user.password
            })
            .success(function(user){
                $rootScope.logout();
                $location.url('/login');
            })
            .error(function() {
                $location.url('/login');
            });
        };

        // timeout helper for user feedback messages
        function startTimer() {
            timer = $timeout(function () {
                $timeout.cancel(timer);
                $rootScope.authMessage = false;
                $rootScope.message = '';
            }, 3000);
        }
    };
    LoginController.$inject = injectParams;

    angular.module('giftApp').controller('LoginController', LoginController);

}());
