const mongoose = require('mongoose')

const EventSchema = new mongoose.Schema({
    eventName: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    },
    cloudinaryId: {
        type: String,
        require: true,
      },
    staffArrival: {
        type: String,
        required: true
    },
    estimatedEndTime: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    uniform: {
        type: String,
        required: true
    },
    caterer: {
        type: String,
        required: false
    },
    eventCaptain: {
        type: String,
        required: false
    },
    eventChef: {
        type: String,
        required: false
    },
    waitStaffNeeded: {
        type: Number,
        required: true
    },
    bartenderNeeded: {
        type: Number,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Event', EventSchema)