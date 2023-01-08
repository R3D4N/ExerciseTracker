require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('strictQuery', false);

const dataSchema = new mongoose.Schema({
    username: {type: String, required: true},
    count: {type: Number, default: 0},
    log: [{
        description: String,
        duration: Number,
        date: String
    }]
});

const Data = mongoose.model('Data', dataSchema);

module.exports = {Data};
