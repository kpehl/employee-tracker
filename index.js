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
const { getMaxListeners } = require('./db/database');

// Open a connection to the database
connection.connect(err => {
    if (err) throw err;
    console.log('connected as id ' + connection.threadId);
    actionChoice();
  });

// A function to close the connection
const endConnection = () => {
    connection.end;
    console.log('connection ended');
}

// A function to test the SQL functions
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

// A function to direct the user depending on their choice of action
const actionChoice = () => {
    console.log('--------------------------------------------')
    return inquirer.prompt([
        // View, Add, or Update
        {
            type: 'list',
            name: 'actionChoice',
            message: 'Would you like to:',
            choices: ['View', 'Add', 'Update']
        },
        // View All Departments, View All Roles, or View All Employees
        {
            type: 'list',
            name: 'viewChoices',
            message: 'What would you like to view?',
            choices: ['View All Departments', 'View All Roles', 'View All Employees'],
            when: (answers) => answers.actionChoice === 'View'
        },
        // Add a Department, Add a Role, or Add an Employee
        {
            type: 'list',
            name: 'addChoices',
            message: 'What would you like to add?',
            choices: ['Add a Department', 'Add a Role', 'Add an Employee'],
            when: (answers) => answers.actionChoice === 'Add'
        },
        // Update an Employee's Role or Manager
        {
            type: 'list',
            name: 'updateChoices',
            message: 'What would you like to update?',
            choices: ['Employee Role', 'Employee Manager'],
            when: (answers) => answers.actionChoice === 'Update'
        }
    ])
    .then( answer => {
        if (answer.actionChoice === 'View' && answer.viewChoices === 'View All Departments') {queryDepartments()}
        else if (answer.actionChoice === 'View' && answer.viewChoices === 'View All Roles') {rolesDepartments()}
        else if (answer.actionChoice === 'View' && answer.viewChoices === 'View All Employees') {allEmployees()}
        else if (answer.actionChoice === 'Add' && answer.addChoices === 'Add an Employee') {addEmployeePrompts()}
        else {console.log('more coming soon')}
    })
}

// A function to prompt to continue or quit
const promptContinue = () => {
    return inquirer.prompt([
        {
            type: 'confirm',
            name: 'quitOrContinue',
            message: 'Would you like to continue?'
        }
    ])
    .then((answer) => {
        if (answer.quitOrContinue === true) {actionChoice()}
        else {
            endConnection()
            console.log('--------------------------------------------------------------------------')
            console.log('---------------------Press Ctrl C to Exit---------------------------------')
            console.log('--------------------------------------------------------------------------')
        }
    })
}

// A function for the add employee prompts
const addEmployeePrompts = () => {
    // get the role titles from the database
    connection.query(`SELECT id, title FROM role`, function (err, rows) {
        if (err) console.log(err);
    // if there are no errors, prompt the user for the new employee information
    inquirer.prompt ([
        // Add an Employee
        {
            type: 'input',
            name: 'employeeFirstName',
            message: "Enter employee's first name:",
        },
        {
            type: 'input',
            name: 'employeeLastName',
            message: "Enter employee's last name:",
        },
        {
            type: 'list',
            name: 'employeeRole',
            message: "Select the employee's role:",
            choices: function() {
                let roleList = [];
                roleList = rows.map(Object => Object.title)
                return roleList
            }
        }
    ])
    .then(answers => {
        let roleRow = rows.find(Object => Object.title === answers.employeeRole);
        let roleId = roleRow.id;
        const newEmployee = {'first_name': answers.employeeFirstName, 'last_name': answers.employeeLastName, 'role_id': roleId}
        addEmployee(newEmployee);
        actionChoice();
    })
})
}