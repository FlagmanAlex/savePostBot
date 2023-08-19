const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
    userId: {type: Number, required: true},
    userName: {type: String},
    userFirstName: {type: String},
})

module.exports = mongoose.model('User', UserSchema)