// Gift list controller handles the creation of new gifts

(function () {

    var injectParams = ['$scope', '$rootScope', '$routeParams', '$location', 'giftService'];

    var GiftListController = function ($scope, $rootScope, $routeParams, $location, giftService) {

        // Creates a new gift and calls the gift service to save it to the database
        $scope.saveGiftList = function() {
                giftService.insertGiftList($scope.giftlist).then(function() {
                    $location.path('/giftlist/' + $scope.giftlist.id);
                });
        };
    };
    // dependancy injection
    GiftListController.$inject = injectParams;

    angular.module('giftApp').controller('GiftListController', GiftListController);

}());
