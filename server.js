
const db = require('./db/connection');
const inquirer = require('inquirer');

//start server after DB connection
db.connect(err => {
    if (err) throw err;
    console.log('Database connect.');
})

const initResponseCheck = function (response) {
    switch (response) {
        case 'view all departments':
            db.query(`SELECT * FROM department;`, (err, rows) => {
                console.table(rows);
            });
            break;
        case 'view all roles':
            console.log(2)
            break;
        case 'view all employees':
            console.log(3)
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