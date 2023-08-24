const TelegramBot = require('node-telegram-bot-api')
const config = require('config')
const mongoose = require('mongoose')
const Users = require('./models/users.model')
const Posts = require('./models/posts.model')
const { saveImage, parseTelegramMessage} = require('./utils')

mongoose.connect(config.get('BD_TOKEN'), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'fmh'    
})  .then(()=> console.log('Соединение с базой прошло успешно!'))
    .catch(e=>console.log(e))

const bot = new TelegramBot(config.get("BOT_TOKEN"), {polling: true})

//Отлавливаем оишибку polling
bot.on("polling_error", err => console.log(err));

bot.on('channel_post', async msg => {
    const date = Date(msg.date)
    // console.log(post.PostDate.toLocaleDateString('ru-RU', {
        //     day: 'numeric',
        //     month: 'numeric',
        //     year: 'numeric', 
        //     hour: 'numeric',
        //     minute: 'numeric'
        // }));
    // Users.findOne({userId: msg.from.id}).then(u => {
        //     if (!u) {
            //         user.userId = msg.from.id
            //         user.userTelegramName = msg.from.username
            //         user.userName = msg.from.first_name
            //         user.save().catch(e => console.log(e))
            //     }
            // }).catch(e => console.log(e))
    if (msg.photo) {
        const post = new Posts()
        post.date = date
        const photo = msg.photo
        const fileId = photo[msg.photo.length-1].file_id
        let captionText = ''
        link = await bot.getFileLink(fileId)
        post.id = msg.message_id
        post.fileId = fileId
        post.chatId = msg.chat.id
        post.photoUrl = link
        post.photoPath = await saveImage(link, post.chatId + '_' + post.id)
        if (msg.caption) {
            post.caption = msg.caption
            captionText = msg.caption
            if (msg.caption_entities)
            {
                post.captionEntities = msg.caption_entities
                captionText = parseTelegramMessage(msg)

            }
        } else post.caption = ''
        post.save()
        .catch(e => console.log(e))
        .then(() => {
            bot.sendMessage(config.get('FLAGMANALEX_CHAT_ID'), `Размещенный на канале ${msg.chat.title} <a href="https://t.me/c/${post.chatId.replace("-100", "")}/${post.id}">пост №${post.id}</a> сохранен в базе`, {parse_mode: 'HTML'})
            //bot.sendPhoto(config.get('TEST_CHAT_ID'), post.PostFileId, {caption: captionText, parse_mode: 'HTML'})
        })
    }
})