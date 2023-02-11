const cloudinary = require("../middleware/cloudinary");
const Event = require("../models/Event");
const User = require("../models/User")

module.exports = {
  getProfile: async (req, res) => {
    try {
      // events is all documents in Events collection
      const events = await Event.find({});

      // Filter through Events collection and loop through staffReserved array property.
      let matchedEvents = events.filter(event => {
          for (let i = 0; i < event.staffReserved.length; i++) {
              if (event.staffReserved[i][0] === req.user.id) {
                  return event;
              }
          }
      });
      res.render("profile.ejs", { events: matchedEvents, user: req.user });
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
      const message = req.flash()
      res.render("event.ejs", { event: event, user: req.user, message: message });
      } catch (err) {
      console.log(err);
      }
  },
  reserveEvent: async (req, res) => {
    try {

      // Update User Model to include event ID in eventsReserved property
      await User.findOneAndUpdate(
        {_id: req.user.id}, 
        {
          $push: {eventsReserved: req.params.id}
        }
      )

      // Update Event Model to include user name, email, and selected occupation role upon reservation request. Will be formatted inside an array.
      const event = await Event.findOne({_id: req.params.id});
      const staffReserved = event.staffReserved

      // If req.user.id does not exist in a sub-array, push user's information into staffReserved array indicated user reserved event.
      if(staffReserved.some(subArr => subArr.includes(req.user.id))){
        req.flash("error", `${req.user.name} has already reserved this event.`);
      }else{
        await Event.findOneAndUpdate(
          {_id: req.params.id},
          {
            $push: {staffReserved: {$each: [[req.user.id,req.user.name, req.user.email, req.body.occupationRole]]}}
          }
        );

        req.flash("success", `Reservation has been made for ${req.user.name}.`);
      }
      
      // Conditional: Decrement Waitstaff/Bartender/Chef property on Event Model based on reservation request value 
      if(req.body.occupationRole === 'Waitstaff'){
        await Event.findOneAndUpdate(
          {_id: req.params.id},
          {
            $inc: { waitstaffNeeded: -1 }
          }
        )
      }else if(req.body.occupationRole === 'Bartender'){
        await Event.findOneAndUpdate(
          {_id: req.params.id},
          {
            $inc: { bartenderNeeded: -1 }
          }
        )
      }else if(req.body.occupationRole === 'Chef'){
        await Event.findOneAndUpdate(
          {_id: req.params.id},
          {
            $inc: { chefNeeded: -1 }
          }
        )
      }

      return res.redirect(`/events/${req.params.id}`);
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