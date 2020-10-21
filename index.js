// Command Line Interface Code
// // Dependencies
// // Database module
const connection = require('./db/database');
// // // Inquirer for user input
const inquirer = require('inquirer');
// // // console.table for printing SQL data
const cTable = require('console.table')
// // // Functions for the MySQL Queries
const { queryDepartments, deleteDepartment, addDepartment, queryDepartment } = require('./queries/departmentQueries');
const { rawEmployeeData, allEmployees, addEmployee, deleteEmployee, updateManager, updateRole } = require('./queries/employeeQueries');
const { rawRoles, rolesDepartments, addRole, deleteRole } = require('./queries/roleQueries');
const { end } = require('./db/database');


const init = () => {
    // Department Query Tests
    queryDepartments();
    queryDepartment(3);
    deleteDepartment(3);
    queryDepartments();
    const newDepartment = 'Morale';
    addDepartment(newDepartment);
    queryDepartments();
    endConnection();
}

const endConnection = () => {
    connection.end;
    console.log('connection ended');
}

init();