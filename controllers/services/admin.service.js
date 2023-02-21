module.exports = {
    formatPhoneNumber: (phoneNumbers) => {
        const validPhoneNumbers = phoneNumbers.filter(Boolean);
        return validPhoneNumbers.map(number => '+1' + number.split('-').join(''))
    }
}