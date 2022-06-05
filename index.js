const TelegramApi = require('node-telegram-bot-api')
const {cityOptions, againOptions} = require('./options')
const EVACUATION_INFO = require('./message')
const cityList = require('./filter')
const token = '5455523407:AAGwSNYgu5U7wncrr0nsJAUfrNiAo6NXfGQ'
const bot = new TelegramApi(token, {polling: true})
const chats = {}

const chooseRegion = async (chatId) => {
    await bot.sendMessage(chatId, 'Оберіть будь ласка Ваш регіон!', cityOptions);
}

const start = async () => {

    bot.setMyCommands([
      {command: '/start', description: 'Обрати регіон.'},
      {command: '/info', description: 'Інформація.'},
      {command: '/region', description: 'Обрати регіон.'},
      {command: '/evacuation', description: 'Евакуація.'},
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        try {
            if (text === '/start') {
                return bot.sendMessage(chatId, `Доброго дня ${msg.from.first_name} У цьому боті Ви знайдете всю корисну інформацію щодо вашого регіону!`);
            }
            if (text === '/info') {
                return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name}`);
            }
            if (text === '/region') {
                return chooseRegion(chatId);
            }
            if (text === '/evacuation') {
              return bot.sendMessage(chatId, EVACUATION_INFO,{parse_mode : "HTML"});
          }
            return bot.sendMessage(chatId, 'Я Вас не розумію, спробуйте ще!)');
        } catch (e) {
            return bot.sendMessage(chatId, 'Щось пішло не так!(');
        }
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        let filteredInfo = cityList.filter(friend => friend.city === data).map(friend => friend.info) + '';

        if (data === '/again') {
          return chooseRegion(chatId)
        } else if(data) {
          await bot.sendMessage(chatId, filteredInfo, {parse_mode : "HTML"}, againOptions);
          // await bot.sendMessage(chatId, `Обрати інший регіон`, againOptions);
        } else {
          await bot.sendMessage(chatId, `Обрати інший регіон`, againOptions);
        }
    })
}

start()
