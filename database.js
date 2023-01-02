require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('strictQuery', false);

const exerciseSchema = new mongoose.Schema({
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    description: String,
    duration: Number,
    date: String
});

const userSchema = new mongoose.Schema({
    username: String,
    _id: mongoose.Schema.Types.ObjectId
});

const logSchema = new mongoose.Schema({
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    count: Number,
    log: [{type: mongoose.Schema.Types.ObjectId, ref: 'Exercise'}]
});

const Exercise = mongoose.model('Exercise', exerciseSchema);
const User = mongoose.model('User', userSchema);
const Log = mongoose.model('Log', logSchema);

module.exports = {Exercise, User, Log};
