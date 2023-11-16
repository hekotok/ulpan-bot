const TelegramApi = require('node-telegram-bot-api')
const {token} = require('./config')

const bot = new TelegramApi(token, { polling: true })

const homework = new Map()

const setHomework = async msg => {
    const text = msg.text.replace('/sethomework', '')
    const chatId = msg.chat.id

    if (text) {
        homework.set(chatId, text)
        await bot.sendMessage(chatId, 'Новая домашняя работа задана')
    }
    else 
        await bot.sendMessage(chatId, 'Вы не добавили домашнее задании, напишите пожалуйста задание после команды /sethomework')
}

const getHomework = async chatId => await bot.sendMessage(chatId, homework ? homework.get(chatId) : 'Походу домашней работы не задали')

const start = () => {
    bot.setMyCommands([
        { command: '/sethomework', description: 'Укажи домашку' },
        { command: '/gethomework', description: 'Узнай домашку' },
        { command: '/translate', description: 'Перевод сообщения' }
    ])

    bot.on('message', async msg => {
        const text = msg.text
        const chatId = msg.chat.id

        if (!text)
            return
    
        if (text === '/start')
            await bot.sendMessage(chatId, 'Привет, я бот самой лучшей группы в ульпане')
        else if (text.includes('/sethomework')) 
            await setHomework(msg)
        else if (text === '/gethomework')
            await getHomework(chatId)
    })
}

start()