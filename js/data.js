'use strict';
(function () {
  var advertisments = [];
  // Кэширование даннных с сервера в массив advertisments для последующего использования в карточке и фильтрах
  var setAdvertisments = function (data) {
    // Для очистки массива. Нельзя заменить его пустым, так ссылка уже экспортирована
    advertisments.length = 0;
    data.forEach(function (dataItem) {
      advertisments.push(dataItem);
    });
  };
  window.data = {
    setAdvertisments: setAdvertisments,
    advertisments: advertisments
  };
})();
