// Query Functions for the Role Table
// // Dependencies
const connection = require('../db/database');
const inputCheck = require('../utils/inputCheck');

// A function to return all the raw data in the role table
const rawRoles = (req, res) => {
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
};

// A function to return data in the role table joined with the department table
const rolesDepartments = (req, res) => {
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
};

// A function to add a role
const addRole = ({ body }, res) => {
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
};

// A function to delete a role
const deleteRole = (req, res) => {
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
};

module.exports = { rawRoles, rolesDepartments, addRole, deleteRole };