const ejs = require('ejs');
const fs = require('fs');
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./db');
const text_auth = require('./public/text_auth');
const app = express();
const port = 3000;

app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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
      text_auth.sendVerify(phoneNumber);
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

app.post('/manager/do-login', (req, res) =>
{
  const verificationCode = req.body.verificationCode.toString();
  const phoneNumber = req.body.phoneNumber;
  text_auth.checkVerify(phoneNumber, verificationCode)
           .then(status =>
            {
              console.log(`Verification status: ${status}`)
              if(status === 'approved')
              {
                res.sendFile(path.join(__dirname, './public/manwelcome.html'))
              } else {
                fs.readFile(__dirname + '/public/code_invalid.html', 'utf8', (err, html) =>
                {
                  if (err)
                  {
                    console.log('Error reading template: ' + err.message);
                    return;
                  }
                  res.send(ejs.render(html, { phoneNumber: phoneNumber }));
                });
              }
            })
            .catch(error =>
            {
              console.log(`Verification error: ${error}`)
              fs.readFile(__dirname + '/public/internal_error.html', 'utf8', (err, html) =>
              {
                if (err)
                {
                  console.log('Error reading error template: ' + err.message);
                  return;
                }
                  res.send(ejs.render(html, { error: error }));
              });
            })
});

app.listen(port, () =>
{
  console.log(`scheduler listening on port ${port}`);
});