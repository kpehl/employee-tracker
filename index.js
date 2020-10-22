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
    // Get the role titles and ids and the manager names and employee ids from the database
    connection.query(`SELECT id as role_id, 
                    title as role_title, 
                    null as manager_id, 
                    null as manager_name 
                    from role 
                    UNION 
                    SELECT null as role_id, 
                    null as role_title, 
                    id as manager_id, 
                    CONCAT(first_name, ' ', last_name) as manager_name 
                    FROM employee`,
                     function (err, rows) {
        if (err) console.log(err);
        // Set up the lists for the prompt, trimming out the null values from the merged query
        const untrimmedRoleList = rows.map(Object => Object.role_title);
        const roleList = untrimmedRoleList.filter(element => element != null);
        const untrimmedManagerList = rows.map(Object => Object.manager_name);
        const managerList = untrimmedManagerList.filter(element => element != null);
        // Add an option for no manager
        managerList.unshift('None'); 
    // Prompt the user for the new employee information
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
            choices: roleList
        },
        {
            type: 'list',
            name: 'managerName',
            message: "Select the employee's manager",
            choices: managerList
        }
    ])
    .then(answers => {
        // find the role from the prompt in the query table
        let roleRow = rows.find(Object => Object.role_title === answers.employeeRole);
        // console.log(roleRow)
        // set the Role id from the query table
        let roleId = roleRow.role_id;
        // console.log(roleId)
        // Get the manager id
        let managerId = null;
        if (answers.managerName === 'None') {managerId = null}
        else {
            managerRow = rows.find(Object => Object.manager_name === answers.managerName);
            // console.log(managerRow)
            managerId = managerRow.manager_id;
        } 
        // console.log(managerId)
        const newEmployee = {'first_name': answers.employeeFirstName, 'last_name': answers.employeeLastName, 'role_id': roleId, 'manager_id': managerId }
        // console.log(newEmployee)
        addEmployee(newEmployee);
        console.log(answers.employeeFirstName + ' ' + answers.employeeLastName + ' added to employee table.')
        actionChoice();
    })
})
}