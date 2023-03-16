module.exports = {
    // Need to convert from UTC to EST 
    convertUTCToEnUs: (date) => {
        const utcDate = new Date(date);
        const estOffset = -5; // EST is 5 hours behind UTC
        const estDate = new Date(utcDate.getTime() - (estOffset * 60 * 60 * 1000));

        return estDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'America/New_York' });
    },

    convertTo12HourFormat: (time24) => {
        const [hours, minutes] = time24.split(':')
        const date = new Date(0, 0, 0, hours, minutes)
        const time12 = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
        return time12
    },

    getFormattedCurrentDate: () => {
      const date = new Date(Date.now())
      const format = { month: 'long', day: 'numeric', year: 'numeric' }
      return date.toLocaleDateString('en-US', format)
    }

}