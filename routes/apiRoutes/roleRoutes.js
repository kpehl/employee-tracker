// Routes for the Roles Table
// Dependencies
const express = require('express');
const router = express.Router();
const connection = require('../../db/database');
const inputCheck = require('../../utils/inputCheck');

// An Express route to return all the raw data in the roles table
router.get('/rawroles', (req, res) => {
    const sql = `SELECT * FROM role`;
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
    const sql = `SELECT role.title AS title,
                role.id AS role_id,
                department.name AS department_name,
                role.salary AS salary
                FROM role
                LEFT JOIN department
                ON role.department_id = department.id`;
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

// An Express route to add a role
router.post('/role', ({ body }, res) => {
    // check the input for errors, and if there are any, return a 400 error to the client
    const errors = inputCheck(body, 'title', 'salary', 'department_id');
    if (errors) {
        res.status(400).json({ error: errors });
        return;
    }
    // if no errors are found, proceed with the SQL route to insert a row
    const sql = `INSERT INTO role (title, salary, department_id)
                VALUES (?, ?, ?)`;
    const params = [body.title, body.salary, body.department_id];
    connection.query(sql, params, function(err, result) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: body,
            id: this.lastID
        });
    });
});

// An Express route to delete a role
router.delete('/role/:id', (req, res) => {
    const sql = `DELETE FROM role WHERE id = ?`;
    const params = [req.params.id];
    connection.query(sql, params, function(err, result) {
        if (err) {
            res.status(400).json ({ error: res.message});
            return
        }
        res.json({
            message: 'successfully deleted',
            changes: this.changes
        });
    });
});

module.exports = router;