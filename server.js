const db = require("./db/connection");
const inquirer = require("inquirer");
const cTable = require("console.table");
const { query } = require("./db/connection");

//start server after DB connection
db.connect((err) => {
    if (err) throw err;
    console.log("Database connect.");
});

const initResponseCheck = function (response) {
    switch (response) {
        case "view all departments":
            db.query(`SELECT * FROM department;`, (err, rows) => {
                if (err) {
                    console.log(err);
                    return;
                }
                console.table(rows);
                initApp();
            });
            break;
        case "view all roles":
            db.query(
                `SELECT role.title, role.id, department.name AS department_name, role.salary
            FROM role
            LEFT JOIN department
            ON role.department_id = department.id`,
                (err, rows) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    console.table(rows);
                    initApp();
                }
            );
            break;
        case "view all employees":
            db.query(
                `SELECT e.id, e.first_name, e.last_name,
            role.title as job_title, department.name as department,
            role.salary,
            CONCAT(m.first_name, ', ', m.last_name) as manager
            FROM employee e
            LEFT JOIN role ON e.role_id = role.id
            LEFT JOIN department ON role.department_id = department.id
            LEFT JOIN employee m ON m.id = e.manager_id
            `,
                (err, rows) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    console.table(rows);
                    initApp();
                }
            );
            break;
        case "add a department":
            inquirer
                .prompt({
                    type: "input",
                    name: "addDept",
                    message:
                        "What is the name of the department you'd like to add?",
                    validate: (deptInput) => {
                        if (deptInput) {
                            return true;
                        } else {
                            return false;
                        }
                    },
                })
                .then((deptNameObj) => {
                    db.query(
                        `INSERT INTO department(name)
                VALUES ('${deptNameObj.addDept}')`,
                        (err, rows) => {
                            if (err) {
                                console.log(err);
                                return;
                            }
                            initApp();
                        }
                    );
                });
            break;
        case "add a role":
            let deptChoicesArray = [];

            const deptQueryCallback = function (deptArray) {
                inquirer
                    .prompt([
                        {
                            type: "input",
                            name: "roleName",
                            message:
                                "What is the name of the role you'd like to add?",
                            validate: (roleInput) => {
                                if (roleInput) {
                                    return true;
                                } else {
                                    return false;
                                }
                            },
                        },
                        {
                            type: "number",
                            name: "salary",
                            message: "What is this role's salary?",
                            validate: (salInput) => {
                                if (typeof salInput === "number") {
                                    return true;
                                } else {
                                    console.log("Please enter only numbers.");
                                    return false;
                                }
                            },
                        },
                        {
                            type: "checkbox",
                            name: "department",
                            message:
                                "To which department does this role belong?",
                            choices: deptArray,
                            validate: (roleDeptInput) => {
                                if (roleDeptInput[1]) {
                                    return false;
                                } else {
                                    return true;
                                }
                            },
                        },
                    ])
                    .then((roleAnsObj) => {
                        const { roleName, salary, department } = roleAnsObj;
                        const deptToInsert =
                            deptChoicesArray.indexOf(department[0]) + 1;
                        db.query(
                            `INSERT INTO role(title, salary, department_id)
                        VALUES ('${roleName}', '${salary}', '${deptToInsert}')`,
                            (err, rows) => {
                                if (err) {
                                    console.log(err);
                                    return;
                                }
                                initApp();
                            }
                        );
                    });
            };

            const queryDept = function () {
                db.query(
                    `SELECT department.name
                    FROM department`,
                    (err, rows) => {
                        if (err) {
                            console.log(err);
                            return;
                        }
                        rows.map((element) => {
                            deptChoicesArray.push(element.name);
                        });
                        deptQueryCallback(deptChoicesArray);
                    }
                );
            };

            queryDept();
            break;

        case "add an employee":
            inquirer
                .prompt([
                    {
                        type: "input",
                        name: "firstName",
                        message: "What is the employee's first name?",
                        validate: (fnInput) => {
                            if (fnInput) {
                                return true;
                            } else {
                                return false;
                            }
                        },
                    },
                    {
                        type: "input",
                        name: "lastName",
                        message: "What is the employee's last name?",
                        //no validation because people don't always have last names
                    },
                    {
                        type: "number",
                        name: "roleId",
                        message:
                            "What is the employee's role_id? (What is the employee's new role_id? (You can run the view all role id's by selecting view all roles at the main menu)",
                        validate: (roleInput) => {
                            if (typeof roleInput === "number") {
                                return true;
                            } else {
                                console.log(
                                    "Only numeric values are accepted."
                                );
                                return false;
                            }
                        },
                    },
                    {
                        type: "number",
                        name: "manEmpId",
                        message:
                            "What is the employee's manager's employee_id? (You can run the view all employees option at the main menu to view their manager's name and emp id)",
                        validate: (manEmpInput) => {
                            if (typeof manEmpInput === "number") {
                                return true;
                            } else {
                                console.log(
                                    "Only numeric values are accepted."
                                );
                                return false;
                            }
                        },
                    },
                ])
                .then((empAnsObj) => {
                    const { firstName, lastName, roleId, manEmpId } = empAnsObj;
                    db.query(
                        `INSERT INTO employee(first_name, last_name, role_id, manager_id)
                VALUES ('${firstName}', '${lastName}', '${roleId}', '${manEmpId}')`,
                        (err, rows) => {
                            if (err) {
                                console.log(err);
                                return;
                            }
                            initApp();
                        }
                    );
                });
            break;
        case "update an employee role":
            let empArray = [];
            let empId = 0;

            const queryCallback = function (empArray) {
                inquirer
                    .prompt([
                        {
                            type: "checkbox",
                            name: "empToPromote",
                            message:
                                "Which employee's role is changing? (Please only choose one)",
                            choices: empArray,
                            validate: (empInput) => {
                                if (empInput[1]) {
                                    return false;
                                } else {
                                    return true;
                                }
                            },
                        },
                    ])
                    .then((empToChange) => {
                        empId =
                            empArray.indexOf(
                                empToChange.empToPromote[0].toString()
                            ) + 1;
                        console.log(typeof empId);
                        // this code would break if you deleted an employee because their id
                        //in the employee table would no longer align with their index
                        //in the empArray. You would have to do another db.query to the
                        //employee table for id, or find a way to include the emp id in the
                        //choices array and then access that value to run the query about
                        //changing the employee's role that follows this then statement.
                        inquirer
                            .prompt({
                                type: "number",
                                name: "roleId",
                                message:
                                    "What is the employee's new role_id? (You can run the view all role id's by selecting view all roles at the main menu)",
                                validate: (roleInput) => {
                                    if (typeof roleInput === "number") {
                                        return true;
                                    } else {
                                        console.log(
                                            "Only numeric values are accepted."
                                        );
                                        return false;
                                    }
                                },
                            })
                            .then((newRoleId) => {
                                db.query(
                                    `UPDATE employee SET role_id = ${newRoleId.roleId} WHERE id = ${empId};`,
                                    (err, rows) => {
                                        if (err) {
                                            console.log(err);
                                        }
                                    }
                                );
                                initApp();
                            });
                    });
            };

            const queryEmps = function () {
                db.query(
                    `SELECT concat(employee.first_name, ' ', employee.last_name) as employees
                    FROM employee`,
                    (err, rows) => {
                        if (err) {
                            console.log(err);
                            return;
                        }
                        rows.map((element) => {
                            empArray.push(element.employees);
                        });
                        queryCallback(empArray);
                    }
                );
            };

            queryEmps();
            break;
        default:
            console.log("This code shouldn't be reached. debug.");
    }
};

const initApp = function () {
    inquirer
        .prompt({
            type: "checkbox",
            name: "menu",
            message:
                "What would you like to do? (Choose only 1 or press ctrl + c to quit and save)",
            choices: [
                "view all departments",
                "view all roles",
                "view all employees",
                "add a department",
                "add a role",
                "add an employee",
                "update an employee role",
            ],
            validate: (menuInput) => {
                if (menuInput[1]) {
                    return false;
                } else {
                    return true;
                }
            },
        })
        .then((response) => {
            initResponseCheck(response.menu[0]);
        });
};

initApp();
