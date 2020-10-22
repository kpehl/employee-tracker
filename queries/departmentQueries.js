// Query Functions for the Department Table
// // Dependencies
// // // Database Module
const connection = require('../db/database');
// // // Input check function
const inputCheck = require('../utils/inputCheck');
// // // console.table for printing SQL data
const cTable = require('console.table')

// A function to return all the data in the department table
const queryDepartments = () => {
    const sql = `SELECT * FROM department`;
    const params = [];
    connection.promise().query(sql, params)
        .then( ([rows, fields]) => {
            console.table(rows)
        })
        .catch(console.log)
        .then ( () => connection.end);
};

// A function to get a single department by id
const queryDepartment = (id) => {
    const sql = `SELECT * from department
                WHERE department.id = ?`;
    const params = [id];
    connection.promise().query(sql, params)
        .then( ([rows, fields]) => {
            console.table(rows)
        })
        .catch(console.log)
        .then ( () => connection.end);
};

// A function to delete a department
const deleteDepartment = (id) => {
    const sql = `DELETE FROM department WHERE id = ?`;
    const params = [id];
    connection.promise().query(sql, params)
        .then( ([rows, fields]) => {
            // console.table(`department ${id} deleted`);
        })
        .catch(console.log)
        .then ( () => connection.end)
};

// A function to add a department
const addDepartment = (name) => {
    const sql = `INSERT INTO department (name)
                VALUES (?)`;
    const params = [name];
    connection.promise().query(sql, params)
    .then( ([rows, fields]) => {
        // console.table(`${name} department added`);
    })
    .catch(console.log)
    .then ( () => connection.end)
};

module.exports = { queryDepartments, queryDepartment, addDepartment, deleteDepartment };