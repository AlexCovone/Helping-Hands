module.exports = {
    convertDateToEnUs: (date) => {
        return date.toLocaleString('en-us', { year:"numeric", month:"long", day:"numeric"})
    },

    convertTo12HourFormat: (time24) => {
        const [hours, minutes] = time24.split(':')
        const date = new Date(0, 0, 0, hours, minutes)
        const time12 = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
        return time12
    },
}