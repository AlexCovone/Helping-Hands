const cloudinary = require("../middleware/cloudinary");
const Event = require("../models/Event");
const User = require("../models/User");

// Checks if userId is in staffReserved property
const checkUserReserved = (staffReserved, userId) => {
  return staffReserved.some(subArr => subArr.includes(userId))
}

// Define object that maps the occupation roles to corresponding property in Event model
// Get corresponding object property name from occupationRole (req.body.occupationRole)
// Ex: 'Waitstaff => 'waitstaffNeeded'
const getRoleNeeded = (occupationRole) => {
  const neededRoles = {
    'Waitstaff': 'waitstaffNeeded',
    'Bartender': 'bartenderNeeded',
    'Chef': 'chefNeeded'
  }
  
  return neededRoles[occupationRole]
}

// Find appropriate user and push eventId onto eventReserved property
const addEventToUser = async (userId, eventId) => {
  await User.findOneAndUpdate(
    { _id: userId},
    { $push: { eventReserved: eventId } }
  )
}

// Decrement appropriate role upon request (-1)
const decreaseSpotsLeft = async (eventId, roleNeeded) => {
  await Event.findOneAndUpdate(
    { _id: eventId },
    { $inc: { [roleNeeded]: - 1} },
    console.log(`${roleNeeded} -1.`)
  )
}

// Push user information onto staffReserved property in Event model
const addStaffReserved = async (eventId, userId, userName, userEmail, occupationRole) => {
  await Event.findOneAndUpdate(
    { _id: eventId },
    {
      $push: {
        staffReserved: {
          $each: [[userId, userName, userEmail, occupationRole]]
        }
      }
    }
  )
}

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
      console.log(message)
      res.render("event.ejs", { event: event, user: req.user, message: message });
      } catch (err) {
      console.log(err);
      }
  },
  reserveEvent: async (req, res) => {
    try {
      console.log(req.body)
      const event = await Event.findOne({ _id: req.params.id });
      const staffReserved = event.staffReserved;

      // Checks if userId is included in staffReserved property in the Event model
      if(checkUserReserved(staffReserved, req.user.id)){
        req.flash("error", `${req.user.name} has already reserved this event.`)
        return res.redirect(`/events/${req.params.id}`)
      }

      // Requested role by user
      const occupationRole = req.body.occupationRole

      // Get corresponding object property name from req.body.occupationRole
      // Ex: 'Waitstaff => 'waitstaffNeeded'
      const roleNeeded = getRoleNeeded(occupationRole)

      // Number of spots left for selected occupation role
      const spotsLeft = event[roleNeeded]

      if(spotsLeft  <= 0){
        req.flash("error", `${occupationRole}s for this event is full.`)
        return res.redirect(`/events/${req.params.id}`)
      }

      // If spotsLeft > 0, trigger below:
      await addEventToUser(req.user.id, req.params.id);
      await decreaseSpotsLeft(req.params.id, roleNeeded);
      await addStaffReserved(req.params.id, req.user.id, req.user.name, req.user.email, occupationRole);

      req.flash("success", `Reservation has been made for ${req.user.name}.`)
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