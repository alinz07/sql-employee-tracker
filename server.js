
const db = require('./db/connection');
const inquirer = require('inquirer');
const cTable = require('console.table');

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
            CONCAT(e.first_name, ', ', e.last_name) as manager
            FROM employee e
            LEFT JOIN role ON e.role_id = role.id
            LEFT JOIN department ON role.department_id = department.id
            LEFT JOIN employee m ON e.manager_id = m.id
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
            console.log(4)
            break;
        case 'add a role':
            console.log(5)
            break;
        case 'add an employee':
            console.log(6)
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