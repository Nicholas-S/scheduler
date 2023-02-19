const ejs = require('ejs');
const fs = require('fs');
const express = require('express');
const mysql = require('mysql');
const path = require('path');
const db = require('./db');
const app = express();
const port = 3000;

app.use(express.static('public'))

db.testDbConnection();

app.get('/', (req, res) =>
{
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/manager', (req, res) =>
{
  res.sendFile(path.join(__dirname, './public/manager.html'));
});

app.get('/pro', (req, res) =>
{
  res.sendFile(path.join(__dirname, './public/pro.html'));
});

app.get('/manager/try-login/', (req, res) =>
{
  const phoneNumber = mysql.escape(req.query.SMS);
  const sql = `SELECT * FROM managers WHERE cell = ${phoneNumber}`;
  db.connection.query(sql, (err, results) =>
  {
    if (err)
    {
      console.log('MySQL Error: ' + err.message);
      return;
    }
    if (results.length > 0)
    {
      fs.readFile(__dirname + '/public/do-login.html', 'utf8', (err, html) =>
      {
        if (err)
        {
          console.log('Error reading login template: ' + err.message);
          return;
        }
        res.send(ejs.render(html, { phoneNumber: phoneNumber }));
      });
    } else {
      res.sendFile(path.join(__dirname, './public/not-rec.html'));
    }
  });
});

app.listen(port, () =>
{
  console.log(`scheduler listening on port ${port}`);
});