'use strict';
// Моуль для фильтрации
(function () {
  // Находим элементы фильтров
  var tokyoFilters = document.querySelector('.tokyo__filters');
  var housingType = tokyoFilters.querySelector('#housing_type');
  var housingPrice = tokyoFilters.querySelector('#housing_price');
  var housingRoomNum = tokyoFilters.querySelector('#housing_room-number');
  var housingGuestsNum = tokyoFilters.querySelector('#housing_guests-number');
  var housingWifi = tokyoFilters.querySelector('input[value="wifi"]');
  var housingDishwasher = tokyoFilters.querySelector('input[value="dishwasher"]');
  var housingParking = tokyoFilters.querySelector('input[value="parking"]');
  var housingWasher = tokyoFilters.querySelector('input[value="washer"]');
  var housingElevator = tokyoFilters.querySelector('input[value="elevator"]');
  var housingConditioner = tokyoFilters.querySelector('input[value="conditioner"]');
  var checkPriceInDiapason = function (diapason, value) {
    switch (diapason) {
      case 'any':
        return true;
      case 'middle':
        return (value <= 50000) && (value >= 10000);
      case 'low':
        return value < 10000;
      case 'high':
        return value > 50000;
      default:
        return false;
    }
  };
  var checkCheckedValue = function (targetElement, dataItem) {
    if (targetElement.checked) {
      if (dataItem.offer.features.indexOf(targetElement.value) === -1) {
        return false;
      }
    }
    return true;
  };
  var checkSelectValue = function (targetElement, dataItemParam) {
    if (targetElement.value !== 'any') {
      if (targetElement.value !== String(dataItemParam)) {
        return false;
      }
    }
    return true;
  };
  var checkNeedShow = function (item) {
    return checkSelectValue(housingType, item.offer.type) &&
      checkSelectValue(housingRoomNum, item.offer.rooms) &&
      checkSelectValue(housingGuestsNum, item.offer.guests) &&
      checkPriceInDiapason(housingPrice.value, item.offer.price) &&
      checkCheckedValue(housingWifi, item) &&
      checkCheckedValue(housingDishwasher, item) &&
      checkCheckedValue(housingParking, item) &&
      checkCheckedValue(housingWasher, item) &&
      checkCheckedValue(housingElevator, item) &&
      checkCheckedValue(housingConditioner, item);
  };
  window.filter = {
    tokyoFilters: tokyoFilters,
    chooseElements: function (array) {
      var filteredElements = [];
      array.forEach(function (arrayItem) {
        if (checkNeedShow(arrayItem)) {
          filteredElements.push(arrayItem);
        }
      });
      return filteredElements;
    }
  };
})();
