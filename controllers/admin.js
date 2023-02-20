const cloudinary = require("../middleware/cloudinary");
const Event = require("../models/Event");
const User = require("../models/User");
const Comment = require("../models/Comment");

// Twilio API
require("dotenv").config({ path: "./config/.env" });
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;


module.exports = {
    getAdminDash: async (req, res) => {
        try {
        const event = await Event.findById(req.params.id);
        res.render("admin.ejs", { event: event, user: req.user });
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
            eventCaptain: req.body.eventCaptain,
            eventChef: req.body.eventChef,
            waitstaffNeeded: req.body.waitstaffNeeded,
            bartenderNeeded: req.body.bartenderNeeded,
            chefNeeded: req.body.chefNeeded
          });
          console.log("Event has been added!");
          console.log(req.body)
          res.redirect("/profile");
        } catch (err) {
          console.log(err);
        }
    },
    textUsers: async (req, res) => {
      try{
        const users = await User.find({})
        const phoneNumbers = users.map(user => user.phoneNumber)

        const validPhoneNumbers = phoneNumbers.filter(number => number.length === 12)
        const e164Format = validPhoneNumbers.map(element => '+1' + element.split('-').join(''))

        const numberNewEvents = req.body.numberNewEvents

        // Remove console.logs
        console.log(phoneNumbers)
        console.log(validPhoneNumbers)
        console.log(e164Format)

        const client = require('twilio')(accountSid, authToken);
        const messages = await Promise.all(e164Format.map(number => {
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