'use strict';
(function () {
  // Отрисовка меток в блок
  var pinMap = document.querySelector('.tokyo__pin-map');
  pinMap.querySelector('.pin__main').classList.add('hidden');
  pinMap.appendChild(window.pin.fillFragment);

  // Заполняем первым элементом из сгенерированного массива
  offerDialog.appendChild(fillLodge(advertisments[0]));

  // Событие ESCAPE
  document.addEventListener('keydown', function (event) {
    if (event.keyCode === ESCAPE_KEY) {
      hideDialog();
      deactivatePins();
    }
  });
})();
