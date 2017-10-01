const mongoose = require('mongoose');
const { Schema } = mongoose;

const listSchema = new Schema({
    name: String,
    position: Number,
    cards: [{
        type: Schema.Types.ObjectId,
        ref: 'cards'
    }]
});

mongoose.model('lists', listSchema);
