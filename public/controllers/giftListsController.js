// This controller displays all gift lists for a specific user

(function () {
    // Define dependencies
    var injectParams = ['$scope', '$rootScope', '$routeParams', 'giftService'];

    var GiftListsController = function ($scope, $rootScope, $routeParams, giftService) {

        $rootScope.isNotLoggedIn = false;
        $rootScope.canRegister = false;
        $rootScope.canLogOut = true;

        // populate view with all gift lists
        function init() {
            giftService.getAllGiftLists().then(function(giftlists) {
                $scope.giftlists = giftlists.data;
            });
        }
        init();
    };

    GiftListsController.$inject = injectParams;

    angular.module('giftApp').controller('GiftListsController', GiftListsController);

}());
