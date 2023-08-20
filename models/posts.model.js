const mongoose = require('mongoose')
const PostsSchema = new mongoose.Schema({
    date: {type: Date} ,
    chatId: {type: String, required: true},
    chatName: {type: String},
    id: {type: String, required: true},
    fileId: {type: String, required: true},
    photoUrl: {type: String, required: true},
    photoPath: {type: String},
    caption: {type: String},
    captionEntities: {type: mongoose.Schema.Types.Mixed}
    // PostDate: {type: Date}
})
module.exports = mongoose.model('Posts', PostsSchema)