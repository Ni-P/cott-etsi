const mongoose = require("mongoose");
var passportLocalMongoose = require('passport-local-mongoose');
var { Schema } = mongoose;
const { ObjectId } = Schema;

var UserSchema = new Schema({
    username: String,
    password: String,
    firstname: String,
    lastname: String,
    address: String,
    postalCode: Number,
    phone: Number,
    email: String,
    admin: Boolean,
    reservations: [{
            type: ObjectId,
            ref: "Reservation"
        }
    ]
});

UserSchema.plugin(passportLocalMongoose);

// console.log(typeof (mongoose.models.users));

module.exports = mongoose.models && mongoose.models.User
    ? mongoose.models.User
    : mongoose.model('User', UserSchema);
