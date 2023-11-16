const TelegramApi = require('node-telegram-bot-api')
const {token} = require('./config')

const bot = new TelegramApi(token, { polling: true })

let homework

const setHomework = async (chatId, text) => {
    if (text) {
        homework = text
        await bot.sendMessage(chatId, 'Новая домашняя работа задана')
    }
    else 
        await bot.sendMessage(chatId, 'Вы не добавили домашнее задании, напишите пожалуйста задание после команды /sethomework')
}

const getHomework = async chatId => await bot.sendMessage(chatId, homework ? homework : 'Походу домашней работы не задали')

const start = () => {
    bot.setMyCommands([
        { command: '/sethomework', description: 'Укажи домашку' },
        { command: '/gethomework', description: 'Узнай домашку' },
        { command: '/translate', description: 'Перевод сообщения' }
    ])

    bot.on('message', async msg => {
        const text = msg.text
        const chatId = msg.chat.id
    
        if (text === '/start')
            await bot.sendMessage(chatId, 'Привет, я бот самой лучшей группы в ульпане')
        else if (text.includes('/sethomework')) 
            await setHomework(chatId, text.replace('/sethomework', ''))
        else if (text === '/gethomework')
            await getHomework(chatId)
    })
}

start()