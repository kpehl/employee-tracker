// Command Line Interface Code
// // Dependencies
// // Database module
const connection = require('./db/database');
// // // Inquirer for user input
const inquirer = require('inquirer');
// // // console.table for printing SQL data
const cTable = require('console.table')
// // // chalk for font colors
const chalk = require('chalk');
// // // Functions for the MySQL Queries
const { queryDepartments, deleteDepartment, addDepartment, queryDepartment } = require('./queries/departmentQueries');
const { rawEmployeeData, allEmployees, addEmployee, deleteEmployee, updateManager, updateRole } = require('./queries/employeeQueries');
const { rawRoles, rolesDepartments, addRole, deleteRole } = require('./queries/roleQueries');

// Open a connection to the database
connection.connect(err => {
    if (err) throw err;
    console.log('connected as id ' + connection.threadId);
    console.log('--------------------------------------------------------------------------');
    console.log('--------------------------------------------------------------------------');
    console.log('-------------------Welcome to Employee Tracker----------------------------');
    console.log('--------------------------------------------------------------------------');
    console.log('--------------------------------------------------------------------------');
    actionChoice();
  });

// A function to close the connection
const endConnection = () => {
    connection.end();
    console.log('--------------------------------------------------------------------------');
    console.log('--------------------------------------------------------------------------');
    console.log('---------------------------Goodbye----------------------------------------');
    console.log('--------------------------------------------------------------------------');
    console.log('--------------------------------------------------------------------------');
}

// A function to direct the user depending on their choice of action
const actionChoice = () => {
    inquirer.prompt([
        // View, Add, or Update
        {
            type: 'list',
            name: 'actionChoice',
            message: 'Would you like to:',
            choices: ['View', 'Add', 'Update', 'Delete', 'Exit']
        },
        // View All Departments, View All Roles, or View All Employees
        {
            type: 'list',
            name: 'viewChoices',
            message: 'What would you like to view?',
            choices: ['View All Departments', 'View All Roles', 'View All Employees', 'View Budget By Department'],
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
        },
        // Delete an Employee, Role, or Department
        {
            type: 'list',
            name: 'deleteChoices',
            message: 'What would you like to delete?',
            choices: ['Department', 'Role', 'Employee'],
            when: (answers) => answers.actionChoice === 'Delete'
        }
    ])
    .then( async (answer) => {
        if (answer.viewChoices === 'View All Departments') {
            const sql = `SELECT id AS "Department ID", name AS "Department Name" FROM department`;
            const params = [];
            connection.promise().query(sql, params)
                .then( ([rows, fields]) => {
                    console.table(rows)
                })
                .then(actionChoice)
        }
        else if (answer.viewChoices === 'View All Roles') {
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
                .then(actionChoice)
        }
        else if (answer.viewChoices === 'View All Employees') {
            const sql = `SELECT e.id AS "Employee ID",
            e.first_name AS "First Name",
            e.last_name AS "Last Name",
            role.title AS "Role Title",
            department.name AS "Department",
            role.salary AS "Salary",
            CONCAT(m.first_name, ' ', m.last_name) AS "Manager Name"
            FROM employee e
            LEFT JOIN role ON e.role_id = role.id
            LEFT JOIN employee m ON m.id = e.manager_id
            LEFT JOIN department ON role.department_id = department.id`;
            const params = [];
            connection.promise().query(sql, params)
                .then( ([rows, fields]) => {
                    console.table(rows)
                })
                .then(actionChoice)
        }
        else if (answer.viewChoices === 'View Budget By Department') {
                const sql = `SELECT department.name AS "Department Name", 
                SUM(salary) AS "Department Budget",
                COUNT(role.title) AS "Employee Count"
                FROM employee 
                LEFT JOIN role ON employee.role_id = role.id 
                LEFT JOIN department ON role.department_id = department.id
                GROUP BY department.name`;
                const params = [];
                connection.promise().query(sql, params)
                    .then( ([rows, fields]) => {
                        console.table(rows)
                    })
                    .then(actionChoice)
        }
        else if (answer.addChoices === 'Add a Department') {
            addDepartmentPrompts();
        }
        else if (answer.addChoices === 'Add a Role') {
            addRolePrompts();
        }
        else if (answer.addChoices === 'Add an Employee') {
            addEmployeePrompts();
        }
        else if (answer.updateChoices === 'Employee Role') {
            updateEmployeeRolePrompts();
        }
        else if (answer.updateChoices === 'Employee Manager') {
            updateEmployeeManagerPrompts();
        }
        else if (answer.deleteChoices === 'Department') {
            deleteDepartmentPrompts();
        }
        else if (answer.deleteChoices === 'Role') {
            deleteRolePrompts();
        }
        else if (answer.deleteChoices === 'Employee') {
            deleteEmployeePrompts();
        }
        else if (answer.actionChoice === 'Exit') {
            endConnection();
        }
        else {console.log('More options coming soon')}
    })
}

