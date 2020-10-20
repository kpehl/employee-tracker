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
    const sql = `SELECT e.id AS employee_id,
                e.first_name AS first_name,
                e.last_name AS last_name,
                role.title AS title,
                department.name AS department,
                role.salary AS salary,
                CONCAT(m.first_name, ' ', m.last_name) AS manager_name
                FROM employee e
                LEFT JOIN role ON e.role_id = role.id
                LEFT JOIN employee m ON m.id = e.manager_id
                LEFT JOIN department ON role.department_id = department.id`;
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