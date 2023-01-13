const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const adminController = require("../controllers/admin");
const { ensureAuth, ensureGuest, authRole } = require("../middleware/auth");

// @desc      Admin Dashboard - Form Rendering
// @route     GET /admin/

router.get('/', ensureAuth, adminController.getAdminDash);

// authRole(ROLE.ADMIN)

// @desc      Create Event on Admin Dashboard
// @route     POST /admin/createEvent

router.post("/createEvent", upload.single("file"), adminController.createEvent);


module.exports = router;