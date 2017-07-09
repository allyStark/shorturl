var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var urlSchema = new Schema({

    originalURL: String,
    shorterURL: String

}, { timestamps: true });

var ModelClass = mongoose.model('shortUrl', urlSchema);

module.exports = ModelClass;