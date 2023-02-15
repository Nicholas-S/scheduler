const mysql = require('mysql')

const dbuser = 'schedule_handler'
const dbpass = 'jW^71*01dZuy'

const connection = mysql.createConnection(
{
    host: 'localhost',
    user: dbuser,
    password: dbpass,
    database: 'schedule_app'
})

function testDbConnection()
{
    connection.connect((err) =>
    {
    if(err)
    {
        throw err;
    } else {
        console.log("MySQL DB Connected");
    }
    });
}

function checkManagerNum(number)
{
    connection.query('SELECT cell FROM managers', function(err, result, fields)
    {
        if(err) throw err; 
        Object.keys(result).forEach(function(key)
        {
            var cell = result[key];
            if(cell == number)
            {
                return 'valid';
            }
        });
    });
    return 'error';
}

module.exports = { connection, testDbConnection, checkManagerNum };