const mongoose = require('mongoose');
const { Schema } = mongoose;

const listSchema = new Schema({
    name: String,
    position: Number
});

mongoose.model('lists', listSchema);
