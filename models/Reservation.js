const mongoose = require('mongoose')

const ReservationSchema = new mongoose.Schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    role: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Reservation', ReservationSchema)