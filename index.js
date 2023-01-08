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

app.use('/api/users', bodyParser.urlencoded({
  extended: false
}))

app.use('/api/users/:_id/exercises', bodyParser.urlencoded({
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

// shows each user that was saved in db
app.get('/api/users', (req, res)=>{
  User.find((err, data)=>{
    if (err){
      console.error(err);
    }else{
      res.json(data);
    }
  });
});

function createLog(userId, description, duration, date){
  Log.findOneAndUpdate({user_id: userId},{$inc:{count:1}, $push: {log: {description: description, duration: duration, date: date}}}, {new: true},(err, data)=>{
    if (err) console.error(data);
    if (data == null || data == undefined){
      let newLog = new Log({
        user_id: userId,
        count: 1,
        log:{
          description: description,
          duration: duration,
          date: date
        }
      });
      newLog.save((err, data)=>{
        if (err) console.error(err);
        console.log(data);
      })
    }else{
      console.log(data)
    }
  })
}

app.get('/api/api',(req, res)=>{
  createLog('63b2a6ea3f17ab4e6c19467a', 'sing', 20, "Mon Jan 05 2023")
})

// method that saves exercises of each user
app.post('/api/users/:_id/exercises', (req, res) => {
  let userId = req.body[':_id'];
  if (isNaN(userId)) {
    User.findById({ _id: userId }, (err, data) => {
      if (err) console.error(err);
      if (data == null || data == undefined) {
        res.json({ error: 'user id not found' });
      } else {
        let justDate = (req.body.date) ? new Date(req.body.date) : new Date();
        let newExercise = new Exercise({
          user_id: userId,
          description: req.body.description,
          duration: Number(req.body.duration),
          date: justDate.toDateString()
        });
        newExercise.save((err, exercise) => {
          if (err){
            console.error(err);
          }else{
            console.log(exercise);
            createLog(exercise.user_id, exercise.description, exercise.duration, exercise.date);
            res.json({
              _id: exercise.user_id,
              username: data.username,
              date: exercise.date,
              duration: exercise.duration,
              description: exercise.description
            })
          }
        })
      }
    });
  } else {
    res.json({ error: 'invalid id' })
  }
});

// method that shows exercises of each user
app.get('/api/users/:id/logs', (req, res)=>{
  Log.findOne({user_id: req.params.id}).populate('user_id').exec((err, data)=>{
    if (err){
      console.error(err);
    }else{
      res.json({
        _id: data.user_id._id,
        username: data.user_id.username,
        count: data.count,
        log: data.log
      });
    }
  });
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})