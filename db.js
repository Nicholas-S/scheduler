const mysql = require('mysql')

const dbuser = 'schedule_handler'
const dbpass = 'jW^71*01dZuy'

const connection = mysql.createPool(
{
    connectionLimit: 10,
    host: 'localhost',
    user: dbuser,
    password: dbpass,
    database: 'schedule_app'
});

function getFirstName(phoneNumber)
{
    let escapedPhoneNumber = mysql.escape(phoneNumber);
    let sql = `SELECT first_name FROM managers WHERE cell = ?`
    return new Promise((resolve, reject) =>
    {
        connection.query(sql, [escapedPhoneNumber], (err, result) =>
        {
            if(err)
            {
                return reject(err);
            }
            return resolve(JSON.parse(JSON.stringify(result))[0].first_name);
        });
    });
}
/*
async function getFirstName(phoneNumber)
{
    let escapedPhoneNumber = mysql.escape(phoneNumber);
    let sql = `SELECT first_name FROM managers WHERE cell = ?`
    connection.query(sql, [escapedPhoneNumber],  (err, result) =>
    {
        if(err)
        {
            console.log('MySQL Error: ' + err.message);
            return;
        }
        if(result.length > 0)
        {
            var returnName = JSON.parse(JSON.stringify(result));
            return returnName[0].first_name;
        } else {
            return null;
        }
    });
}
*/
module.exports = { connection , getFirstName };