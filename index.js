const TelegramApi = require('node-telegram-bot-api')

let translate
let langDefine
import('translate').then(response => translate = response)
import('franc').then(response => langDefine = response)

const { token } = require('./config')

const bot = new TelegramApi(token, { polling: true })

const homework = new Map()

const setHomework = async (chatId, msgId) => {
	homework.set(chatId, msgId)
	await bot.sendMessage(chatId, 'שאלה חדשה הועברה\n\nA new homework has been set\n\nНовое домашнее задание задано\n\nUn nouveau devoir a été défini')
}

const getHomework = async chatId => {
	if (homework.has(chatId))
		await bot.forwardMessage(chatId, chatId, homework.get(chatId))
	else
		await bot.sendMessage(chatId, 'שאלה לא הועברה\n\nNo homework has been set\n\nДомашнее задание не задано\n\nAucun devoir n\'a été défini')
}

const waitHomework = async (chatId, userId) => {
	await bot.sendMessage(chatId, 'הזן שאלת בית.\n\nEnter the homework question.\n\nВведите домашнее задание.\n\nEntrez la question du devoir.')

	const timer = setTimeout(
		() => bot.sendMessage(chatId, 'הזמן נגמר. הגדרת שאלת הבית בוטלה.\n\nTime is up. Setting the homework question has been canceled.\n\nВремя вышло. Установка домашнего задания отменена.\n\nLe temps est écoulé. La définition de la question du devoir a été annulée.'),
		60_000
	)

	const listener = async msg => {
		if (msg.from.id === userId) {
			if (msg.text === '/cancel')
				await bot.sendMessage(chatId, 'הגדרת שאלת הבית בוטלה\n\nSetting the homework question has been canceled')
			else
				await setHomework(chatId, msg.message_id)

			clearTimeout(timer)
			bot.off('message', listener)
		}
	}

	bot.on('message', listener)
}

const translateMessage = async (chatId, text) => {
	const lang = langDefine.franc(text)
	if (!text)
		return bot.sendMessage(chatId, 'מצטער, אך לא ציינת טקסט\n\nSorry, but you didn\'t specify any text\n\nИзвините, но вы не указали текст\n\nDésolé, vous n\'avez pas spécifié de texte')
	if (![ 'rus', 'eng', 'heb', 'fra' ].includes(lang))
		return bot.sendMessage(chatId, 'מצטער, אני לא מבין באיזו שפה אתה כותב, נסה לכתוב הודעה מורכבת יותר\n\nSorry, I don\'t understand which language you\'re writing in. Try writing a more detailed message\n\nИзвините, я не понимаю, на каком языке вы пишете. Попробуйте написать более развернутое сообщение\n\nDésolé, je ne comprends pas dans quelle langue vous écrivez. Essayez d\'écrire un message plus détaillé')

	await bot.sendMessage(chatId, (await Promise.all([
		translate.default(text, { from: lang, to: 'he' }),
		translate.default(text, { from: lang, to: 'en' }),
		translate.default(text, { from: lang, to: 'ru' }),
		translate.default(text, { from: lang, to: 'fr' })
	])).join`\n\n`)
}

const start = async ({ chat }) => await bot.sendMessage(chat.id, 'שלום, אני בוט של הקבוצה הטובה ביותר באולפן')
const help = async ({ chat }) => await bot.sendMessage(chat.id, '/help:\nיספר לך על כל הפקודות שהבוט יכול לבצע\nWill tell you about all the commands that the bot can execute\nРасскажет тебе обо всех командах, которые может выполнить бот\nVous parler de toutes les commandes que le bot peut exécuter\n\n/sethomework:\nיזכור מטלה בית\nWill remember homework\nЗапомнит домашнее задание\nSe souviendra du devoir\n\n/gethomework:\nיספר מה הועמד היום\nWill tell what was assigned today\nРасскажет, что задали на сегодня\nDira ce qui a été assigné aujourd\'hui\n\n/timetable:\nיציג את מערכת השעות של הלימודים באולפן\nWill display the timetable of classes in the ulpan\nПокажет расписание занятий в ульпане\nAffichera l\'horaire des cours à l\'oulpan\n\n/translate:\nהוסף טקסט לאחר הפקודה והבוט יתרגם אותו לעברית, אנגלית, צרפתית ורוסית (הבוט יכול לא להבין הודעה קצרה מאוד או הודעה בשפה אחרת, נסה לכתוב הודעה מורכבת יותר, ונסה לכתוב בעברית במידה רבה)\nAdd text after the command and the bot will translate it to Hebrew, English, French, and Russian (the bot may not understand very short messages or messages in another language, try writing a more complex message, and try to write in Hebrew as much as possible)\nДобавьте текст после команды, и бот переведет его на иврит, английский, французский и русский (бот может не понять очень короткие сообщения или сообщения на других языках, попробуйте написать более сложное сообщение, и старайтесь писать на иврите насколько это возможно)\nAjoutez du texte après la commande et le bot le traduira en hébreu, anglais, français et russe (le bot peut ne pas comprendre les messages très courts ou les messages dans d\'autres langues, essayez d\'écrire un message plus complexe et essayez d\'écrire en hébreu autant que possible)')
const timetable = async ({ chat }) => await bot.sendPhoto(chat.id, './assets/timetable.png')

const init = () => {
	bot.setMyCommands([
		{ command: '/help', description: 'מידע מפורט על צוותים' },
		{ command: '/sethomework', description: 'הגדרת שאלת בית' },
		{ command: '/gethomework', description: 'בדוק שאלת בית' },
		{ command: '/timetable', description: 'בדוק לוח זמנים' },
		{ command: '/translate', description: 'תרגם הודעה' }
	])

	bot.onText(/\/start/, start)
	bot.onText(/\/help/, help)
	bot.onText(/\/timetable/, timetable)
	bot.onText(/\/sethomework/, ({ chat, from }) => waitHomework(chat.id, from.id))
	bot.onText(/\/gethomework/, ({ chat }) => getHomework(chat.id))
	bot.onText(/\/translate\b/, msg => translateMessage(msg.chat.id, (msg.text || msg.caption).replace('/translate', '').trim()))
}

init()