const axios = require('axios')
const { createWriteStream } = require('fs')
const {resolve} = require('path')


const saveImage = async(url, filename) => {
    try {
        const path = resolve(__dirname, '../image', `${filename}.jpeg`)
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

module.exports = {saveImage}