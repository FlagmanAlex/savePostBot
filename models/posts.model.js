const mongoose = require('mongoose')
const PostsSchema = new mongoose.Schema({
    PostChatId: {type: String, required: true},
    PostChatName: {type: String},
    PostId: {type: String, required: true},
    PostFileId: {type: String, required: true},
    PostPhotoUrl: {type: String, required: true},
    PostPhotoPath: {type: String},
    PostCaption: {type: String},
    PostCaptionEntities: {type: mongoose.Schema.Types.Mixed}
    // PostDate: {type: Date}
})
module.exports = mongoose.model('Posts', PostsSchema)