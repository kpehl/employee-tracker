// A router hub for the API routes
// Dependencies
const express = require('express');
const router = express.Router();

router.use(require('./departmentRoutes'));

module.exports = router;