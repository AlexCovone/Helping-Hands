const User = require("../../models/User");
const Event = require("../../models/Event");

module.exports = {
// Find appropriate user and push eventId onto eventReserved property
    addEventToUser: async (userId, eventId) => {
        await User.findOneAndUpdate(
            { _id: userId},
            { $push: { eventReserved: eventId } }
        )
    },
    filterEventsByUser: async (userId) => {
        const events = await Event.find();

        // Filter through Events collection and loop through staffReserved property
        const matchedEvents = events.filter(event => {
            for(let i = 0; i < event.staffReserved.length; i++){
                if(event.staffReserved[i][0] === userId){
                    return event
                }
            }
        })
        return matchedEvents
    }
}