// A function for the add department prompt
const addDepartmentPrompts = () => {
    inquirer.prompt ([
        {
            type: 'input',
            name: 'departmentName',
            message: "Enter the department name:",
        }
    ])
    .then(answers => { 
        addDepartment(answers.departmentName);
        console.log(chalk.green(answers.departmentName + ' added to department table.'))
        actionChoice();
    })
}

// A function for the add role prompt
const addRolePrompts = () => {
    // get the department list
    connection.query('SELECT id as department_id, name as department_name FROM department',
    function(err, rows) {
        if (err) console.log(err);
        const departmentList = rows.map(Object => Object.department_name);
    inquirer.prompt ([
        {
            type: 'input',
            name: 'roleName',
            message: "Enter the role title:"
        },
        {
            type: 'input',
            name: 'roleSalary',
            message: "Enter the role salary:"
        },
        {
            type: 'list',
            name: 'roleDepartment',
            message: "Select the department for this role:",
            choices: departmentList
        }
    ])
    .then(answers => { 
        // find the department from the prompt in the query table
        let departmentRow = rows.find(Object => Object.department_name === answers.roleDepartment);
        // set the department id from the query table
        let departmentId = departmentRow.department_id;
        const newRole = {'title': answers.roleName, 'salary': answers.roleSalary, 'department_id': departmentId};
        addRole(newRole);
        console.log(chalk.green(answers.roleName + ' added to role table.'))
        actionChoice();
    })
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
            let managerRow = rows.find(Object => Object.manager_name === answers.managerName);
            // console.log(managerRow)
            managerId = managerRow.manager_id;
        } 
        // console.log(managerId)
        const newEmployee = {'first_name': answers.employeeFirstName, 'last_name': answers.employeeLastName, 'role_id': roleId, 'manager_id': managerId }
        // console.log(newEmployee)
        addEmployee(newEmployee);
        console.log(chalk.green(answers.employeeFirstName + ' ' + answers.employeeLastName + ' added to employee table.'))
        actionChoice();
    })
})
}

const updateEmployeeRolePrompts = () => {
    // Get the role titles and ids and the employee names and employee ids from the database
    connection.query(`SELECT id as role_id, 
        title as role_title, 
        null as employee_id, 
        null as employee_name 
        from role 
        UNION 
        SELECT null as role_id, 
        null as role_title, 
        id as employee_id, 
        CONCAT(first_name, ' ', last_name) as employee_name 
        FROM employee`,
        function (err, rows) {
    if (err) console.log(err);
    // Set up the lists for the prompt, trimming out the null values from the merged query
    const untrimmedRoleList = rows.map(Object => Object.role_title);
    const roleList = untrimmedRoleList.filter(element => element != null);
    const untrimmedEmployeeList = rows.map(Object => Object.employee_name);
    const employeeList = untrimmedEmployeeList.filter(element => element != null);
      inquirer.prompt ([
          {
              type: 'list',
              name: 'employee',
              message: "Select Employee:",
              choices: employeeList
          },
          {
              type: 'list',
              name: 'role',
              message: "Select Role:",
              choices: roleList
          }
      ])
      .then(answers => { 
          // find the department from the prompt in the query table
          let roleRow = rows.find(Object => Object.role_title === answers.role);
          // set the department id from the query table
          let roleId = roleRow.role_id;
          // find the employee id from the table
          let employeeRow = rows.find(Object => Object.employee_name === answers.employee);
          let employeeId = employeeRow.employee_id;
          const newRole = {'employee_id': employeeId, 'role_id': roleId};
          updateRole(newRole);
          console.log(chalk.yellow(answers.employee + ' role changed to ' + answers.role +'.'))
          actionChoice();
      })
  })  
}

