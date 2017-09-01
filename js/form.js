'use strict';
(function () {
})();
// Form validation
var titleField = window.map.noticeForm.querySelector('#title');
var priceField = window.map.noticeForm.querySelector('#price');
var checkValidity = function (field) {
  var currentField = field;
  if (!currentField.validity.valid) {
    currentField.style.boxShadow = window.map.errorStyle;
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
window.map.addressField.addEventListener('invalid', function () {
  checkValidity(window.map.addressField);
});
window.map.addressField.addEventListener('change', function () {
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
// Fields dependencies
var timeinSelect = window.map.noticeForm.querySelector('#timein');
var timeoutSelect = window.map.noticeForm.querySelector('#timeout');
var typeSelect = window.map.noticeForm.querySelector('#type');
var roomNumSelect = window.map.noticeForm.querySelector('#room_number');
var capacitySelect = window.map.noticeForm.querySelector('#capacity');

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
var formSubmit = window.map.noticeForm.querySelector('.form__submit');
formSubmit.addEventListener('click', function () {
  var formFields = window.map.noticeForm.elements;
  for (var index = 0; index < formFields.length; index++) {
    formFields[index].style.boxShadow = '';
    if (!formFields[index].validity.valid) {
      formFields[index].style.boxShadow = window.map.errorStyle;
      return;
    }
  }
  window.map.noticeForm.submit();
});
window.map.noticeForm.addEventListener('submit', function (e) {
  e.preventDefault();
  window.map.noticeForm.reset();
});
