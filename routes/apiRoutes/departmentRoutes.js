// Routes for the Departments Table
// Dependencies
const express = require('express');
const router = express.Router();
const connection = require('../../db/database');

// An Express route to return all the data in the departments table
router.get('/departments', (req, res) => {
    const sql = `SELECT * FROM departments`;
    const params = [];
    connection.query(sql, params, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message});
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
    // res.json({ message: 'departments api'});
});

module.exports = router;