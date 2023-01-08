const express = require('express')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { Data } = require('./database');
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
  let newUser = new Data({
    username: req.body.username,
  });
  newUser.save((err) => {
    if (err) console.error(err);
    console.log(newUser)
    res.json({ username: newUser.username, _id: newUser._id })
  });
});

// shows each user that was saved in db
app.get('/api/users', (req, res)=>{
  Data.find((err, users)=>{
    if (err){
      console.error(err);
    }else{
      res.json(users);
    }
  });
});

// method that saves exercises of each user
app.post('/api/users/:_id/exercises', (req, res) => {
  let userId = req.params['_id'];
  if (mongoose.Types.ObjectId.isValid(userId)) {
    Data.findById({ _id: userId }, (err, user) => {
      if (err) console.error(err);
      if (user == null || user == undefined) {
        res.json({ error: 'user id not found' });
      } else {
        let justDate = (req.body.date) ? new Date(req.body.date) : new Date();
        let newExercise = {
          description: req.body.description,
          duration: Number(req.body.duration),
          date: justDate.toDateString()
        }
        user.log.push(newExercise);
        user.count += 1;
        user.save((err, updatedUser) => {
          if (err){
            console.error(err);
          }else{
            console.log(updatedUser);
            res.json({
              username: updatedUser.username,
              description: newExercise.description,
              duration: newExercise.duration,
              date: newExercise.date,
              _id: updatedUser._id
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
  if( mongoose.Types.ObjectId.isValid(req.params.id)){
    let {from, to, limit} = req.query
    if(from === undefined && to === undefined && limit === undefined){
      Data.findById({_id: req.params.id}).select({__v: 0}).exec((err, user)=>{
        if (err){
          console.error(err);
        }else{
          res.json(user);
        }
      });
    }else{
      Data.findById({_id: req.params.id}).exec((err, user)=>{
        let correctDates=[]
        from = from === undefined ? new Date(0) :new Date(from);
        to = to === undefined ? new Date() :new Date(to);
        limit = limit === undefined ? 1000 : Number(limit);

        for(let i=0; i<user.count;i++){
          if(from <= new Date(user.log[i].date) && new Date(user.log[i].date) <= to){
            correctDates.push(user.log[i]);
            if (correctDates.length >= limit){
              break;
            }
          }
        };

        let newDate= correctDates.map((info)=>({
          description: info.description,
          duration: info.duration,
          date: info.date
        }))

        res.json({
          _id: user._id,
          username: user.username,
          count: correctDates.length,
          log: newDate
        })
      });
    }
  }else{
    res.json({error: 'not a valid user id'});
  }
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})