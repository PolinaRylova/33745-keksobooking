'use strict';
(function () {
  // Создание фрагмента и запись массива меток в него
  var fillFragment = function () {
    var fragment = document.createDocumentFragment();
    for (var j = 0; j < window.data.advertismentsArr.length; j++) {
      fragment.appendChild(window.pin.createMapPin(j));
    }
    return fragment;
  };
  // Отрисовка меток в блок
  var pinMap = document.querySelector('.tokyo__pin-map');
  pinMap.querySelector('.pin__main').classList.add('hidden');
  pinMap.appendChild(fillFragment());
  // Находим массив отрисованных меток
  var pinElements = document.querySelectorAll('.pin:not(.pin__main)');
  // Находим активный пин
  var findActivePin = function () {
    var activePin = null;
    pinElements.forEach(function (item) {
      if (item.classList.contains('pin--active')) {
        activePin = item;
      }
    });
    return activePin;
  };
  // Находим индекс текущей метки
  var findCurrentPinIndex = function (currentPin) {
    var currentPinIndex;
    for (var i = 0; i < pinElements.length; i++) {
      if (currentPin === pinElements[i]) {
        currentPinIndex = i;
      }
    }
    return currentPinIndex;
  };
  // Объявляем функцию, которая будет вызвана при событии на метке
  var pinEventHandler = function (e) {
    if (e.keyCode === window.constants.ENTER_KEY || e.type === 'click') {
      window.pin.deactivatePin(findActivePin());
      window.pin.activatePin(e.currentTarget);
      window.card.addCurrentInfo(findCurrentPinIndex(e.currentTarget));
    }
  };
  // Навешиваем на каждый элемент массива обработчик событий
  for (var i = 0; i < pinElements.length; i++) {
    window.pin.addEvtListenersToPin(pinElements[i], pinEventHandler);
  }
  // Объявляем функцию, которая будет вызвана при событии на крестике карточки
  var closeEventHandler = function (e) {
    if (e.keyCode === window.constants.ENTER_KEY || e.type === 'click') {
      window.card.hideDialog();
      window.pin.deactivatePin(findActivePin());
    }
  };
  // Навешиваем на крестик карточки обработчик событий
  window.card.addEvtListenersToCard(closeEventHandler);
  // Заполняем элемент карточки первым элементом из сгенерированного массива
  var offerDialog = document.querySelector('#offer-dialog');
  offerDialog.appendChild(window.card.lodgeEl(window.data.advertismentsArr[0]));
  // Событие ESCAPE
  document.addEventListener('keydown', function (e) {
    if (e.keyCode === window.constants.ESCAPE_KEY) {
      window.card.hideDialog();
      window.pin.deactivatePin(findActivePin());
    }
  });
})();
