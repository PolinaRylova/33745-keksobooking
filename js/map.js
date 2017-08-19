'use strict';

// Создание массива объявлений
var TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var APARTMENTS_TYPES = ['flat', 'house', 'bungalo'];
var CHECK = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var IMG_COUNT = 8;
var minRooms = 1;
var maxRooms = 5;
var minGuests = 1;
var maxGuests = 10;
var minPrice = 1000;
var maxPrice = 1000000;
var minLocX = 300;
var maxLocX = 900;
var minLocY = 100;
var maxLocY = 500;
var getRandomNum = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};
var getRandomArr = function (array) {
  var randomArr = [];
  var length = getRandomNum(1, array.length);
  for (var i = 0; i < length; i++) {
    randomArr.push(FEATURES[i]);
  }
  return randomArr;
};
var getElementIndex = function (length, ind) {
  return ind % length;
};
var createAdvObject = function (index) {
  var locationX = getRandomNum(minLocX, maxLocX);
  var locationY = getRandomNum(minLocY, maxLocY);
  var check = CHECK[getElementIndex(CHECK.length, index)];


  return {
    'author': {
      'avatar': './img/avatars/user0' + (getElementIndex(IMG_COUNT, index) + 1) + '.png'
    },

    'offer': {
      'title': TITLES[getElementIndex(TITLES.length, index)],
      'address': locationX + ', ' + locationY,
      'price': getRandomNum(minPrice, maxPrice),
      'type': APARTMENTS_TYPES[getElementIndex(APARTMENTS_TYPES.length, index)],
      'rooms': getRandomNum(minRooms, maxRooms),
      'guests': getRandomNum(minGuests, maxGuests),
      'checkin': check,
      'checkout': check,
      'features': getRandomArr(FEATURES),
      'description': '',
      'photos': []
    },

    'location': {
      'x': locationX,
      'y': locationY
    }
  };
};
var advertisments = [];
var putObjectToArray = function () {
  for (var j = 0; j < 8; j++) {
    advertisments.push(createAdvObject(j));
  }
};
putObjectToArray();// Сборка массива из 8 объектов
// Создание метки
var createMapPin = function (index) {
  var pin = document.createElement('div');
  var image = document.createElement('img');
  var data = advertisments[index];
  var pinPositionX = data.location.x + (image.offsetWidth / 2);
  var pinPositionY = data.location.y + image.offsetHeight;
  pin.classList.add('pin');
  pin.style.left = pinPositionX + 'px';
  pin.style.top = pinPositionY + 'px';

  image.src = data.author.avatar;
  image.classList.add('rounded');
  image.style.width = 40 + 'px';
  image.style.height = 40 + 'px';

  pin.appendChild(image);

  return pin;
};
var getRusLodgeType = function (type) {
  var rusLodgeType = '';
  switch (type) {
    case 'flat':
      rusLodgeType = 'Квартира';
      break;

    case 'house':
      rusLodgeType = 'Дом';
      break;

    case 'bungalo':
      rusLodgeType = 'Бунгало';
      break;

    default:
      rusLodgeType = 'Тип не указан';
  }
  return rusLodgeType;
};
// Клонирование данных шаблона
var lodgeTemplate = document.querySelector('#lodge-template');
var lodgeTemplateContent = lodgeTemplate.content ? lodgeTemplate.content : lodgeTemplate;
var fillLodge = function (lodge) {
  var lodgeElement = lodgeTemplateContent.cloneNode(true);
  lodgeElement.querySelector('.lodge__title').textContent = lodge.offer.title;
  lodgeElement.querySelector('.lodge__address').textContent = lodge.offer.address;
  lodgeElement.querySelector('.lodge__price').textContent = lodge.offer.price + ' ' + '\u20BD/ночь';
  lodgeElement.querySelector('.lodge__type').textContent = getRusLodgeType(lodge.offer.type);
  lodgeElement.querySelector('.lodge__rooms-and-guests').textContent = 'Для ' + lodge.offer.guests + ' гостей в ' + lodge.offer.rooms + ' комнатах';
  lodgeElement.querySelector('.lodge__checkin-time').textContent = 'Заезд после ' + lodge.offer.checkin + ', выезд до ' + lodge.offer.checkout;
  lodge.offer.features.forEach(function (item) {
    var span = document.createElement('span');
    span.className = 'feature__image feature__image--' + item;
    lodgeElement.querySelector('.lodge__features').appendChild(span);
  });
  lodgeElement.querySelector('.lodge__description').textContent = lodge.offer.description;
  return lodgeElement;
};
// Создание фрагмента и запись данных в него
var fragment = document.createDocumentFragment();
for (var j = 0; j < advertisments.length; j++) {
  fragment.appendChild(createMapPin(j));
  fragment.appendChild(fillLodge(advertisments[j]));
}
// Отрисовка метки
var pinMap = document.querySelector('.tokyo__pin-map');
pinMap.appendChild(fragment);
// Отрисовка диалога
var offerDialog = document.querySelector('#offer-dialog');
var dialogPanel = document.querySelector('.dialog__panel');
offerDialog.replaceChild(fragment, dialogPanel);
