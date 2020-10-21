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


const sqlFunctionTests = () => {
    // Department Query Tests
    queryDepartments();
    queryDepartment(3);
    deleteDepartment(3);
    queryDepartments();
    const newDepartment = 'Morale';
    addDepartment(newDepartment);
    queryDepartments();
    // Role Query Tests
    rawRoles();
    rolesDepartments();
    const newRole = ['Legal Aide', 75000, 4];
    const newRoleObj = {'title': 'Legal Aide', 'salary': 75000, 'department_id': 4};
    addRole(newRoleObj)
    deleteRole(2);
    rolesDepartments();
    // Employee Query Tests
    rawEmployeeData();
    allEmployees();
    const newEmployee = {'first_name': 'Tammar', 'last_name': 'Galal', 'role_id': 4};
    addEmployee(newEmployee);
    deleteEmployee(3);
    allEmployees();
    const updateManagerObj = {'employee_id': 1, 'manager_id': 6};
    updateManager(updateManagerObj);
    const updateRoleObj = {'employee_id': 1, 'role_id': 7}
    updateRole(updateRoleObj);
    allEmployees();
};

const endConnection = () => {
    connection.end;
    console.log('connection ended');
}

sqlFunctionTests();