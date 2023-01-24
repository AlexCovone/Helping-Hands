const cloudinary = require("../middleware/cloudinary");
const Event = require("../models/Event");
const User = require("../models/User")
const Reservation = require("../models/Reservation")


module.exports = {
  getProfile: async (req, res) => {
    try {
      const reservation = await Reservation.find({ user: req.user.id }).populate('event');
      res.render("profile.ejs", { reservation: reservation, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    try {
      const events = await Event.find().sort({ createdAt: "desc" }).lean();
      res.render("feed.ejs", { events: events, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getEvent: async (req, res) => {
      try {
      const event = await Event.findById(req.params.id);
      res.render("event.ejs", { event: event, user: req.user });
      } catch (err) {
      console.log(err);
      }
  },
  reserveEvent: async (req, res) => {
    try {
      console.log(req.body)

      // Update User Model to include event ID in eventsReserved property
      await User.findOneAndUpdate(
        {_id: req.user.id}, 
        {
          $push: {eventsReserved: req.params.id}
        }
      )

      // Update Event Model to include user name, email, and selected occupation role upon reservation request. Will be formatted inside an array.
      await Event.findOneAndUpdate(
        {_id: req.params.id},
        {
          $push: {staffReserved: {$each: [[req.user.name, req.user.email, req.body.occupationRole]]}}
        }
      )
      console.log(`Reservation has been made for ${req.user.name}.`);
      res.redirect(`/events/${req.params.id}`);
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
    }
}