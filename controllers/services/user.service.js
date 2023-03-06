const User = require("../../models/User");
const Event = require("../../models/Event");

module.exports = {
// Find appropriate user and push eventId onto eventReserved property
    addEventToUser: async (userId, eventId) => {
        await User.findOneAndUpdate(
            { _id: userId},
            { $push: { eventsReserved: eventId } }
        )
    },
    filterEventsByUser: async (userId) => {
        const user = await User.findById(userId);
        const userEvents = await Event.find({
            _id: { $in: user.eventsReserved }
        });
        return userEvents;
    }
}