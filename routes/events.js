const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const authController = require("../controllers/auth");
const homeController = require("../controllers/home");
const eventsController = require("../controllers/events");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

// @desc      Events Feed Page
// @route     GET /events/

router.get('/', ensureAuth, eventsController.getFeed)

// @desc      Individual Events Page
// @route     GET /events/:id

router.get("/:id", ensureAuth, eventsController.getEvent);

// @desc      Admin Create Event
// @route     POST /events/createEvent
// router.post("/createEvent", upload.single("file"), eventsController.createEvent);

// @desc      Admin Delete Event
// @route     GET /events/:id
router.delete("/deleteEvent/:id", eventsController.deleteEvent);


module.exports = router;