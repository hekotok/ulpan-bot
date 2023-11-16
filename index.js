const TelegramApi = require('node-telegram-bot-api')
const { token } = require('./config')

const bot = new TelegramApi(token, { polling: true })

const homework = new Map()
const chatTimers = {}

const setHomework = async (chatId, msgId) => {
	homework.set(chatId, msgId)
	await bot.sendMessage(chatId, 'Новая домашняя работа задана')
}

const getHomework = async chatId => await bot.forwardMessage(chatId, chatId, homework.get(chatId))

const waitHomework = async (chatId, userId) => {
	bot.sendMessage(chatId, 'Введите домашнее задание.')

	const timer = setTimeout(() => {
		bot.sendMessage(chatId, 'Время истекло. Установка домашнего задания отменена.')
		delete chatTimers[chatId]
	}, 60_000)

	chatTimers[chatId] = timer

	const listener = async msg => {
		if (msg.from.id === userId) {
			await setHomework(chatId, msg.message_id)

			clearTimeout(timer)
			delete chatTimers[chatId]
		}
	}

	bot.on('message', listener)
}

const start = () => {
	bot.setMyCommands([
		{ command: '/sethomework', description: 'Укажи домашку' },
		{ command: '/gethomework', description: 'Узнай домашку' },
		{ command: '/translate', description: 'Перевод сообщения' }
	])

	bot.on('message', async msg => {
		const text = msg.text || msg.caption
		const chatId = msg.chat.id

		if (!text)
			return

		if (text === '/start')
			await bot.sendMessage(chatId, 'Привет, я бот самой лучшей группы в ульпане')
		else if (text === '/sethomework')
			await waitHomework(chatId, msg.from.id)
		else if (text === '/gethomework')
			await getHomework(chatId)
	})
}

start()