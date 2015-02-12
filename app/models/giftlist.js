// Gift list stores gift ideas for a particular person and reason for a specific user

var mongoose = require('mongoose');
var User     = require('./user');
var Gift     = require('./gift');

// define the schema for our user model
var giftListSchema = mongoose.Schema({
    owner      : {
                     type: mongoose.Schema.ObjectId,
                     ref: 'User' // user refernce
                },
    name        : String,
    isfor        : String,
    gifts      : [Gift.schema] // array of gifts in this gift list
});

// =====================================
// ====== METHODS ======================
// =====================================

// Get all lists for a specific user
giftListSchema.statics.getListsForUser = function  (user, cb) {
    mongoose.model('GiftList', giftListSchema).find({ owner: user }, cb);
};

// Get one list by list id
giftListSchema.statics.getListById = function(id, cb) {
    mongoose.model('GiftList', giftListSchema).find( { _id: id }, cb);
};

// Remove one list given a list id
giftListSchema.statics.removeOneById = function(id, cb) {
    mongoose.model('GiftList', giftListSchema).remove( { _id: id }, cb);
};

// Add one gift to gift list
giftListSchema.statics.addGiftToList = function(id, gift) {
    mongoose.model('GiftList', giftListSchema).findOne( { _id: id }, function(err, list) {
        list.gifts.push(gift);
        list.save(function(err) {
            if (err) throw err;
        });
    });
};

// Get the owner id of a list, given the list id
giftListSchema.statics.getOwnerOfListWithId = function(listId, cb) {
    mongoose.model('GiftList', giftListSchema).findOne( { _id: listId }, function(err, list) {
        cb(list.owner);
    });
};

// Remove a gift from a list given the list and gift ids
giftListSchema.statics.removeGiftFromList = function(listid, giftid, cb) {
    mongoose.model('GiftList', giftListSchema).findByIdAndUpdate(listid, {
        $pull: {
            gifts: { _id: giftid }
        }
    }, cb);
};

// update a gift given a list id and a gift
giftListSchema.statics.updateGiftInList = function(listid, gift, cb) {
    mongoose.model('GiftList', giftListSchema).findOne({ _id: listid }, function(err, list) {
        var updatedGift = list.gifts.id(gift.id);
        updatedGift.name = gift.name;
        updatedGift.note = gift.note;
        updatedGift.amazonlink = gift.note;
        updatedGift.image = gift.image;
        list.save(cb);
    });
};

// Get all gifts
giftListSchema.statics.getAllGifts = function(cb) {
    mongoose.model('GiftList', giftListSchema).find( {} , function(err, lists) {
        if (err) console.log(err);
        var ideaList = [];
        lists.forEach(function(alist) {
            alist.gifts.forEach(function(gift) {
                ideaList.push(gift);
            });
        });
       cb(ideaList);
    });
};

// create the model for users and expose it to our app
module.exports = mongoose.model('GiftList', giftListSchema);
