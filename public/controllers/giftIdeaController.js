// Gift Idea controller handles the gift idea page that doesn't require log in

(function () {

    // Dependencies
    var injectParams = ['$scope', '$rootScope', '$routeParams', '$timeout','$window', 'giftService'];

    var GiftIdeaController = function ($scope, $rootScope, $routeParams, $timeout, $window, giftService) {

        if (typeof($rootScope.isNotLoggedIn) == 'undefined') {
            $rootScope.isNotLoggedIn = true;
            $rootScope.canRegister = true;
        }

        $scope.errorMessage = false;

        // Method to redirect the user to the correct amazon page
        $scope.amazonLink = function(url) {
            // No amazon link - display message to user
            if (!url) {
                $scope.errorMessage = true;
                timer = $timeout(function () {
                    $timeout.cancel(timer);
                    $scope.errorMessage = '';
                }, 3000);
            }
            // Redirect
            else {
                $window.open(url, '_blank');
            }
        }

        // Populates list of gift ideas
        function init() {
            giftService.getIdeas().then(function(giftideas) {
                $scope.giftideas = giftideas.data;
            });
        };
        init();
    };

    GiftIdeaController.$inject = injectParams;

    angular.module('giftApp').controller('GiftIdeaController', GiftIdeaController);

}());
