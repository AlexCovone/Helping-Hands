const cloudinary = require("../middleware/cloudinary");
const Event = require("../models/Event");
const Comment = require("../models/Comment");


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
    },
    deleteEvent: async (req, res) => {
        try {
          // Find post by id - Make sure that the post exist (Caution using delete method)
          let event = await Event.findById({ _id: req.params.id });
          // Delete image from cloudinary
          await cloudinary.uploader.destroy(event.cloudinaryId);
          // Delete post from db
          await Event.remove({ _id: req.params.id });
          console.log("Deleted Event");
          res.redirect("/profile");
        } catch (err) {
          res.redirect("/profile");
        }
      },
}