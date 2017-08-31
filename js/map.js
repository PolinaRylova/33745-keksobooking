'use strict';
(function () {
  // Отрисовка меток в блок
  var pinMap = document.querySelector('.tokyo__pin-map');
  pinMap.querySelector('.pin__main').classList.add('hidden');
  pinMap.appendChild(window.pin.fillFragment());
  window.pin.findRenderedPins();
  // Заполняем первым элементом из сгенерированного массива
  var offerDialog = document.querySelector('#offer-dialog');
  offerDialog.appendChild(window.card.lodgeEl(window.data.advertismentsArr[0]));
})();
