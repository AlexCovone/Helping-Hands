const cloudinary = require("../middleware/cloudinary");
const Event = require("../models/Event");
const Comment = require("../models/Comment");


module.exports = {
    getEvent: async (req, res) => {
        try {
        const event = await Event.findById(req.params.id);
        res.render("event.ejs", { event: event, user: req.user });
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
            hours: req.body.hours,
            date: req.body.date,
            uniform: req.body.uniform,
            caterer: req.body.caterer,
            eventCaptain: req.body.eventCaptain,
            eventChef: req.body.eventChef,
            waitStaffNeeded: req.body.waitStaffNeeded,
            bartenderNeeded: req.body.bartenderNeeded,
          });
          console.log("Event has been added!");
          res.redirect("/profile");
        } catch (err) {
          console.log(err);
        }
    }
}