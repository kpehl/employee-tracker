// Routes for the Roles Table
// Dependencies
const express = require('express');
const router = express.Router();
const connection = require('../../db/database');
const inputCheck = require('../../utils/inputCheck');

// An Express route to return all the raw data in the roles table
router.get('/rawroles', (req, res) => {
    const sql = `SELECT * FROM roles`;
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
});

// An Express route to return data in the roles table joined with the department table
router.get('/roles', (req, res) => {
    const sql = `SELECT roles.title AS title,
                roles.id AS role_id,
                departments.name AS department_name,
                roles.salary AS salary
                FROM roles
                LEFT JOIN departments
                ON roles.department_id = departments.id`;
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
});

module.exports = router;