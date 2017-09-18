'use strict';
// Модуль для активации и реактивации меток
(function () {
  window.activatePin = function (element, changeActivity) {
    element.addEventListener('click', function (e) {
      changeActivity(e.currentTarget);
    });
    element.addEventListener('keydown', function (e) {
      if (window.keyboard.isEnterPressed(e)) {
        changeActivity(e.currentTarget);
      }
    });
  };
})();
