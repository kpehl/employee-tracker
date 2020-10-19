// A router hub for the API routes
// Dependencies
const express = require('express');
const router = express.Router();

router.use(require('./departmentRoutes'));
router.use(require('./roleRoutes'));

module.exports = router;