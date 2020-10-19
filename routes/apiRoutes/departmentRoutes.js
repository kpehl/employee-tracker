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

// An Express route to get a single department by id
router.get('/department/:id', (req, res) => {
    const sql = `SELECT * from departments
                WHERE departments.id = ?`;
    const params = [req.params.id];
    connection.query(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: row
        });
    });
});

// An Express route to delete a department
router.delete('/department/:id', (req, res) => {
    const sql = `DELETE FROM departments WHERE id = ?`;
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

// An Express route to add a department
router.post('/department', ({ body }, res) => {
    const sql = `INSERT INTO departments (name)
                VALUES (?)`;
    const params = [body.name];
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

module.exports = router;