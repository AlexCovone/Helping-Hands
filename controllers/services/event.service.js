const Event = require("../../models/Event");
const { convertDateToEnUs, convertTo12HourFormat } = require("../services/helperFunctions")

module.exports = {
    getEventDetails: (events) => {
        return events.map(event => {
            const staffArrival = convertTo12HourFormat(event.staffArrival)
            const estimatedEndTime = convertTo12HourFormat(event.estimatedEndTime)
            const date = convertDateToEnUs(event.date)
            return {...event, staffArrival, estimatedEndTime, date}
        })
    },

    filterPreviousAndUpcomingEvents: async () => {
        const [upcomingEvents, previousEvents] = await Promise.all([
            Event.aggregate([
                { $match: { date: { $gte: new Date()} } },
                { $sort: { date: 1 } }
            ]),
            Event.aggregate([
                { $match: { date: { $lte: new Date()} } },
                { $sort: { date: 1 } }
            ])
        ])
        return [upcomingEvents, previousEvents]
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