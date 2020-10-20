// Routes for the Employee Table
// Dependencies
const express = require('express');
const router = express.Router();
const connection = require('../../db/database');
const inputCheck = require('../../utils/inputCheck');

// An Express route to return all the raw data in the employee table
router.get('/rawemployees', (req, res) => {
    const sql = `SELECT * FROM employee`;
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

// An Express route to return data in the employee table joined with the department and role tables
router.get('/employees', (req, res) => {
    const sql = `SELECT employee.id AS employee_id,
                employee.first_name AS first_name,
                employee.last_name AS last_name,
                role.title AS title,
                role.salary AS salary
                FROM employee
                LEFT JOIN role
                ON employee.role_id = role.id`;
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