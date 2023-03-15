const cloudinary = require("../middleware/cloudinary");
const Event = require("../models/Event");
const { getUpcomingEvents, getPreviousEvents, getEventDetails, getRoleNeeded, decreaseSpotsLeft, addStaffReserved } = require("../controllers/services/event.service");
const { addEventToUser, filterEventsByUser } = require("../controllers/services/user.service")
const { convertDateToEnUs, convertTo12HourFormat } = require("../controllers/services/helperFunctions")

module.exports = {
  getProfile: async (req, res) => {
    try {
      // Arr of events sorted by eventReserved property on User model
      const allUserEvents = await filterEventsByUser(req.user.id)
      const upcomingUserEvents = await getUpcomingEvents(allUserEvents)
      const previousUserEvents = await getPreviousEvents(allUserEvents)

      const upcomingUserEventsFormatted = getEventDetails(upcomingUserEvents)
      const previousUserEventsFormatted = getEventDetails(previousUserEvents)

      res.render("profile.ejs", {upcomingUserEvents: upcomingUserEventsFormatted, previousUserEvents: previousUserEventsFormatted, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    try {  
      // Using aggregation pipeline to filter events that have occurred vs events that have not occurred
      const upcomingEvents = await getUpcomingEvents()
      const upcomingEventDetails = getEventDetails(upcomingEvents)

      const date = new Date(Date.now())
      const options = { month: 'long', day: 'numeric', year: 'numeric' }
      const formattedDate = date.toLocaleDateString('en-US', options)

      // Time of Day
      const time = date.getHours()

      res.render("feed.ejs", { user: req.user, date: formattedDate, upcomingEvents: upcomingEventDetails, time});
    } catch (err) {
      console.log(err);
    }
  },
  getEvent: async (req, res) => {
    try {
      const event = await Event.findById(req.params.id);
      const message = req.flash()
      const time12StaffArrival = convertTo12HourFormat(event.staffArrival);
      const time12EstimatedEndTime = convertTo12HourFormat(event.estimatedEndTime);
      const dateConversion = convertDateToEnUs(event.date)
      
      console.log(message)
      res.render("event.ejs", { event, user: req.user, message, staffArrival: time12StaffArrival, estimatedEndTime: time12EstimatedEndTime, date: dateConversion });
    } catch (err) {
      console.log(err);
    }
  },
  reserveEvent: async (req, res) => {
    try {
      const event = await Event.findOne({ _id: req.params.id })
      const allUserEvents = await filterEventsByUser(req.user.id)
      const upcomingUserEvents = await getUpcomingEvents(allUserEvents)

      // Create set of all dates (in ms) on upcoming User events
      const userEventDates = new Set(upcomingUserEvents.map(event => event.date.getTime()))

      if(userEventDates.has(event.date.getTime())){
        req.flash("error", `Oops! You already have an event scheduled on this date.`)
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
      // Use Promise.all to allow all three async operations to be executed concurrently - want all to fail if one fails
      await Promise.all([
        await addEventToUser(req.user.id, req.params.id),
        await decreaseSpotsLeft(req.params.id, roleNeeded),
        await addStaffReserved(req.params.id, req.user.id, req.user.name, req.user.email, occupationRole)
      ])

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
        await Event.deleteOne({ _id: req.params.id });
        console.log("Deleted Event");
        res.redirect("/events");
      } catch (err) {
        res.redirect("/events");
      }
    }
}