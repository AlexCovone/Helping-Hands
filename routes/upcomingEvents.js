const express = require("express");
const router = express.Router();
const eventsController = require("../controllers/events");
const { ensureAuth } = require("../middleware/auth");

// @desc      All upcoming events
// @route     GET /upcoming-events
router.get("/", ensureAuth, eventsController.getAllUpcomingEvents)

module.exports = router;