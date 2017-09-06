'use strict';
(function () {
  // Получить русский эквивалент данных о типе жилья
  var getRusLodgeType = function (type) {
    var rusLodgeType = '';
    switch (type) {
      case 'flat':
        rusLodgeType = 'Квартира';
        break;
      case 'house':
        rusLodgeType = 'Дом';
        break;
      case 'bungalo':
        rusLodgeType = 'Бунгало';
        break;
      default:
        rusLodgeType = 'Тип не указан';
    }
    return rusLodgeType;
  };
  var advertisments = [];
  window.backend.load(function (data) {
    for (var j = 0; j < data.length; j++) {
      advertisments.push(data[j]);
    }
  }, window.backend.error);
  window.data = {
    advertismentsArr: advertisments,
    getRusLodgeType: getRusLodgeType
  };
})();
