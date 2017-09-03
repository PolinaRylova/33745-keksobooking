'use strict';
// Модуль для отображения/сокрытия карточки
(function () {
  window.showCard = function (element, doSomething) {
    element.addEventListener('click', function () {
      doSomething();
    });
    element.addEventListener('keydown', function () {
      doSomething();
    });
  };
  /*
  window.showCard = function (currentPinIndex) {
    window.createCard.offerDialog.appendChild(window.createCard.lodgeEl(window.data.advertismentsArr[currentPinIndex]));
    window.createCard.offerDialog.classList.remove('hidden');
  };
  var dialogClose = window.createCard.offerDialog.querySelector('.dialog__close');
  window.hideCard = function (clickedElement, ) {
    window.createCard.offerDialog.classList.add('hidden');
  };
  */
})();
