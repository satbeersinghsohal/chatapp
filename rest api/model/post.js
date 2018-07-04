var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var post = new Schema({
    From : [],
    Text : String,
    postaddress : String,
    Photolink: String,
    Likes:{type:Number, default:0},
    userlikes:[{type:String}],
    Shares:{type:Number, default:0},
    comments:[]
})

module.exports = mongoose.model('Posts', post);
