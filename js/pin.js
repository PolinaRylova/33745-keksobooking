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
  // Создание фрагмента и запись массива меток в него
  var fragment = document.createDocumentFragment();
  var fillFragment = function () {
    for (var j = 0; j < window.data.advertismentsArr.length; j++) {
      fragment.appendChild(createMapPin(j));
    }
  };
  // Активность меток
  var pinElements = document.querySelectorAll('.pin:not(.pin__main)');
  var findCurrentPinIndex = function (currentPin) {
    var currentPinIndex;
    for (var i = 0; i < pinElements.length; i++) {
      if (currentPin === pinElements[i]) {
        currentPinIndex = i;
      }
    }
    return currentPinIndex;
  };
  var deactivatePins = function () {
    for (var i = 0; i < pinElements.length; i++) {
      pinElements[i].classList.remove('pin--active');
    }
  };
  var checkPinActive = function (currentPin) {
    deactivatePins();
    currentPin.classList.add('pin--active');
  };
  var pinEventHandler = function (e) {
    if (e.keyCode === window.constants.ENTER_KEY || e.type === 'click') {
      deactivatePins();
      checkPinActive(e.currentTarget);
      window.card.addCurrentInfo(findCurrentPinIndex(e.currentTarget));
    }
  };
  var addEvtListenerToPins = function (pinEl) {
    pinEl.addEventListener('click', pinEventHandler);
    pinEl.addEventListener('keydown', pinEventHandler);
  };
  pinElements.forEach(addEvtListenerToPins);
  /*
  for (var i = 0; i < pinElements.length; i++) {
    pinElements[i].addEventListener('click', pinEventHandler);
    pinElements[i].addEventListener('keydown', pinEventHandler);
  }
  */
  // Событие ESCAPE
  document.addEventListener('keydown', function (event) {
    if (event.keyCode === window.constants.ESCAPE_KEY) {
      deactivatePins();
    }
  });
  window.pin = {
    fillFragment: fillFragment,
    deactivatePins: deactivatePins
  };
})();
