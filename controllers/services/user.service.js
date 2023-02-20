const User = require("../../models/User");

module.exports = {
// Find appropriate user and push eventId onto eventReserved property
    addEventToUser: async (userId, eventId) => {
        await User.findOneAndUpdate(
            { _id: userId},
            { $push: { eventReserved: eventId } }
        )
    }
}