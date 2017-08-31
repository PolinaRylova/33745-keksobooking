'use strict';
(function () {
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
  // Получить русский эквивалент данных о типе жилья
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
  var advertisments = [];
  var putObjectToArray = function () {
    for (var j = 0; j < IMG_COUNT; j++) {
      advertisments.push(createAdvObject(j));
    }
  };
  putObjectToArray();// Сборка массива из 8 объектов
  window.data = {
    advertismentsArr: advertisments,
    getRusLodgeType: getRusLodgeType
  };
})();
