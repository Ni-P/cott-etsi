const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = Schema;

const cottageSchema = new Schema({
    name: String,
    location: String,
    reserved: {
        id: {
            type: ObjectId,
            ref: "User"
        },
        username: String
    },
    image: String,
    price: Number,
    description: String
});

module.exports = mongoose.model("Cottage", cottageSchema);