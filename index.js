const express = require('express')
const mysql = require('mysql')
const app = express();
const port = 3000;

const dbuser = 'schedule_handler'
const dbpass = 'jW^71*01dZuy'


const connection = mysql.createConnection({
    host: 'localhost',
    user: dbuser,
    password: dbpass,
    database: 'schedule_app'
  })

connection.connect();

app.use(express.static("public"));

app.get('/', (req, res) =>
{
    res.send("index.html");
})
app.listen(port, () =>
{
    console.log(`scheduler listening on port ${port}`)
})