// Gift Model represents a gift idea

var mongoose = require('mongoose');

var giftSchema = mongoose.Schema({
    name       : String, // Name of gift - used for APAC queries
    note       : String,
    amazonlink : String, // Amazon affiliate link
    image      : String // Amazon image url
});

module.exports = mongoose.model('Gift', giftSchema); // expose
