const cloudinary = require("../middleware/cloudinary");
const Event = require("../models/Event");
const User = require("../models/User");
const { formatPhoneNumber } = require("../controllers/services/admin.service")

// Twilio API
require("dotenv").config({ path: "./config/.env" });
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;


module.exports = {
    getAdminDash: async (req, res) => {
        try {
        const allUsers = await User.find()
        res.render("admin.ejs", {allUsers, user: req.user });
        } catch (err) {
        console.log(err);
        }
    },
    createEvent: async (req, res) => {
        try {
          // Upload image to cloudinary
          const result = await cloudinary.uploader.upload(req.file.path);
    
          await Event.create({
            user: req.user.id,
            eventName: req.body.eventName,
            address: req.body.address,
            image: result.secure_url,
            cloudinaryId: result.public_id,
            staffArrival: req.body.staffArrival,
            estimatedEndTime: req.body.estimatedEndTime,
            date: req.body.date,
            uniform: req.body.uniform,
            caterer: req.body.caterer,
            waitstaffNeeded: req.body.waitstaffNeeded,
            bartenderNeeded: req.body.bartenderNeeded,
            chefNeeded: req.body.chefNeeded
          });
          console.log("Event has been added!");
          res.redirect("/profile");
        } catch (err) {
          console.log(err);
        }
    },
    textUsers: async (req, res) => {
      try{
        const users = await User.find({})
        const phoneNumbers = users.map(user => user.phoneNumber)
        const validPhoneNumbers = formatPhoneNumber(phoneNumbers)

        const numberNewEvents = req.body.numberNewEvents

        const client = require('twilio')(accountSid, authToken);
        const messages = await Promise.all(validPhoneNumbers.map(number => {
          return client.messages.create({
            body: `There are ${numberNewEvents} new events that have been posted. Please visit Helping-Hands to reserve your event.`,
            to: number, // Recipient
            from: twilioPhoneNumber, // From a valid Twilio number
          })
        }))

        messages.forEach(message => console.log(message.sid))
        res.redirect("/admin")
      } catch (err) {
        console.log(err)
      }
    }
}