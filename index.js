const TelegramApi = require('node-telegram-bot-api')
const fs = require('fs')

const { token } = require('./config')

const bot = new TelegramApi(token, { polling: true })

const homework = new Map()
const chatTimers = {}

const setHomework = async (chatId, msgId) => {
	homework.set(chatId, msgId)
	await bot.sendMessage(chatId, 'Новая домашняя работа задана')
}

const getHomework = async chatId => {
	if (homework.has(chatId))
		await bot.forwardMessage(chatId, chatId, homework.get(chatId))
	else
		await bot.sendMessage(chatId, 'Домашку не задали')
}

const waitHomework = async (chatId, userId) => {
	bot.sendMessage(chatId, 'Введите домашнее задание.')

	const timer = setTimeout(() => {
		bot.sendMessage(chatId, 'Время истекло. Установка домашнего задания отменена.')
		delete chatTimers[chatId]
	}, 60_000)

	chatTimers[chatId] = timer

	const listener = async msg => {
		if (msg.from.id === userId) {
			if (msg.text === '/cancel')
				await bot.sendMessage(chatId, 'Установка домашнего задания отменена')
			else
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
		{ command: '/timetable', description: 'Узнай расписание занятий' },
		{ command: '/translate', description: 'Переведи сообщение' }
	])

	bot.onText(/\/start/, msg => bot.sendMessage(msg.chat.id, 'Привет, я бот самой лучшей группы в ульпане'))
	bot.onText(/\/sethomework/, msg => waitHomework(msg.chat.id, msg.from.id))
	bot.onText(/\/gethomework/, msg => getHomework(msg.chat.id))
	bot.onText(/\/timetable/, msg => bot.sendPhoto(msg.chat.id, fs.readFileSync('./assets/timetable.png')))
}

start()