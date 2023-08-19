const TelegramBot = require('node-telegram-bot-api')
const config = require('config')
const mongoose = require('mongoose')
const Users = require('./models/users.model')
const Posts = require('./models/posts.model')
const { saveImage } = require('./utils/file')

const user = new Users()
const post = new Posts()

mongoose.connect(config.get('FMH_BD_TOKEN'), {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).catch(e=>console.log(e))


const bot = new TelegramBot(config.get("BOT_TOKEN"), {polling: true})

bot.on('message', async msg => {
        Users.findOne({userId: msg.from.id}).then(u => {
            if (!u) {
                user.userId = msg.from.id
                user.userTelegramName = msg.from.username
                user.userName = msg.from.first_name
                user.save().catch(e => console.log(e))
            }
        }).catch(e => console.log(e))
    if (msg.photo) {
        const photo = msg.photo
        const fileId = photo[msg.photo.length-1].file_id
        link = await bot.getFileLink(fileId)
        post.PostId = msg.message_id
        post.PostFileId = fileId
        post.PostChatId = msg.chat.id
        post.PostPhotoUrl = link
        post.PostPhotoPath = await saveImage(link, post.PostChatId + '_' + post.PostId)
        post.PostCaption = msg.caption
        post.save().catch(e => console.log(e))
        bot.sendPhoto(post.PostChatId, post.PostFileId, {caption: post.PostCaption})
    }
})
