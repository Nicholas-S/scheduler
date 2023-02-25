const ejs = require('ejs');
const fs = require('fs/promises');
const express = require('express');
const sessions = require('express-session');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./db');
const text_auth = require('./public/text_auth');
const app = express();

const port = 3000;
const oneDay = 1000 * 60 * 60 * 24;

var session;

const generateSecretKey = () =>
{
  return crypto.randomBytes(32).toString('hex');
}

app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(sessions(
  {
    secret: generateSecretKey(),
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false
  }));

app.use(cookieParser());

app.get('/logout', (req, res) =>
{
  req.session.destroy();
  res.redirect('/');
});

app.get('/', (req, res) =>
{
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/manager', async (req, res) =>
{
  session = req.session
  if(req.session.manager === true)
  {
    let first_name = session.firstName;
    let html = await ejs.renderFile(path.join(__dirname + '/public/manwelcome.html'), { first_name: first_name }, { async: true });
    res.send(html);
  } else {
    res.sendFile(path.join(__dirname, './public/manager.html'));
  }
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

app.post('/manager/do-login', async (req, res) =>
{
  const verificationCode = req.body.verificationCode.toString();
  const phoneNumber = req.body.phoneNumber;
  let formattedNumber = phoneNumber.replace(/\D/g, '');
  let firstName = await db.getFirstName(formattedNumber);
  text_auth.checkVerify(phoneNumber, verificationCode)
           .then(status =>
            {
              console.log(`Verification status: ${status}`)
              if(status === 'approved')
              {
                session = req.session;
                session.userId = formattedNumber;
                session.manager = true;
                session.firstName = firstName;
                console.log(session.cookie);
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

app.get('/manager/getFirstName', async (req, res) =>
{
  const renderTemp = path.join(__dirname + '/public/getFirstName.html');
  session = req.session;
  let first_name = await db.getFirstName(session.userID);
  let renderedHTML = await ejs.renderFile(renderTemp, { first_name: first_name }, { async: true });
  res.send(renderedHTML);
});

app.get('/manager/getCookie', (req, res) =>
{
  session = req.session;
  session.userID = 19253817647;
  session.manager = true;
  res.redirect('/');
});

app.listen(port, () =>
{
  console.log(`scheduler listening on port ${port}`);
});