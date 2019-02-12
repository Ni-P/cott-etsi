const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = Schema;

const reservationSchema = new Schema({
    user: {
        type: ObjectId,
        ref: "User"
    },
    cottage: {
        type: ObjectId,
        ref: "Cottage"
    },
    date: Date
});

module.exports = mongoose.model("Reservation", reservationSchema);
