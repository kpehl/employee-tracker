// Query Functions for the Employee Table
// // Dependencies
const connection = require('../db/database');
const inputCheck = require('../utils/inputCheck');

// A function to return all the raw data in the employee table
const rawEmployeeData = (req, res) => {
    const sql = `SELECT * FROM employee`;
    const params = [];
    connection.promise().query(sql, params)
        .then( ([rows, fields]) => {
            console.table(rows)
        })
        .catch(console.log)
        .then ( () => connection.end);
};

// A function to return data in the employee table joined with the department and role tables
const allEmployees = (req, res) => {
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
    connection.promise().query(sql, params)
        .then( ([rows, fields]) => {
            console.table(rows)
        })
        .catch(console.log)
        .then ( () => connection.end );
};

// A function to add an employee
const addEmployee = (body) => {
    // check the input for errors, and if there are any, return a 400 error to the client; manager may be null
    const errors = inputCheck(body, 'first_name', 'last_name', 'role_id', 'manager_id');
    if (errors) {
        console.log(errors)
        return;
    }
    // if no errors are found, proceed with the SQL route to insert a row
    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                VALUES (?, ?, ?, ?)`;
    const params = [body['first_name'], body['last_name'], body['role_id'], body['manager_id']];
    connection.promise().query(sql, params)
        .then( ([rows, fields]) => {
            // console.table(`${body['first_name']} ${body['last_name']} added`);
        })
        .catch(console.log)
        .then ( () => connection.end);
};

// A function to delete an employee
const deleteEmployee = (id) => {
    const sql = `DELETE FROM employee WHERE id = ?`;
    const params = [id];
    connection.promise().query(sql, params)
        .then( ([rows, fields]) => {
            // console.table(`Employee ${id} deleted`);
        })
        .catch(console.log)
        .then ( () => connection.end)
};

// A function to update an employee's manager
const updateManager = (body) => {
    // check to make sure a party_id was provided
    const errors = inputCheck(body, 'employee_id', 'manager_id');
    if (errors) {
        res.status(400).json({ error: errors });
        return;
    }
    // if an id was provided, update the database
    const sql = `UPDATE employee SET manager_id = ?
                WHERE id = ?`;
    const params = [body['manager_id'], body['employee_id']];
    connection.promise().query(sql, params)
        .then( ([rows, fields]) => {
            // console.table(`Employee ${body['employee_id']} manager updated`);
        })
        .catch(console.log)
        .then ( () => connection.end)
};

// A function to update an employee's role
const updateRole = (body) => {
    // check to make sure a party_id was provided
    const errors = inputCheck(body, 'employee_id', 'role_id');
    if (errors) {
        res.status(400).json({ error: errors });
        return;
    }
    // if an id was provided, update the database
    const sql = `UPDATE employee SET role_id = ?
                WHERE id = ?`;
    const params = [body['role_id'], body['employee_id']];
    connection.promise().query(sql, params)
        .then( ([rows, fields]) => {
            // console.table(`Employee ${body['employee_id']} role updated`);
        })
        .catch(console.log)
        .then ( () => connection.end)
};

module.exports = { rawEmployeeData, allEmployees, addEmployee, deleteEmployee, updateManager, updateRole };