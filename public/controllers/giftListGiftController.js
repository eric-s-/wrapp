// The GiftListGift controller is the biggest controller in the application.
// It handles things like added new gifts to lists, updating lists and gifts, and deletion

(function () {

    var injectParams = ['$scope', '$routeParams', '$route', '$location', '$window', '$timeout', '$anchorScroll', 'giftService'];

    var GiftListGiftController = function ($scope, $routeParams, $route, $location, $window, $timeout, $anchorScroll, giftService) {

        var timer;

        // For user feedback
        $scope.updateStatus = false;

        // Links to the external API
        $scope.amazonLink = function(url) {
            $window.open(url, '_blank');
        };

        // Add a new gift to a list using the gift service
        $scope.addGiftToGiftList = function() {
            giftService.insertGiftIntoGiftList($scope.newGift, $routeParams.giftListId).then(function(resGift) {
                $scope.giftlist.gifts.push(resGift); // update the view
                $scope.updateStatus = true; // display feedback for user
                $scope.actionMessage = "Gift created successfully";
                startTimer(); // 3 sec timeout
                goToTop();
            });
        };

        // Updates an existing gift
        $scope.updateGift = function (gift, idx) {
            // call service, dispay feedback for user
            giftService.updateGiftInGiftList(gift, $routeParams.giftListId).then(function(resGift) {
                $scope.giftlist.gifts[idx] = resGift;
                $scope.updateStatus = true;
                $scope.actionMessage = "Gift updated successfully";
                startTimer();
                goToTop();
            });
        };

        // Delete an entire gift list
        $scope.deleteGiftList = function() {
            giftService.deleteListAndGifts($routeParams.giftListId).then(function() {
                $location.path('/giftlists');
            });
        };

        // Delete one gift from a list
        $scope.deleteGift = function(giftId, idx) {
            var giftToRemove = $scope.giftlist.gifts[idx]; // get gift
            giftService.deleteSingleGift($routeParams.giftListId, giftId).then(function() {
                $scope.giftlist.gifts.splice(idx, 1);
                $scope.updateStatus = true;
                $scope.actionMessage = "Gift deleted successfully";
                startTimer();
                goToTop();
            });
        };

        // scrolls to the top of the page
        var goToTop = function() {
            $location.hash('top');
            $anchorScroll();
        };

        // Populates view with gifts for a specific gift
        function init() {
            giftService.getSpecificGiftList($routeParams.giftListId).then(function(giftlist) {
                $scope.giftlist = giftlist.data[0];
            });
        };
        init();

        // Timeout of 3 second to reset user messages
        function startTimer() {
            timer = $timeout(function () {
                $timeout.cancel(timer);
                $scope.errorMessage = '';
                $scope.updateStatus = false;
            }, 3000);
        }
    };

    GiftListGiftController.$inject = injectParams;

    angular.module('giftApp').controller('GiftListGiftController', GiftListGiftController);

}());
