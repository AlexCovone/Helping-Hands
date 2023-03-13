const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const adminController = require("../controllers/admin");
const { ensureAuth, authRole } = require("../middleware/auth");

// @desc      Admin Dashboard - Form Rendering
// @route     GET /admin/
router.get('/', ensureAuth, authRole('Admin'), adminController.getAdminDash);

// @desc      Create Event on Admin Dashboard
// @route     POST /admin/createEvent
router.post("/createEvent", ensureAuth, authRole('Admin'), upload.single("file"), adminController.createEvent);

// @desc      Notify users with phone numbers via sms that a new event has been posted
// @route     POST /admin/textUsers
router.post("/textUsers", ensureAuth, authRole('Admin'), adminController.textUsers);

// @desc      Award users with 'Simply the Best' award
// @route     PUT /admin/stbAward/:id
router.put("/stbAward/:id", ensureAuth, authRole('Admin'), adminController.awardSimplyTheBest);

module.exports = router;