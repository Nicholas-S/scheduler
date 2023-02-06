const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const mysql = require('mysql');
const path = require('path');
const db = require('./db');
const app = express();
const port = 3000;

app.use(express.static('public'))

db.testDbConnection();

app.get('/', function(req, res)
{
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/manager', function(req, res)
{
    res.sendFile(path.join(__dirname, './public/manager.html'));
});

app.get('/pro', function(req, res)
{
    res.sendFile(path.join(__dirname, './public/pro.html'));
});


app.listen(port, () =>
{
    console.log(`scheduler listening on port ${port}`)
});