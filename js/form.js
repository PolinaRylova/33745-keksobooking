'use strict';
(function () {
  // Form validation
  var titleField = window.map.noticeForm.querySelector('#title');
  var priceField = window.map.noticeForm.querySelector('#price');
  var checkValidity = function (currentField) {
    var isValid = true;
    currentField.setCustomValidity('');
    if (!currentField.validity.valid) {
      isValid = false;
      if (currentField.validity.valueMissing) {
        currentField.setCustomValidity('Заполните поле, пожалуйста');
      } else if (currentField.validity.tooShort) {
        currentField.setCustomValidity('Название должно содержать не менее ' + currentField.minLength + ' символов');
      } else if (currentField.validity.tooLong) {
        currentField.setCustomValidity('Название должно содержать не более ' + currentField.maxLength + ' символов');
      } else if (currentField.validity.rangeUnderflow) {
        currentField.setCustomValidity('Число должно быть в диапазоне от ' + currentField.min + ' до ' + currentField.max);
      }
    }
    // Проверка для Edge, который не поддерживает свойство 'minLength'
    if (currentField.id === 'title' && currentField.value.length < window.constants.FIELD_MIN_LENGTH) {
      isValid = false;
      currentField.setCustomValidity('Название должно содержать не менее ' + window.constants.FIELD_MIN_LENGTH + ' символов');
    }
    currentField.style.boxShadow = isValid ? '' : window.constants.ERROR_RED_SHADOW;
  };
  window.map.addressField.addEventListener('invalid', function () {
    checkValidity(window.map.addressField);
  });
  window.map.addressField.addEventListener('change', function () {
    checkValidity(window.map.addressField);
  });
  window.map.addressField.addEventListener('input', function () {
    checkValidity(window.map.addressField);
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
  // Синхронизация
  var timeinSelect = window.map.noticeForm.querySelector('#timein');
  var timeoutSelect = window.map.noticeForm.querySelector('#timeout');
  var typeSelect = window.map.noticeForm.querySelector('#type');
  var roomNumSelect = window.map.noticeForm.querySelector('#room_number');
  var capacitySelect = window.map.noticeForm.querySelector('#capacity');
  var synchronizeTimeinAndTimeout = function (masterSelect, dependentSelect) {
    dependentSelect[masterSelect.selectedIndex].selected = true;
  };
  window.synchronizeFields(timeinSelect, synchronizeTimeinAndTimeout, timeoutSelect);
  window.synchronizeFields(timeoutSelect, synchronizeTimeinAndTimeout, timeinSelect);
  var synchronizeTypeAndMinPrice = function (masterSelect, dependentSelect) {
    var selectedPriceIndex = masterSelect.selectedIndex;
    var minPrice;
    switch (selectedPriceIndex) {
      case 0:
        minPrice = 1000;
        break;
      case 1:
        minPrice = 0;
        break;
      case 2:
        minPrice = 10000;
        break;
      case 3:
        minPrice = 10000;
        break;
    }
    dependentSelect.setAttribute('min', minPrice);
  };
  window.synchronizeFields(typeSelect, synchronizeTypeAndMinPrice, priceField);
  var synchronizeRoomNumAndCapacity = function (masterSelect, dependentSelect) {
    var selectedMasterIndex = masterSelect.selectedIndex;
    var dependentIndex;
    switch (selectedMasterIndex) {
      case 0:
        dependentIndex = 2;
        showSelectOptions(dependentSelect, [2]);
        break;
      case 1:
        dependentIndex = 1;
        showSelectOptions(dependentSelect, [1, 2]);
        break;
      case 2:
        dependentIndex = 0;
        showSelectOptions(dependentSelect, [0, 1, 2]);
        break;
      case 3:
        dependentIndex = 3;
        showSelectOptions(dependentSelect, [3]);
        break;
    }
    dependentSelect[dependentIndex].selected = true;
  };
  var showSelectOptions = function (targetSelect, optionsToShow) {
    [].forEach.call(targetSelect.children, function (option, index) {
      if (optionsToShow.indexOf(index) > -1) {
        option.classList.remove('hidden');
        // Safari не применяет display: none для select option, поэтому используем disabled
        option.disabled = false;
      } else {
        option.classList.add('hidden');
        option.disabled = true;
      }
    });
  };
  window.synchronizeFields(roomNumSelect, synchronizeRoomNumAndCapacity, capacitySelect);
  synchronizeRoomNumAndCapacity(roomNumSelect, capacitySelect);
  // Обработка события submit и сброс
  window.map.noticeForm.addEventListener('submit', function (e) {
    var formFields = window.map.noticeForm.elements;
    for (var i = 0; i < formFields.length; i++) {
      formFields[i].style.boxShadow = '';
      if (!formFields[i].validity.valid) {
        formFields[i].style.boxShadow = window.constants.ERROR_RED_SHADOW;
        return;
      }
    }
    window.backend.save(new FormData(window.map.noticeForm), function () {
      window.map.noticeForm.reset();
      synchronizeTypeAndMinPrice(typeSelect, priceField);
      synchronizeRoomNumAndCapacity(roomNumSelect, capacitySelect);
    }, window.backend.error);
    e.preventDefault();
  });
})();
