const express = require("express");
const router = express.Router();
const eventsController = require("../controllers/events");
const { ensureAuth } = require("../middleware/auth");

// @desc      All previous events
// @route     GET /previous-events
router.get("/", ensureAuth, eventsController.getAllPreviousEvents)

module.exports = router;