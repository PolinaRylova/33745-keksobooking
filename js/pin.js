'use strict';
(function () {
  // Создание метки
  var createMapPin = function (index) {
    var pin = document.createElement('div');
    var image = document.createElement('img');
    var data = window.data.advertismentsArr[index];
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
  for (var j = 0; j < window.data.advertismentsArr.length; j++) {
    fragment.appendChild(createMapPin(j));
  }
  // Активность меток
  var pinElements = document.querySelectorAll('.pin:not(.pin__main)');
  var deactivatePins = function () {
    for (var i = 0; i < pinElements.length; i++) {
      pinElements[i].classList.remove('pin--active');
    }
  };
  var checkPinActive = function (currentPin) {
    deactivatePins();
    currentPin.classList.add('pin--active');
  };
  var pinEventHandler = function (event) {
    if (event.keyCode === window.constants.ENTER_KEY || event.type === 'click') {
      deactivatePins();
      checkPinActive(event.currentTarget);
    }
  };
  var closeEventHandler = function (event) {
    if (event.keyCode === window.constants.ENTER_KEY || event.type === 'click') {
      deactivatePins();
    }
  };
  for (var i = 0; i < pinElements.length; i++) {
    pinElements[i].addEventListener('click', pinEventHandler);
    pinElements[i].addEventListener('keydown', pinEventHandler);
  }
  var dialogCloseBtn = window.card.dialogCloseBtn;
  dialogCloseBtn.addEventListener('click', closeEventHandler);
  dialogCloseBtn.addEventListener('keydown', closeEventHandler);
  // Событие ESCAPE
  document.addEventListener('keydown', function (event) {
    if (event.keyCode === window.constants.ESCAPE_KEY) {
      deactivatePins();
    }
  });
  window.pin = {
    fragment: fragment
  };
})();
