// Gift service handles API calls in the client

(function () {

    var injectParams = ['$http', '$q'];

    var giftFactory = function ($http, $q) {
        var serviceBase = '/api/',
            factory = {};

        // gets all gift ideas
        factory.getIdeas = function () {
            return $http.get(serviceBase + 'ideas');
        };

        // gets all gift lists the logged in user
        factory.getAllGiftLists = function () {
            return $http.get(serviceBase + 'giftlists');
        };

        // gets a specific gift list for user
        factory.getSpecificGiftList = function (giftListId) {
            return $http.get(serviceBase + 'giftlists/' + giftListId);
        };

        // creates a new gift list for a user
        factory.insertGiftList = function (giftList) {
            return $http.post(serviceBase + 'giftlists', giftList).then(function (results) {
                giftList.id = results.data;
            });
        };

        // creates and inserts a new gift into an existing user gift list
        factory.insertGiftIntoGiftList = function(gift, giftListId) {
            return $http.post(serviceBase + 'giftlists/' + giftListId + '/gifts', gift).then(function(res) {
                return res.data;
            });
        };

        // updates an existing gift
        factory.updateGiftInGiftList = function(gift, giftListId) {
            return $http.put(serviceBase + 'giftlists/' + giftListId + '/gifts/' + gift._id, gift).then(function(res) {
                return res.data;
            });
        };

        // deletes a single gift from a list
        factory.deleteSingleGift = function(giftListId, giftId) {
            return $http.delete(serviceBase + 'giftlists/' + giftListId + '/gifts/' + giftId);
        };

        // deletes an entire gift list
        factory.deleteListAndGifts = function(giftListId) {
            return $http.delete(serviceBase + 'giftlists/' + giftListId);
        };

        return factory;
    };

    // dependency injection
    giftFactory.$inject = injectParams;

    angular.module('giftApp').factory('giftService', giftFactory);

}());
