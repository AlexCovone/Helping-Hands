const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const authController = require("../controllers/auth");
const homeController = require("../controllers/home");
const eventsController = require("../controllers/events");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

// @desc      Individual Events Page
// @route     GET /event/:id

router.get("/:id", ensureAuth, eventsController.getEvent);

// @desc      Admin Create Event
// @route     GET /event/createEvent
router.post("/createEvent", upload.single("file"), eventsController.createEvent);


module.exports = router;