const axios = require('axios')
const { createWriteStream } = require('fs')
const {resolve} = require('path')

/**
 * 
 * @param {*} msg 
 * @returns html
 */
function parseTelegramMessage(msg) {
    const text = msg.message || msg.caption;
    const entities = msg.entities || msg.caption_entities;

    if (!entities) {
        return text;
    }

    let html = "";

    entities.forEach((entity, index) => {
        // Characters before entity
        if (index === 0) {
            html += text.slice(0, entity.offset);
        }

        // Handle entity transformation
        const entityText = text.slice(
            entity.offset,
            entity.offset + entity.length
        );
        switch (entity.type) {
            case "bold":
                html += `<strong>${entityText}</strong>`;
                break;
            case "messageEntityPre":
                html += `<pre>${entityText}</pre>`;
                break;
            case "code":
                html += `<code>${entityText}</code>`;
                break;
            case "strikethrough":
                html += `<s>${entityText}</s>`;
                break;
            case "underline":
                html += `<u>${entityText}</u>`;
                break;
            case "spoiler":
                html += `<span class="tg-spoiler">${entityText}</span>`;
                break;
            case "messageEntityUrl":
            case "text_link":
                html += `<a href="${entity.url}" target="_blank">${entityText}</a>`;
                break;
            case "italic":
                html += `<em>${entityText}</em>`;
                break;
            case "mention":
                html += `<a href="https://${entityText.replace(
                    "@",
                    ""
                )}.t.me" target="_blank">${entityText}</a>`;
                break;
            case "email":
                html += `<a href="mailto:${entityText}">${entityText}</a>`;
                break;
            case "phone_number":
                html += `<a href="tel:${entityText}">${entityText}</a>`;
                break;
            default:
                html += `${entityText}`;
        }

        // Characters after entity but before next entity
        if (entities.length > index + 1) {
            html += text.slice(
                entity.offset + entity.length,
                entities[index + 1].offset
            );
        }

        // Last characters after last entity
        if (entities.length === index + 1) {
            html += text.slice(entity.offset + entity.length);
        }
    });

    return html;

}
/**
 * [saveImage Сохранение картинок постов в папке image]
 *
 * @param   {[String]}  url       [url где лежит картинка]
 * @param   {[String]}  filename  [filename будущее имя файла]
 *
 * @return  {[String]}            [Возвращает path к сохраненному файлу]
 */
const saveImage = async(url, filename) => {
    try {
        const path = resolve(__dirname, './image', `${filename}.jpeg`)
        const response = await axios({
            method: 'get',
            url, 
            responseType: 'stream',
        })
        return new Promise(resolve => {
            const stream = createWriteStream(path)
            response.data.pipe(stream)
            stream.on('finish', () => resolve(path))
        })
    } catch (error) {
        console.log('Ошибка в модуле file.saveImage', error);
    }
}

module.exports =  {
    parseTelegramMessage,
    saveImage
}
