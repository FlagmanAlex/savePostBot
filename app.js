const TelegramBot = require('node-telegram-bot-api')
const config = require('config')
const mongoose = require('mongoose')
const Users = require('./models/users.model')
const Posts = require('./models/posts.model')
const { saveImage, parseTelegramMessage} = require('./utils')

const user = new Users()
const post = new Posts()


mongoose.connect(config.get('BD_TOKEN'), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'fmh'    
})  .then(()=> console.log('Соединение с базой прошло успешно!'))
    .catch(e=>console.log(e))

const bot = new TelegramBot(config.get("BOT_TOKEN"), {polling: true})

//Отлавливаем оишибку polling
bot.on("polling_error", err => console.log(err.data.error.message));

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
        let captionText = ''
        link = await bot.getFileLink(fileId)
        post.PostId = msg.message_id
        post.PostFileId = fileId
        post.PostChatId = msg.chat.id
        post.PostPhotoUrl = link
        post.PostPhotoPath = await saveImage(link, post.PostChatId + '_' + post.PostId)
        if (msg.caption) {
            captionText = msg.caption
            if (msg.caption_entities)
            {
                post.PostCaptionEntities = msg.caption_entities
                post.PostCaption = msg.caption
                captionText = parseTelegramMessage(msg)

            }
        } else post.PostCaption = ''
        post.save()
            .catch(e => console.log(e))
            .then(() => {
                bot.sendPhoto(config.get('SAVE_CHAT_ID'), post.PostFileId, {caption: captionText, parse_mode: 'HTML'})
            })
    }
})