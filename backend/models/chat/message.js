const mongoose = require("mongoose")

const MessageSchema = new mongoose.Schema({
    body:{type:String, required: true},
    sender: {type: mongoose.Schema.Types.ObjectId, required: true, ref:'User'},
    room:{ type: mongoose.Schema.Types.ObjectId, required: true, ref:'Room'}
}, {timestamps:true})

module.exports = mongoose.model('Message', MessageSchema)