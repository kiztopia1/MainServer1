const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const shotSchema = new Schema({
    id: {
        type: String,
        required: false,
    },
    name: {
        type: String,
        required: true
    },
    image: {
        contentType: String,
        data: Buffer,
    }
},{ timestamps: true})


const Shot = mongoose.model('shot', shotSchema);
module.exports = Shot;