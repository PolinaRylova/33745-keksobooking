'use strict';
// Form validation
var ERROR_RED_SHADOW = '0 0 5px 2px red';
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
  for (var index = 0; index < formFields.length; index++) {
    formFields[index].style.boxShadow = '';
    if (!formFields[index].validity.valid) {
      formFields[index].style.boxShadow = ERROR_RED_SHADOW;
      return;
    }
  }
  noticeForm.submit();
});
noticeForm.addEventListener('submit', function (e) {
  e.preventDefault();
  noticeForm.reset();
});
