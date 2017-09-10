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
    if (diapason === 'middle') {
      return (value <= 50000) && (value >= 10000);
    }
    return false;
  };
  var checkNeedShow = function (item) {
    if (housingType.value !== 'any') {
      if (housingType.value !== item.offer.type) {
        return false;
      }
    }
    if (housingPrice.value !== 'any') {
      if (!checkPriceInDiapason(housingPrice.value, item.offer.price)) {
        return false;
      }
    }
    if (housingRoomNum.value !== 'any') {
      if (housingRoomNum.value !== item.offer.rooms) {
        return false;
      }
    }
    if (housingGuestsNum.value !== 'any') {
      if (housingGuestsNum.value !== item.offer.guests) {
        return false;
      }
    }
    if (housingWifi.checked) {
      if (item.offer.features.indexOf(housingWifi.value) === -1) {
        return false;
      }
    }
    if (housingDishwasher.checked) {
      if (item.offer.features.indexOf(housingDishwasher.value) === -1) {
        return false;
      }
    }
    if (housingParking.checked) {
      if (item.offer.features.indexOf(housingParking.value) === -1) {
        return false;
      }
    }
    if (housingWasher.checked) {
      if (item.offer.features.indexOf(housingWasher.value) === -1) {
        return false;
      }
    }
    if (housingElevator.checked) {
      if (item.offer.features.indexOf(housingElevator.value) === -1) {
        return false;
      }
    }
    if (housingConditioner.checked) {
      if (item.offer.features.indexOf(housingConditioner.value) === -1) {
        return false;
      }
    }
    return true;
  };
  window.filter = function (array) {
    var filteredArray = [];
    for (var i = 0; i < array.length; i++) {
      if (checkNeedShow(array[i])) {
        filteredArray.push(array[i]);
      }
    }
    return filteredArray;
  };
})();
