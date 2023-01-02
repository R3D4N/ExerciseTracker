const express = require('express')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { Exercise, User, Log } = require('./database');
const app = express()
//const cors = require('cors')
require('dotenv').config()

//app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.use('', bodyParser.urlencoded({
  extended: false
}))

// method that saves user
app.post('/api/users', (req, res) => {
  let newUser = new User({
    username: req.body.username,
    _id: new mongoose.Types.ObjectId()
  });
  newUser.save((err) => {
    if (err) console.error(err);
    console.log(newUser)
    res.json({ username: newUser.username, _id: newUser._id })
  });
});

app.post('', (req, res) => {

});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
