const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const adminController = require("../controllers/admin");
const { ensureAuth, ensureGuest, authRole } = require("../middleware/auth");

// @desc      Admin Dashboard - Form Rendering
// @route     GET /admin/

router.get('/', ensureAuth, authRole('Admin'), adminController.getAdminDash);

// @desc      Create Event on Admin Dashboard
// @route     POST /admin/createEvent

router.post("/createEvent", ensureAuth, upload.single("file"), adminController.createEvent);

// @desc      Notify users with phone numbers via sms that a new event has been posted
// @route     POST /admin/textUsers
router.post("/textUsers", ensureAuth, adminController.textUsers);


module.exports = router;