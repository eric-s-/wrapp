// This file contains a method to retrieve an image url and product url
// using the amazon product advertising api

OperationHelper = require('json-apac').OperationHelper;
var config = require('./../config/config');

exports.getProductUrlAndImage = function(giftName, callback) {

    var imageUrl, productUrl;

    console.log(config);
    var opHelper = new OperationHelper({
        awsId: config.awsId,
        awsSecret: config.awsSecret,
        assocId: config.assocId
    });

    opHelper.execute('ItemSearch', {
        'SearchIndex': 'All',
        'Keywords': giftName, // Search key
        'ResponseGroup': 'Small'
    },
    function(err, results) {
        results = JSON.parse(results);
        productUrl = results.ItemSearchResponse.Items.Item[0].DetailPageURL;

        // Nest calls to make sure we get both values
        opHelper.execute('ItemSearch', {
        'SearchIndex': 'All',
        'Keywords': giftName,
        'ResponseGroup': 'Images'
        },
        function(err, results2) {
            results2 = JSON.parse(results2);
            var imageUrlItem = results2.ItemSearchResponse.Items.Item[0].MediumImage;
            if (typeof(imageUrlItem) != 'undefined') {
                imageUrl = results2.ItemSearchResponse.Items.Item[0].MediumImage.URL;
            } else {
                imageUrl = results2.ItemSearchResponse.Items.Item[5].MediumImage.URL;
            }
            callback(productUrl, imageUrl);
        });
    });
};

exports.getTopTenResults = function(giftName, callback) {

};
