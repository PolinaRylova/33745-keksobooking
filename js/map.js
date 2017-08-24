'use strict';

// Создание массива объявлений
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
var lodgeElement = lodgeTemplateContent.cloneNode(true);
// Создание и заполнение DOM-элемента
var fillLodge = function (lodge) {
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
// Вставка полученного DOM-элемента вместо блока dialog__panel
var offerDialog = document.querySelector('#offer-dialog');
var dialogPanel = offerDialog.querySelector('.dialog__panel');
// Первый элемент из сгенерированного массива
var firstElement = advertisments[0];
offerDialog.replaceChild(fillLodge(firstElement), dialogPanel);
// Замена адреса у аватарки пользователя
var dialogImg = offerDialog.querySelector('.dialog__title > img');
dialogImg.setAttribute('src', firstElement.author.avatar);
// Показ/скрытие карточки объявления
var pinElements = document.querySelectorAll('.pin');
var dialogClose = offerDialog.querySelector('.dialog__close');
var showDialog = function () {
  offerDialog.classList.remove('hidden');
};
var hideDialog = function () {
  offerDialog.classList.add('hidden');
};
var deactivatePinActive = function () {
  for (var i = 0; i < pinElements.length; i++) {
    pinElements[i].classList.remove('pin--active');
  }
};
var checkPinActive = function (evt) {
  deactivatePinActive();
  var targetElement = evt.target;
  targetElement.classList.add('pin--active');
};
pinElements.forEach(function (item) {
  item.addEventListener('click', checkPinActive);
  item.addEventListener('click', showDialog);
});
dialogClose.addEventListener('click', hideDialog);
dialogClose.addEventListener('click', deactivatePinActive);
