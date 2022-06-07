const fetch = require('node-fetch')
const TelegramApi = require('node-telegram-bot-api')
const {cityOptions, againOptions} = require('./options')
const EVACUATION_INFO = require('./message')
const cityList = require('./filter')
const token = '5455523407:AAGwSNYgu5U7wncrr0nsJAUfrNiAo6NXfGQ'
const bot = new TelegramApi(token, {polling: true})
const URL_TO_FETCH = "https://script.google.com/macros/s/AKfycbyCOQPlbr0K8ngSwOskGMv4gbP6ydhi6qwLSy4MgfuNAmb9CIWFYAO_8ccm68kZ0YZE5A/exec";

async function getStatistics() {
  const response = await fetch(URL_TO_FETCH)
  const data = await response.json()
  // let currentStatistics = data.result.find(el => el[0] == '2022-06-06')
  let currentStatistics = data.result.find(el => el[0] == getDateFormat())
  const formatData = `<b>Кількість зареєстрованих випадків знищеної техніки:</b>\n\nКількість (одиниць техніки) втрат російської армії: ${currentStatistics[1]}\nЗа сьогодні: ${currentStatistics[2]}\n\nКількість (одиниць техніки) втрат Української армії: ${currentStatistics[3]}\nЗа сьогодні: ${currentStatistics[4]}`
  return formatData 
}

async function getLastDayStatistics() {
  const response = await fetch(URL_TO_FETCH)
  const data = await response.json()
  let currentStatistics = data.result.find(el => el[0] == lastDayInfo())
  const formatData = `<b>Кількість зареєстрованих випадків знищеної техніки:</b>\n\nКількість (одиниць техніки) втрат російської армії: ${currentStatistics[1]}\nЗа сьогодні: ${currentStatistics[2]}\n\nКількість (одиниць техніки) втрат Української армії: ${currentStatistics[3]}\nЗа сьогодні: ${currentStatistics[4]}`
  return formatData 
}

function getDateFormat() {
  let D = new Date();
  return D.getFullYear() + '-' + ('0' + (D.getMonth() + 1)).slice(-2) + '-' + ('0' + D.getDate()).slice(-2)
}

function lastDayInfo() {
  let D = new Date();
  return D.getFullYear() + '-' + ('0' + (D.getMonth() + 1)).slice(-2) + '-' + ('0' + (D.getDate() - 1)).slice(-2)
}

const chooseRegion = async (chatId) => {
  await bot.sendMessage(chatId, 'Оберіть будь ласка Ваш регіон!', cityOptions);
}

const start = async () => {

  bot.setMyCommands([
    {command: '/start', description: 'Обрати регіон.'},
    {command: '/again', description: 'Обрати регіон знову.'},
    {command: '/map', description: 'Карта бойових дій.'},
    {command: '/region', description: 'Обрати регіон.'},
    {command: '/evacuation', description: 'Евакуація.'},
    {command: '/statistics', description: 'Втрати російської армії за час війни.'},
    {command: '/lastday', description: 'Втрати російської армії за минулий день.'},
  ])

  bot.on('message', async msg => {
    const text = msg.text;
    const chatId = msg.chat.id;

    try {
        if (text === '/start') {
          return bot.sendMessage(chatId, `Доброго дня ${msg.from.first_name}! У цьому боті Ви знайдете всю корисну інформацію щодо вашого регіону!\nКнопка знизу зліва екрана — меню, в якому можна знайти основні команди бота.\n\nДля початку оберіть ваш регіон.`, againOptions);
        }
        if (text === '/again') {
          return chooseRegion(chatId)
        }
        if (text === '/map') {
          return bot.sendMessage(chatId, `<a href=\"https://liveuamap.com/">Відкрити мапу.</a>`, {parse_mode : "HTML"});
        }
        if (text === '/region') {
          return chooseRegion(chatId);
        }
        if (text === '/lastday') {
          await bot.sendMessage(chatId, 'Будь ласка зачекайте, бот збирає оновлену інформацію!');
          return bot.sendMessage(chatId, await getLastDayStatistics().then(el => el), {parse_mode : "HTML"});
        }
        if (text === '/evacuation') {
          return bot.sendMessage(chatId, EVACUATION_INFO, {parse_mode : "HTML"});
        }
        if (text === '/statistics') {
          await bot.sendMessage(chatId, 'Будь ласка зачекайте, бот збирає оновлену інформацію!');
          await bot.sendMessage(chatId, await getStatistics().then(el => el), {parse_mode : "HTML"});
        }
        else {
          return bot.sendMessage(chatId, 'Я Вас не розумію, спробуйте ще!)');
        }
        } catch (e) {
          await bot.sendMessage(chatId, `Выбачте, але поки що немає оновленої інформації за сьогоднішній день, спробуйте будь ласка пізніше, або ви можете подивитись статистику за минулий день обравши команду: /lastday`);
        }
  })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        let filteredInfo = cityList.filter(region => region.city === data).map(region => region.info) + '';

        if (data === '/again') {
          return chooseRegion(chatId)
        } else if(data) {
          await bot.sendMessage(chatId, filteredInfo, {parse_mode : "HTML"}, againOptions);
        } else {
          await bot.sendMessage(chatId, `Обрати інший регіон`, againOptions);
        }
    })
}

start()
