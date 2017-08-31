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
  // Работа с активностью метки
  var deactivatePin = function (activePin) {
    if (activePin !== null) {
      activePin.classList.remove('pin--active');
    }
  };
  var activatePin = function (currentPin) {
    currentPin.classList.add('pin--active');
  };
  var addEvtListenersToPin = function (pinEl, callback) {
    pinEl.addEventListener('click', callback);
    pinEl.addEventListener('keydown', callback);
  };
  window.pin = {
    createMapPin: createMapPin,
    addEvtListenersToPin: addEvtListenersToPin,
    deactivatePin: deactivatePin,
    activatePin: activatePin
  };
})();
