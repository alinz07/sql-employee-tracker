const db = require('./db/connection');
const inquirer = require('inquirer');
const cTable = require('console.table');

let deptChoicesArray = ['Operations', 'Finance', 'Legal', 'HR', 'Marketing'];

//start server after DB connection
db.connect(err => {
    if (err) throw err;
    console.log('Database connect.');
})

const initResponseCheck = function (response) {
    switch (response) {
        case 'view all departments':
            db.query(`SELECT * FROM department;`, (err, rows) => {
                if (err) {
                    console.log(err);
                    return;
                }
                console.table(rows);
                initApp();
            });
            break;
        case 'view all roles':
            db.query(`SELECT role.title, role.id, department.name AS department_name, role.salary
            FROM role
            LEFT JOIN department
            ON role.department_id = department.id`, (err, rows) => {
                if (err) {
                    console.log(err);
                    return;
                }
                console.table(rows);
                initApp();
            })
            break;
        case 'view all employees':
            db.query(`SELECT e.id, e.first_name, e.last_name,
            role.title as job_title, department.name as department,
            role.salary,
            CONCAT(m.first_name, ', ', m.last_name) as manager
            FROM employee e
            LEFT JOIN role ON e.role_id = role.id
            LEFT JOIN department ON role.department_id = department.id
            LEFT JOIN employee m ON m.id = e.manager_id
            `
            , (err, rows) => {
                if (err) {
                    console.log(err);
                    return;
                }
                console.table(rows);
                initApp();
            })
            break;
        case 'add a department':
            inquirer.prompt({
                type: 'input',
                name: 'addDept',
                message: "What is the name of the department you'd like to add?",
                validate: deptInput => {
                    if (deptInput) {
                        return true;
                    } else {
                        return false;
                    }
                }
            })
            .then((deptNameObj) => {
                deptChoicesArray.push(deptNameObj.addDept);
                db.query(`INSERT INTO department(name)
                VALUES ('${deptNameObj.addDept}')`, (err, rows) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    initApp();
                })
            });
            break;
        case 'add a role':
            inquirer.prompt([

                {
                    type: 'input',
                    name: 'roleName',
                    message: "What is the name of the role you'd like to add?",
                    validate: roleInput => {
                        if (roleInput) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                },
                {
                    type: 'number',
                    name: 'salary',
                    message: "What is this role's salary?",
                    validate: salInput => {
                        if (typeof salInput === 'number') {
                            return true;
                        } else {
                            console.log("Please enter only numbers.")
                            return false;
                        }
                    }
                },
                {
                    type: 'checkbox',
                    name: 'department',
                    message: 'To which department does this role belong?',
                    choices: deptChoicesArray,
                    validate: roleDeptInput => {
                        if (roleDeptInput[1]) {
                            return false;
                        } else {
                            return true;
                        }
                    }
                }
        ])
        .then((roleAnsObj) => {
            const {roleName, salary, department} = roleAnsObj;
            const deptToInsert = (deptChoicesArray.indexOf(department[0])) + 1;
            db.query(`INSERT INTO role(title, salary, department_id)
                VALUES ('${roleName}', '${salary}', '${deptToInsert}')`, (err, rows) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    initApp();
                })
        });
            break;
        case 'add an employee':
            inquirer.prompt([

                {
                    type: 'input',
                    name: 'firstName',
                    message: "What is the employee's first name?",
                    validate: fnInput => {
                        if (fnInput) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                },
                {
                    type: 'input',
                    name: 'lastName',
                    message: "What is the employee's last name?",
                    //no validation because people don't always have last names
                },
                {
                    type: 'number',
                    name: 'roleId',
                    message: "What is the employee's role_id? (You can run the view all roles option at the main menu to view role id's)",
                    validate: roleInput => {
                        if (typeof roleInput === 'number') {
                            return true;
                        } else {
                            console.log("Only numeric values are accepted.")
                            return false;
                        }
                    }
                },
                {
                    type: 'number',
                    name: 'manEmpId',
                    message: "What is the employee's manager's employee_id? (You can run the view all employees option at the main menu to view their manager's name and emp id)",
                    validate: manEmpInput => {
                        if (typeof manEmpInput === 'number') {
                            return true;
                        } else {
                            console.log("Only numeric values are accepted.")
                            return false;
                        }
                    }
                }
        ])
        .then((empAnsObj) => {
            console.log(empAnsObj);
            const {firstName, lastName, roleId, manEmpId} = empAnsObj;
            db.query(`INSERT INTO employee(first_name, last_name, role_id, manager_id)
                VALUES ('${firstName}', '${lastName}', '${roleId}', '${manEmpId}')`, (err, rows) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    initApp();
                })
        });
        break;
        case 'update an employee role':
            console.log(7)
            break;
        default:
            console.log("This code shouldn't be reached. debug.")
    }
}

const initApp = function() {
    inquirer.prompt (
        {
            type: 'checkbox',
            name: 'menu',
            message: "What would you like to do? (Choose only 1)",
            choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update an employee role'],
            validate: menuInput => {
                if (menuInput[1]) {
                    return false;
                } else {
                    return true;
                }
            }
        })
        .then((response) => {
            initResponseCheck(response.menu[0]);
        })
    }

initApp();