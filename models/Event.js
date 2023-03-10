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
        required: true
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
    waitstaffNeeded: {
        type: Number,
        required: true
    },
    numOfWaitstaff: {
        type: Number,
        required: true,
        default: 0
    },
    bartenderNeeded: {
        type: Number,
        required: true
    },
    numOfbartenders: {
        type: Number,
        required: true,
        default: 0
    },
    chefNeeded: {
        type: Number,
        required: true
    },
    numOfchefs: {
        type: Number,
        required: true,
        default: 0
    },
    staffReserved: {
        type: Array,
        required: true,
        default: []
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