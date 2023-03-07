const Event = require("../../models/Event");
const { convertDateToEnUs, convertTo12HourFormat } = require("../services/helperFunctions")

module.exports = {
    getUpcomingEvents: async (events) => {
        const filter =  { date: { $gte: new Date()} }
      
        if(events){
          const eventIds = events.map(event => event._id);
          filter._id = { $in: eventIds };
        }

        const upcomingEvents = await Event.aggregate([
            { $match: filter },
            { $sort: {date: 1} }
        ])      
        return upcomingEvents;
    },

    getPreviousEvents: async (events) => {
        const filter = { date: { $lte: new Date() } }

        if(events){
            const eventIds = events.map(event => event._id);
            filter._id = {$in: eventIds }
        }

        const previousEvents = await Event.aggregate([
            { $match: filter },
            { $sort: {date: -1} }
        ])
        return previousEvents
    },

    // Converts date and time for feed rendering
    getEventDetails: (events) => {
        return events.map(event => {
            const staffArrival = convertTo12HourFormat(event.staffArrival)
            const estimatedEndTime = convertTo12HourFormat(event.estimatedEndTime)
            const date = convertDateToEnUs(event.date)
            return {...event, staffArrival, estimatedEndTime, date}
        })
    },
    
    // Checks if userId is in staffReserved property
    checkUserReserved: (staffReserved, userId) => {
        return staffReserved.some(subArr => subArr.includes(userId))
    },

    // Define object that maps the occupation roles to corresponding property in Event model
    // Get corresponding object property name from occupationRole (req.body.occupationRole)
    // Ex: 'Waitstaff => 'waitstaffNeeded'
    getRoleNeeded: (occupationRole) => {
        const neededRoles = {
            'Waitstaff': 'waitstaffNeeded',
            'Bartender': 'bartenderNeeded',
            'Chef': 'chefNeeded'
        }
        return neededRoles[occupationRole]
    },

    // Decrement appropriate role upon request (-1)
    decreaseSpotsLeft: async (eventId, roleNeeded) => {
        await Event.findOneAndUpdate(
            { _id: eventId},
            { $inc: { [roleNeeded]: - 1} },
            console.log(`${roleNeeded} -1.`)
        )
    },

    // Push user information onto staffReserved property in Event model
    addStaffReserved: async (eventId, userId, userName, userEmail, occupationRole) => {
        await Event.findOneAndUpdate(
            { _id: eventId},
            {
                $push: {staffReserved: {$each: [[userId, userName, userEmail, occupationRole]]}}
            }
        )
    }
}