const updateEmployeeManagerPrompts = () => {
    // Get the employee names and employee ids from the database
    connection.query(`SELECT
        id as employee_id, 
        CONCAT(first_name, ' ', last_name) as name 
        FROM employee`,
        function (err, rows) {
            if (err) console.log(err);
    // Set up the employee list for the prompt
    const employeeList = rows.map(Object => Object.name);
      inquirer.prompt ([
          {
              type: 'list',
              name: 'employee',
              message: "Select Employee:",
              choices: employeeList
          }
        ])
        .then(employeeInfo => {
            const managerList = employeeList.filter(currentEmployee => currentEmployee !== employeeInfo.employee)
            managerList.unshift('None')

            inquirer.prompt ([
                {
                    type: 'list',
                    name: 'manager',
                    message: "Select Assigned Manager:",
                    choices: managerList
                }
            ])
            .then(managerInfo => {
                // find the employee from the prompt in the query table
                let employeeRow = rows.find(Object => Object.name === employeeInfo.employee);
                // set the employee id from the query table
                let employeeId = employeeRow.employee_id;
                // Get the manager id
                let managerId = null;
                if (managerInfo.manager === 'None') {managerId = null}
                else {
                    // find the manager from the prompt in the query table
                    let managerRow = rows.find(Object => Object.name === managerInfo.manager);
                    // set the manager id from the query table
                    managerId = managerRow.employee_id;
                }
                const updatedManager = {'manager_id': managerId, 'employee_id': employeeId};
                updateManager(updatedManager);
                console.log(chalk.yellow(employeeInfo.employee + "'s manager changed to " + managerInfo.manager +'.'))
                actionChoice();
            })
        })
  })  
}

// A function for the delete department prompt
const deleteDepartmentPrompts = () => {
    console.log(chalk.red('Warning - Deleting a department will delete the roles associated with it. Employees must be manually reassigned or removed.'))
    // get the department list
    connection.query('SELECT id as department_id, name as department_name FROM department',
    function(err, rows) {
        if (err) console.log(err);
        const departmentList = rows.map(Object => Object.department_name);
    inquirer.prompt ([
        {
            type: 'list',
            name: 'department',
            message: "Select the department to delete:",
            choices: departmentList
        }
    ])
    .then(answers => { 
        // find the department from the prompt in the query table
        let departmentRow = rows.find(Object => Object.department_name === answers.department);
        // set the department id from the query table
        let departmentId = departmentRow.department_id;
        deleteDepartment(departmentId);
        console.log(chalk.red(answers.department + ' has been deleted.'))
        actionChoice();
    })
})
}

// A function for the delete role prompt
const deleteRolePrompts = () => {
    console.log(chalk.red('Warning - Employees must be manually reassigned to a new role or removed.'))
    // get the department list
    connection.query('SELECT id, title FROM role',
    function(err, rows) {
        if (err) console.log(err);
        const roleList = rows.map(Object => Object.title);
    inquirer.prompt ([
        {
            type: 'list',
            name: 'role',
            message: "Select the role to delete:",
            choices: roleList
        }
    ])
    .then(answers => { 
        // find the role from the prompt in the query table
        let roleRow = rows.find(Object => Object.title === answers.role);
        // set the department id from the query table
        let roleId = roleRow.id;
        deleteRole(roleId);
        console.log(chalk.red(answers.role + ' has been deleted.'))
        actionChoice();
    })
})
}

// A function for the delete employee prompt
const deleteEmployeePrompts = () => {
    // get the employee list
    connection.query(`SELECT
        id as employee_id, 
        CONCAT(first_name, ' ', last_name) as name 
        FROM employee`,
    function(err, rows) {
        if (err) console.log(err);
        const employeeList = rows.map(Object => Object.name);
    inquirer.prompt ([
        {
            type: 'list',
            name: 'employee',
            message: "Select the employee to delete:",
            choices: employeeList
        }
    ])
    .then(answers => { 
        // find the employee from the prompt in the query table
        let employeeRow = rows.find(Object => Object.name === answers.employee);
        // set the department id from the query table
        let employeeId = employeeRow.employee_id;
        deleteEmployee(employeeId);
        console.log(chalk.red(answers.employee + ' has been deleted.'))
        actionChoice();
    })
})
}