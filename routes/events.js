const express = require("express");
const router = express.Router();
const eventsController = require("../controllers/events");
const { ensureAuth, authRole } = require("../middleware/auth");

// @desc      Events Feed Page
// @route     GET /events/
router.get("/", ensureAuth, eventsController.getFeed)

// @desc      Individual Events Page
// @route     GET /events/:id
router.get("/:id", ensureAuth, eventsController.getEvent);

// @desc      User Reserve :id Event
// @route     POST /events/reserveEvent/:id
router.put("/reserveEvent/:id", ensureAuth, eventsController.reserveEvent)

// @desc      Admin Delete Event
// @route     GET /events/:id
router.delete("/deleteEvent/:id", ensureAuth, authRole('Admin'), eventsController.deleteEvent);

module.exports = router;