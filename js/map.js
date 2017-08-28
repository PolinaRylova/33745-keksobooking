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
var ERROR_RED_SHADOW = '0 0 5px 2px red';
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
  pin.setAttribute('tabindex', 1);
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
pinMap.querySelector('.pin__main').classList.add('hidden');
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
// Form validation
var addressField = document.querySelector('#address');
var titleField = document.querySelector('#title');
var priceField = document.querySelector('#price');
var checkValidity = function (field) {
  var currentField = field;
  if (!currentField.validity.valid) {
    currentField.style.boxShadow = ERROR_RED_SHADOW;

    if (currentField.validity.valueMissing) {
      currentField.setCustomValidity('Заполните поле, пожалуйста');
    } else if (currentField.validity.tooShort || currentField.value.length < currentField.minLength) {
      currentField.setCustomValidity('Название должно содержать не менее ' + currentField.minLength + ' символов');
    } else if (currentField.validity.tooLong) {
      currentField.setCustomValidity('Название должно содержать не более ' + currentField.maxLength + ' символов');
    } else if (currentField.validity.rangeUnderflow) {
      currentField.setCustomValidity('Число должно быть в диапазоне от ' + currentField.min + ' до ' + currentField.max);
    } else {
      currentField.setCustomValidity('');
      currentField.style.boxShadow = '';
    }
  }
};
addressField.addEventListener('invalid', function () {
  checkValidity(addressField);
});
addressField.addEventListener('change', function () {
  checkValidity(addressField);
});
titleField.addEventListener('invalid', function () {
  checkValidity(titleField);
});
// Проверка поля на минимум символов для Edge
titleField.addEventListener('input', function () {
  checkValidity(titleField);
});
titleField.addEventListener('change', function () {
  checkValidity(titleField);
});
priceField.addEventListener('invalid', function () {
  checkValidity(priceField);
});
priceField.addEventListener('change', function () {
  checkValidity(priceField);
});
// Fields dependencies
var timeinSelect = document.querySelector('#timein');
var timeoutSelect = document.querySelector('#timeout');
var typeSelect = document.querySelector('#type');
var roomNumSelect = document.querySelector('#room_number');
var capacitySelect = document.querySelector('#capacity');

var synchronizeTimeinAndTimeout = function (masterSelect, dependentSelect) {
  dependentSelect[masterSelect.selectedIndex].selected = true;
};
timeinSelect.addEventListener('change', function (e) {
  synchronizeTimeinAndTimeout(e.target, timeoutSelect);
});
timeoutSelect.addEventListener('change', function (e) {
  synchronizeTimeinAndTimeout(e.target, timeinSelect);
});
var synchronizeTypeAndMinPrice = function (targetSelectedIndex) {
  var selectedPriceIndex = targetSelectedIndex;
  var minPrice;
  switch (selectedPriceIndex) {
    case 0:
      minPrice = 1000;
      break;
    case 1:
      minPrice = 0;
      break;
    case 2:
      minPrice = 5000;
      break;
    case 3:
      minPrice = 10000;
      break;
  }
  priceField.setAttribute('min', minPrice);
};
typeSelect.addEventListener('change', function (e) {
  synchronizeTypeAndMinPrice(e.target.selectedIndex);
});
var synchronizeRoomNumAndCapacity = function (masterSelect, dependentSelect) {
  var selectedMasterIndex = masterSelect.selectedIndex;
  var dependentIndex;
  var needToChange = true;
  if (masterSelect === roomNumSelect) {
    switch (selectedMasterIndex) {
      case 0:
        dependentIndex = 2;
        break;
      case 1:
        dependentIndex = 1;
        break;
      case 2:
        dependentIndex = 0;
        break;
      case 3:
        dependentIndex = 3;
        break;
    }
  } else if (masterSelect === capacitySelect) {
    switch (selectedMasterIndex) {
      case 0:
        dependentIndex = 2;
        break;
      case 1:
        if (dependentSelect[1].selected || dependentSelect[2].selected) {
          needToChange = false;
        } else {
          dependentIndex = 1;
        }
        break;
      case 2:
        if (dependentSelect[0].selected || dependentSelect[1].selected || dependentSelect[2].selected) {
          needToChange = false;
        } else {
          dependentIndex = 0;
        }
        break;
      case 3:
        dependentIndex = 3;
        break;
    }
  }
  if (needToChange) {
    dependentSelect[dependentIndex].selected = true;
  }
};
roomNumSelect.addEventListener('change', function (e) {
  synchronizeRoomNumAndCapacity(e.target, capacitySelect);
});
capacitySelect.addEventListener('change', function (e) {
  synchronizeRoomNumAndCapacity(e.target, roomNumSelect);
});
// Обработка события клика по submit и сброс
var noticeForm = document.querySelector('.notice__form');
var formSubmit = document.querySelector('.form__submit');
formSubmit.addEventListener('click', function () {
  var formFields = noticeForm.elements;
  var allValid = true;
  for (i = 0; i < formFields.length; i++) {
    formFields[i].style.boxShadow = '';
    if (!formFields[i].validity.valid) {
      formFields[i].style.boxShadow = ERROR_RED_SHADOW;
      allValid = false;
    }
  }
  if (allValid) {
    noticeForm.submit();
    noticeForm.reset();
  }
});
