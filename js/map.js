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
  // Находим метку заполняемого объявления, ширину и высоту элемента
  var pinMain = pinMap.querySelector('.pin__main');
  var pinMainWidth = pinMain.offsetWidth;
  var pinMainHeight = pinMain.offsetHeight;
  // Создаём объект координат метки по умолчанию
  var defaultPinMainCoords = {
    x: pinMain.offsetLeft + pinMainWidth / 2,
    y: pinMain.offsetTop + pinMainHeight
  };
  // Определяем размеры карты (понадобятся для ограничения вводимых координат адреса)
  var map = document.querySelector('.tokyo');
  var mapWidth = map.clientWidth;
  var mapHeight = map.clientHeight;
  // Создаем объект для допустимых координат
  var minAndMaxCoords = {
    minX: map.offsetLeft + pinMainWidth / 2,
    minY: pinMainHeight,
    maxX: mapWidth + map.offsetLeft - pinMainWidth / 2,
    maxY: mapHeight - pinMainHeight
  };
  // Находим поле для указания адреса
  var noticeForm = document.querySelector('.notice__form');
  var addressField = noticeForm.querySelector('#address');
  // Задаём ему значение по умолчанию
  addressField.value = 'x: ' + defaultPinMainCoords.x + ', y: ' + defaultPinMainCoords.y;
  // Добавляем обработчик события зажатия мыши
  pinMain.addEventListener('mousedown', function (downEvt) {
    downEvt.preventDefault();
    // Сохраняем начальные координаты
    var startCoords = {
      x: downEvt.clientX,
      y: downEvt.clientY
    };
    // Объявляем функцию, которая вызовется при движении мыши
    var mouseMoveHandler = function (moveEvt) {
      moveEvt.preventDefault();
      // Удаляем подсветку поля
      addressField.style.boxShadow = '';
      // Проверяем, не выходим ли мы за пределы карты
      if (moveEvt.clientX <= minAndMaxCoords.maxX && moveEvt.clientX >= minAndMaxCoords.minX && moveEvt.clientY <= minAndMaxCoords.maxY && moveEvt.clientY >= minAndMaxCoords.minY) {
        // Сохраняем координаты сдвига
        var shift = {
          x: startCoords.x - moveEvt.clientX,
          y: startCoords.y - moveEvt.clientY
        };
        // Перезаписываем начальные координаты
        startCoords = {
          x: moveEvt.clientX,
          y: moveEvt.clientY
        };
        // Перемещаем метку на карте
        pinMain.style.left = (pinMain.offsetLeft - shift.x) + 'px';
        pinMain.style.top = (pinMain.offsetTop - shift.y) + 'px';
        // Создаём объект координат метки поcле перемещений
        var shiftedPinMainCoords = {
          x: pinMain.offsetLeft - shift.x + pinMainWidth / 2,
          y: pinMain.offsetTop - shift.y + pinMainHeight
        };
        // Меняем значение в поле адреса
        addressField.value = 'x: ' + shiftedPinMainCoords.x + ', y: ' + shiftedPinMainCoords.y;
      } else {
        map.addEventListener('dragover', function (e) {
          e.preventDefault();
          return true;
        });
      }
    };
    // Объявляем функцию, которая вызовется при отпускании мыши
    var mouseUpHandler = function (upEvt) {
      upEvt.preventDefault();
      // Удаляем обработчики событий движения и отпускания мыши
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };
    // Добавляем обработчики событий движения и отпускания мыши
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  });
  var ERROR_RED_SHADOW = '0 0 5px 2px red';
  // Добавляем обработчик события ввода в поле адреса
  addressField.addEventListener('input', function (e) {
    // Заменяем в полученной из поля адреса строке запятые на пустые строки и превращаем строку в массив, разбив ее по пробелам
    var inputStringArr = e.target.value.replace(',', '').split(' ');
    // Вычленяем элементы массива с координатами x и y и приводим к числу
    var inputedCoordX = Number(inputStringArr[1]);
    var inputedCoordY = Number(inputStringArr[3]);
    // Проверяем, чтобы вводимые значения не выходили за пределы карты
    if (inputedCoordX >= minAndMaxCoords.minX && inputedCoordY >= minAndMaxCoords.minY && inputedCoordX <= minAndMaxCoords.maxX && inputedCoordY <= minAndMaxCoords.maxY) {
      // Удаляем подсветку поля
      addressField.style.boxShadow = '';
      // Перемещаем метку в соответствии с введенными координатами и размером метки
      pinMain.style.left = (inputedCoordX - pinMainWidth / 2) + 'px';
      pinMain.style.top = (inputedCoordY - pinMainHeight) + 'px';
    } else {
      // В случае выхода вводимых значений за диапазон возможных
      // подсвечиваем поле красным
      addressField.style.boxShadow = ERROR_RED_SHADOW;
      // И возвращаем метку и значение в поле по умолчанию
      pinMain.style.left = (defaultPinMainCoords.x - pinMainWidth / 2) + 'px';
      pinMain.style.top = (defaultPinMainCoords.y - pinMainHeight) + 'px';
      addressField.value = 'x: ' + defaultPinMainCoords.x + ', y: ' + defaultPinMainCoords.y;
    }
  });
  window.map = {
    noticeForm: noticeForm,
    addressField: addressField,
    errorStyle: ERROR_RED_SHADOW
  };
})();
