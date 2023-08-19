const mongoose = require('mongoose')
const SignaturesSchema = new mongoose.Schema({
    chatId: {type: Number},
    descriptionSignature: {type: String}
})
module.exports = mongoose.model('Signatures', SignaturesSchema)