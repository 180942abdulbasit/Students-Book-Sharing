const mongoose = require("mongoose")

const RoomSchema = new mongoose.Schema({
    firstMember:{ type: mongoose.Schema.Types.ObjectId, required:true , ref:'User'},
    secondMember:{ type: mongoose.Schema.Types.ObjectId, required:true , ref:'User'},
    messageCount:{ type:Number, required:false, default:0 }
})

module.exports =  mongoose.model('Room', RoomSchema)