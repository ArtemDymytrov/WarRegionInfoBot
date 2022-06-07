module.exports = {
  cityOptions: {
     reply_markup: JSON.stringify({
         inline_keyboard: [
             [{text: 'АР Крим', callback_data: `1`}],
             [{text: 'Вінницька', callback_data: '2'}],
             [{text: 'Волинська', callback_data: '3'}],
             [{text: 'Дніпропетровська', callback_data: '4'}],
             [{text: 'Донецька', callback_data: '5'}],
             [{text: 'Житомирська', callback_data: '6'}],
             [{text: 'Закарпатська', callback_data: '7'}],
             [{text: 'Запорізька', callback_data: '8'}],
             [{text: 'Івано-Франківська', callback_data: '9'}],
             [{text: 'Київська', callback_data: '10'}],
             [{text: 'Кіровоградська', callback_data: '11'}],
             [{text: 'Луганська', callback_data: '12'}],
             [{text: 'Львівська', callback_data: '13'}],
             [{text: 'Миколаївська', callback_data: '14'}],
             [{text: 'Одеська', callback_data: '15'}],
             [{text: 'Полтавська', callback_data: '16'}],
             [{text: 'Рівненська', callback_data: '17'}],
             [{text: 'Сумська', callback_data: '18'}],
             [{text: 'Тернопільська', callback_data: '19'}],
             [{text: 'Харківська', callback_data: '20'}],
             [{text: 'Херсонська', callback_data: '21'}],
             [{text: 'Хмельницька', callback_data: '22'}],
             [{text: 'Черкаська', callback_data: '23'}],
             [{text: 'Чернівецька', callback_data: '24'}],
             [{text: 'Чернігівська', callback_data: '25'}],
         ]
     })
 },

 againOptions: {
     reply_markup: JSON.stringify({
         inline_keyboard: [
             [{text: 'Обрати регіон.', callback_data: '/again'}],
         ]
     })
 }
}
