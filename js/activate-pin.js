'use strict';
// Модуль для активации и реактивации меток
(function () {
  window.activatePin = function (element, doSomething) {
    element.addEventListener('click', function (e) {
      doSomething(e.currentTarget);
    });
    element.addEventListener('keydown', function (e) {
      if (e.keyCode === window.constants.ENTER_KEY) {
        doSomething(e.currentTarget);
      }
    });
  };
})();
