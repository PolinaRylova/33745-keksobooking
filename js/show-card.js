'use strict';
// Модуль для отображения/сокрытия карточки
(function () {
  window.showCard = function (clickedElement, changedElement, changeElement) {
    clickedElement.addEventListener('click', function (e) {
      changeElement(changedElement, e.currentTarget);
    });
    clickedElement.addEventListener('keydown', function (e) {
      if (e.keyCode === window.constants.ENTER_KEY) {
        changeElement(changedElement, e.currentTarget);
      }
    });
  };
})();
