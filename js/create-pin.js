'use strict';
(function () {
  // Создание метки
  var createPin = function (item) {
    var pin = document.createElement('div');
    var image = document.createElement('img');
    var pinPositionX = item.location.x + (image.offsetWidth / 2);
    var pinPositionY = item.location.y + image.offsetHeight;
    pin.classList.add('pin');
    pin.style.left = pinPositionX + 'px';
    pin.style.top = pinPositionY + 'px';
    pin.setAttribute('tabindex', 1);
    image.src = item.author.avatar;
    image.classList.add('rounded');
    image.style.width = 40 + 'px';
    image.style.height = 40 + 'px';
    pin.appendChild(image);
    return pin;
  };
  window.pin = {
    create: createPin
  };
})();
