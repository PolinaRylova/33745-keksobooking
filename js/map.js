'use strict';
(function () {
  var ADV_COUNT = 3;
  // Создание фрагмента и запись массива меток в него
  var fillFragment = function (advertisments) {
    var fragment = document.createDocumentFragment();
    for (var j = 0; j < advertisments.length; j++) {
      fragment.appendChild(window.pin.createPin(advertisments[j]));
    }
    return fragment;
  };
  // Отрисовка меток на карте и заполнение карточки первым элементом из загруженного массива
  var pinMap = document.querySelector('.tokyo__pin-map');
  // Объявляем переменную для хранения массива отрисованных меток
  var pinElements = [];
  var filteredData = [];
  var refresh = function (advCount) {
    var dataToRender = [];
    if (advCount === ADV_COUNT) {
      for (var i = 0; i < ADV_COUNT; i++) {
        dataToRender.push(window.data.advertisments[i]);
      }
    } else if (void 0 === advCount) {
      dataToRender = window.filter.doFilter(window.data.advertisments);
    }
    while (pinMap.childElementCount > 1) {
      pinMap.removeChild(pinMap.lastChild);
    }
    window.createCard.offerDialog.classList.add('hidden');
    if (dataToRender.length > 0) {
      pinMap.appendChild(fillFragment(dataToRender));
      window.createCard.offerDialog.appendChild(window.createCard.fillLodge(dataToRender[0]));
      showDialog(window.createCard.offerDialog);
      pinElements = document.querySelectorAll('.pin:not(.pin__main)');
      pinElements[0].classList.add('pin--active');
      addEventHandlersToElements(pinElements);
    }
  };
  var loadHandler = function (data) {
    window.data.setAdvertisments(data);
    refresh(ADV_COUNT);
  };
  var errorHandler = function (message) {
    var errorBlock = document.createElement('div');
    errorBlock.classList.add('error-message');
    errorBlock.textContent = message;
    document.body.insertAdjacentElement('afterBegin', errorBlock);
    var closeBtn = document.createElement('a');
    closeBtn.setAttribute('href', '#');
    closeBtn.setAttribute('tabindex', '1');
    closeBtn.classList.add('error-close');
    closeBtn.innerHTML = '<img src="img/close.svg" alt="close" width="15" height="15">';
    errorBlock.insertAdjacentElement('afterBegin', closeBtn);
    closeBtn.addEventListener('click', function () {
      errorBlock.remove();
    });
    var reloadBtn = document.createElement('a');
    reloadBtn.setAttribute('href', '#');
    reloadBtn.setAttribute('tabindex', '1');
    reloadBtn.textContent = 'Повторить';
    reloadBtn.classList.add('reload-btn');
    errorBlock.insertAdjacentElement('beforeEnd', reloadBtn);
    reloadBtn.addEventListener('click', function () {
      errorBlock.remove();
      window.backend.load(loadHandler, errorHandler);
    });
  };
  window.backend.load(loadHandler, errorHandler);
  window.filter.tokyoFilters.addEventListener('change', function () {
    window.debounce(refresh);
  });
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
  // Работа с активностью метки
  var deactivatePin = function (activePin) {
    if (activePin !== null) {
      activePin.classList.remove('pin--active');
    }
  };
  var changeActivePin = function (currentPin) {
    deactivatePin(findActivePin());
    currentPin.classList.add('pin--active');
  };
  // Показ/сокрытие карточки
  var dialogClose = window.createCard.offerDialog.querySelector('.dialog__close');
  var hideDialogAndDeactivatePin = function (element) {
    deactivatePin(findActivePin());
    element.classList.add('hidden');
  };
  var showDialog = function (element) {
    element.classList.remove('hidden');
  };
  // Обновление информации в карточке в соответствии с текущей меткой
  var changeCurrentInfo = function (element, currentPin) {
    var currentPinIndex = findCurrentPinIndex(currentPin);
    element.appendChild(window.createCard.fillLodge(filteredData[currentPinIndex])); // window.data.advertisments[currentPinIndex]));
    showDialog(element);
  };
  // Навешиваем на каждый элемент массива обработчик событий
  var addEventHandlersToElements = function (elements) {
    for (var i = 0; i < elements.length; i++) {
      window.showCard(elements[i], window.createCard.offerDialog, changeCurrentInfo);
      window.activatePin(elements[i], changeActivePin);
    }
  };
  window.showCard(dialogClose, window.createCard.offerDialog, hideDialogAndDeactivatePin);
  // Событие ESCAPE
  document.addEventListener('keydown', function (e) {
    if (e.keyCode === window.constants.ESCAPE_KEY) {
      hideDialogAndDeactivatePin(window.createCard.offerDialog);
      deactivatePin(findActivePin());
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
  var availableCoords = {
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
  pinMain.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    // Сохраняем начальные координаты
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };
    // Объявляем функцию, которая вызовется при движении мыши
    var mouseMoveHandler = function (e) {
      e.preventDefault();
      // Удаляем подсветку поля
      addressField.style.boxShadow = '';
      // Проверяем, не выходим ли мы за пределы карты
      if (e.clientX <= availableCoords.maxX && e.clientX >= availableCoords.minX && e.clientY <= availableCoords.maxY && e.clientY >= availableCoords.minY) {
        // Сохраняем координаты сдвига
        var shift = {
          x: startCoords.x - e.clientX,
          y: startCoords.y - e.clientY
        };
        // Перезаписываем начальные координаты
        startCoords = {
          x: e.clientX,
          y: e.clientY
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
        map.addEventListener('dragover', function (event) {
          event.preventDefault();
          return true;
        });
      }
    };
    // Объявляем функцию, которая вызовется при отпускании мыши
    var mouseUpHandler = function (ev) {
      ev.preventDefault();
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
    if (inputedCoordX >= availableCoords.minX && inputedCoordY >= availableCoords.minY && inputedCoordX <= availableCoords.maxX && inputedCoordY <= availableCoords.maxY) {
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
