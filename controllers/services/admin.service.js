module.exports = {
    formatPhoneNumber: (phoneNumbers) => {
        const validPhoneNumbers = phoneNumbers.filter(number => number.length === 12);

        const e164Format = validPhoneNumbers.map(number => '+1' + number.split('-').join(''))

        return e164Format
    }
}