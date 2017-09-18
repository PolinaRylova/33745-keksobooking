'use strict';
(function () {
  // Создание фрагмента и запись массива меток в него
  var fillFragment = function (advertisments) {
    var fragment = document.createDocumentFragment();
    advertisments.forEach(function (advItem) {
      fragment.appendChild(window.pin.create(advItem));
    });
    return fragment;
  };
  // Отрисовка меток на карте и заполнение карточки первым элементом из загруженного массива
  var pinMap = document.querySelector('.tokyo__pin-map');
  // Объявляем переменную для хранения массива отрисованных меток
  var pinElements = [];
  var advertismentsToRender = [];
  var renderAdvertisments = function (advCount) {
    if (advCount === window.constants.ADV_COUNT) {
      for (var i = 0; i < advCount; i++) {
        advertismentsToRender.push(window.data.advertisments[i]);
      }
    } else if (void 0 === advCount) {
      advertismentsToRender = window.filter.chooseElements(window.data.advertisments);
    }
    while (pinMap.childElementCount > 1) {
      pinMap.removeChild(pinMap.lastChild);
    }
    window.createCard.offerDialog.classList.add('hidden');
    if (advertismentsToRender.length > 0) {
      pinMap.appendChild(fillFragment(advertismentsToRender));
      window.createCard.offerDialog.appendChild(window.createCard.fillLodge(advertismentsToRender[0]));
      showDialog(window.createCard.offerDialog);
      pinElements = document.querySelectorAll('.pin:not(.pin__main)');
      pinElements[0].classList.add('pin--active');
      addEventHandlersToElements(pinElements);
    }
  };
  var loadHandler = function (data) {
    window.data.setAdvertisments(data);
    renderAdvertisments(window.constants.ADV_COUNT);
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
    var imgBlock = document.createElement('img');
    imgBlock.setAttribute('src', 'img/close.svg');
    imgBlock.setAttribute('alt', 'close');
    imgBlock.style.width = 15 + 'px';
    imgBlock.style.height = 15 + 'px';
    closeBtn.insertAdjacentElement('afterBegin', imgBlock);
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
    window.debounce(renderAdvertisments);
  });
  // Находим активный пин
  var findActivePin = function () {
    return [].filter.call(pinElements, function (item) {
      return item.classList.contains('pin--active');
    })[0];
  };
  // Находим индекс текущей метки
  var findCurrentPinIndex = function (currentPin) {
    return [].indexOf.call(pinElements, currentPin);
  };
  // Работа с активностью метки
  var deactivatePin = function (activePin) {
    if (activePin) {
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
    element.appendChild(window.createCard.fillLodge(advertismentsToRender[currentPinIndex]));
    showDialog(element);
  };
  // Навешиваем на каждый элемент массива обработчик событий
  var addEventHandlersToElements = function (elements) {
    [].forEach.call(elements, function (elementsItem) {
      window.showCard(elementsItem, window.createCard.offerDialog, changeCurrentInfo);
      window.activatePin(elementsItem, changeActivePin);
    });
  };
  window.showCard(dialogClose, window.createCard.offerDialog, hideDialogAndDeactivatePin);
  // Событие ESCAPE
  document.addEventListener('keydown', function (e) {
    if (window.keyboard.isEscPressed(e)) {
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
      addressField.style.boxShadow = window.constants.ERROR_RED_SHADOW;
      // И возвращаем метку и значение в поле по умолчанию
      pinMain.style.left = (defaultPinMainCoords.x - pinMainWidth / 2) + 'px';
      pinMain.style.top = (defaultPinMainCoords.y - pinMainHeight) + 'px';
      addressField.value = 'x: ' + defaultPinMainCoords.x + ', y: ' + defaultPinMainCoords.y;
    }
  });
  window.map = {
    noticeForm: noticeForm,
    addressField: addressField
  };
})();
