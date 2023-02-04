const express = require('express')
const mysql = require('mysql')
const path = require('path')
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

connection.connect((err) => 
{
    if(err)
    {
        throw err;
    } else {
        console.log("MySQL DB Connected");
    }
});

app.use(express.static('public'))

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/manager', function(req, res){
    res.sendFile(path.join(__dirname, '/public/manager.html'));
});

app.get('/pro', function(req, res){
    res.sendFile(path.join(__dirname, '/public/pro.html'));
});

app.listen(port, () =>
{
    console.log(`scheduler listening on port ${port}`)
});