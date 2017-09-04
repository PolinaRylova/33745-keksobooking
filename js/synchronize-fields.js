'use strict';
// Модуль для синхронизации полей
(function () {
  window.synchronizeFields = function (masterSelect, synchronizeFunction, dependentSelect) {
    masterSelect.addEventListener('change', function (e) {
      synchronizeFunction(e.target, dependentSelect);
    });
  };
})();
