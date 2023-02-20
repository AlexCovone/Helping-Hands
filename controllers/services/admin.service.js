module.exports = {
    formatPhoneNumber: (phoneNumbers) => {
        const validPhoneNumbers = phoneNumbers.filter(number => number.length === 12);

        return validPhoneNumbers.map(number => '+1' + number.split('-').join(''))
    }
}