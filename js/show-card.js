'use strict';
// Модуль для отображения/сокрытия карточки
(function () {
  window.showCard = function (clickedElement, changedElement, changeElement) {
    clickedElement.addEventListener('click', function (e) {
      changeElement(changedElement, e.currentTarget);
    });
    clickedElement.addEventListener('keydown', function (e) {
      if (window.keyboard.isEnterPressed(e)) {
        changeElement(changedElement, e.currentTarget);
      }
    });
  };
})();
