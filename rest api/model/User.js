var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var users = new Schema({
    userid          : String,
    username        : String,
    email           : String,
    tel             : {type: Number,default: 0},
    photo           : String,
    friendlist      :[{type: ObjectId, ref:'Users'}],
    notification    :[{type: ObjectId, ref: 'Users'}],
    posts           :[{type: ObjectId, ref:'Posts'}],
    backgroundimg   :[{type:String, default: 'https://png.pngtree.com/thumb_back/fh260/back_pic/00/02/40/3856176f6793187.jpg'}]
})

module.exports = mongoose.model('Users', users);
