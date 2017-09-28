const mongoose = require('mongoose');
const { Schema } = mongoose;

const cardSchema = new Schema({
    name: String,
    description: String,
    position: Number,
    _list: { type: Schema.Types.ObjectId, ref: 'lists' }
});

mongoose.model('cards', cardSchema);
