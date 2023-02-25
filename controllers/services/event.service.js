const Event = require("../../models/Event");

module.exports = {
    convertTo12HourFormat: (time24) => {
        const [hours, minutes] = time24.split(':')
        const date = new Date(0, 0, 0, hours, minutes)
        const time12 = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
        return time12
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