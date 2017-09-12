'use strict';
(function () {
  var advertisments = [];
  // Кэширование даннных с сервера в массив advertisments для последующего использования в карточке и фильтрах
  var setAdvertisments = function (data) {
    // Для очистки массива. Нельзя заменить его пустым, так ссылка уже экспортирована
    advertisments.length = 0;
    for (var i = 0; i < data.length; i++) {
      advertisments.push(data[i]);
    }
  };
  window.data = {
    setAdvertisments: setAdvertisments,
    advertisments: advertisments
  };
})();
