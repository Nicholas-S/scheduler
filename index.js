const express = require('express');
const app = express()
const port = 3000

app.use(express.static("static"));

app.get('/', (req, res) =>
{
    res.send('index.html')
})

app.get('/schedule?', (req, res) =>
{
    res.send('schedule.html')
})
  
app.listen(port, () =>
{
    console.log(`scheduler listening on port ${port}`)
})