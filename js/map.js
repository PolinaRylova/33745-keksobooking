'use strict';

// Создание массива объявлений
var IMG_NUM = ['01', '02', '03', '04', '05', '06', '07', '08'];
var TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var APARTMENTS_TYPES = ['flat', 'house', 'bungalo'];
var CHECK = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
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
var getArrElementByIndex = function (length, ind) {
  return ind % length;
};
var createAdvObject = function (index) {
  var locationX = getRandomNum(300, 900);
  var locationY = getRandomNum(100, 500);
  var check = CHECK[getArrElementByIndex(CHECK.length, index)];
  return {
    'author': {
      'avatar': './img/avatars/user0' + getArrElementByIndex(IMG_NUM.length, index) + '.png'
    },

    'offer': {
      'title': TITLES[getArrElementByIndex(TITLES.length, index)],
      'address': locationX + ', ' + locationY,
      'price': getRandomNum(1000, 1000000),
      'type': APARTMENTS_TYPES[getArrElementByIndex(APARTMENTS_TYPES.length, index)],
      'rooms': getRandomNum(1, 6),
      'guests': getRandomNum(1, 16),
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
// Положить объект в массив
var putObjectToArray = function () {
  for (var j = 0; j < 9; j++) {
    advertisments.push(createAdvObject(j));
  }
};
putObjectToArray();
