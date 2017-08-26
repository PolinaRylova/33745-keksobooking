'use strict';

// Создание массива объявлений
var ENTER_KEY = 13;
var ESCAPE_KEY = 27;
var TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var APARTMENTS_TYPES = ['flat', 'house', 'bungalo'];
var CHECK = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var IMG_COUNT = 8;
var MIN_ROOMS = 1;
var MAX_ROOMS = 5;
var MIN_GUESTS = 1;
var MAX_GUESTS = 10;
var MIN_PRICE = 1000;
var MAX_PRICE = 1000000;
var MIN_LOC_X = 300;
var MAX_LOC_X = 900;
var MIN_LOC_Y = 100;
var MAX_LOC_Y = 500;
var getRandomNum = function (min, max) {
  return Math.floor(Math.random() * ((max + 1) - min)) + min; // +1 нужно для включения максимального числа
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
  var locationX = getRandomNum(MIN_LOC_X, MAX_LOC_X);
  var locationY = getRandomNum(MIN_LOC_Y, MAX_LOC_Y);
  var check = CHECK[getElementIndex(CHECK.length, index)];
  return {
    'author': {
      'avatar': './img/avatars/user0' + (getElementIndex(IMG_COUNT, index) + 1) + '.png' // +1 нужно, когда возврается 0, т.к имя картинки не может быть "00"
    },
    'offer': {
      'title': TITLES[getElementIndex(TITLES.length, index)],
      'address': locationX + ', ' + locationY,
      'price': getRandomNum(MIN_PRICE, MAX_PRICE),
      'type': APARTMENTS_TYPES[getElementIndex(APARTMENTS_TYPES.length, index)],
      'rooms': getRandomNum(MIN_ROOMS, MAX_ROOMS),
      'guests': getRandomNum(MIN_GUESTS, MAX_GUESTS),
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
  for (var j = 0; j < IMG_COUNT; j++) {
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
  pin.setAttribute('tabindex', 0);
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
// Создание фрагмента и запись массива меток в него
var fragment = document.createDocumentFragment();
for (var j = 0; j < advertisments.length; j++) {
  fragment.appendChild(createMapPin(j));
}
// Отрисовка меток в блок
var pinMap = document.querySelector('.tokyo__pin-map');
pinMap.appendChild(fragment);
// Клонирование данных шаблона
var lodgeTemplate = document.querySelector('#lodge-template');
var lodgeTemplateContent = lodgeTemplate.content ? lodgeTemplate.content : lodgeTemplate;
var offerDialog = document.querySelector('#offer-dialog');
// Создание и заполнение DOM-элемента
var fillLodge = function (lodge) {
  var lodgeElement = lodgeTemplateContent.cloneNode(true);
  offerDialog.querySelector('.dialog__panel').remove();
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
  // Замена адреса у аватарки пользователя
  offerDialog.querySelector('.dialog__title > img').setAttribute('src', lodge.author.avatar);
  offerDialog.querySelector('.dialog__close > img').setAttribute('tabindex', 0);
  return lodgeElement;
};
// Заполняем первым элементом из сгенерированного массива
offerDialog.appendChild(fillLodge(advertisments[0]));
// Показ/скрытие карточки объявления
var pinElements = document.querySelectorAll('.pin:not(.pin__main)');
var dialogClose = offerDialog.querySelector('.dialog__close');
var deactivatePins = function () {
  for (var i = 0; i < pinElements.length; i++) {
    pinElements[i].classList.remove('pin--active');
  }
};
var checkPinActive = function (currentPin) {
  deactivatePins();
  currentPin.classList.add('pin--active');
};
var addCurrentInfo = function (currentPin) {
  var currentPinIndex;
  for (var i = 0; i < pinElements.length; i++) {
    if (currentPin === pinElements[i]) {
      currentPinIndex = i;
    }
  }
  offerDialog.appendChild(fillLodge(advertisments[currentPinIndex]));
};
var showDialog = function () {
  offerDialog.classList.remove('hidden');
};
var hideDialog = function () {
  offerDialog.classList.add('hidden');
};
var pinEventHandler = function (event) {
  if (event.keyCode === ENTER_KEY || event.type === 'click') {
    deactivatePins();
    checkPinActive(event.currentTarget);
    addCurrentInfo(event.currentTarget);
    showDialog();
  }
};
var closeEventHandler = function (event) {
  if (event.keyCode === ENTER_KEY || event.type === 'click') {
    hideDialog();
    deactivatePins();
  }
};
for (var i = 0; i < pinElements.length; i++) {
  pinElements[i].addEventListener('click', pinEventHandler);
  pinElements[i].addEventListener('keydown', pinEventHandler);
}
dialogClose.addEventListener('click', closeEventHandler);
dialogClose.addEventListener('keydown', closeEventHandler);
document.addEventListener('keydown', function (event) {
  if (event.keyCode === ESCAPE_KEY) {
    hideDialog();
    deactivatePins();
  }
});
