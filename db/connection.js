const mysql = require('mysql2');

//connect to database
const db = mysql.createConnection(
    {
        host:"localhost",
        //your mysql username,
        user: 'root',
        //your mysql password
        password: 'Caradhras100!',
        database: 'hr'
    },
    console.log('Connected to the hr database.')
);

module.exports = db;