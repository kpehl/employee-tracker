// Query Functions for the Role Table
// // Dependencies
const connection = require('../db/database');
const inputCheck = require('../utils/inputCheck');

// A function to return all the raw data in the role table
const rawRoles = (req, res) => {
    const sql = `SELECT * FROM role`;
    const params = [];
    connection.promise().query(sql, params)
        .then( ([rows, fields]) => {
            console.table(rows)
        })
        .catch(console.log)
        // .then ( () => connection.end);
};

// A function to return data in the role table joined with the department table
const rolesDepartments = (req, res) => {
    const sql = `SELECT role.title AS "Role Title",
                role.id AS "Role ID",
                department.name AS "Department Name",
                role.salary AS "Salary"
                FROM role
                LEFT JOIN department
                ON role.department_id = department.id`;
    const params = [];
    connection.promise().query(sql, params)
        .then( ([rows, fields]) => {
            console.table(rows)
        })
        .catch(console.log)
        // .then ( () => connection.end);
};

// A function to add a role
const addRole = ( body ) => {
    // console.log(body)
    const sql = `INSERT INTO role (title, salary, department_id)
                VALUES (?, ?, ?)`;
    const params = [body['title'], body['salary'], body['department_id']];
    connection.promise().query(sql, params)
    .then( ([rows, fields]) => {
        // console.table(`${body['title']} role added`);
    })
    .catch(console.log)
    // .then ( () => connection.end)
};

// A function to delete a role
const deleteRole = (id) => {
    const sql = `DELETE FROM role WHERE id = ?`;
    const params = [id];
    connection.promise().query(sql, params)
    .then( ([rows, fields]) => {
        // console.table(`Role ${id} deleted`);
    })
    .catch(console.log)
    // .then ( () => connection.end)
};

module.exports = { rawRoles, rolesDepartments, addRole, deleteRole };