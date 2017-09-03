'use strict';
(function () {
  // Клонирование данных шаблона
  var lodgeTemplate = document.querySelector('#lodge-template');
  var lodgeTemplateContent = lodgeTemplate.content ? lodgeTemplate.content : lodgeTemplate;
  var offerDialog = document.querySelector('#offer-dialog');
  // Создание и заполнение DOM-элемента
  var fillLodge = function (lodge) {
    var lodgeElement = lodgeTemplateContent.cloneNode(true);
    offerDialog.querySelector('.dialog__panel').remove();
    lodgeElement.querySelector('.lodge__title').textContent = lodge.offer.title;
    lodgeElement.querySelector('.lodge__address').textContent = lodge.offer.address;
    lodgeElement.querySelector('.lodge__price').textContent = lodge.offer.price + ' ' + '\u20BD/ночь';
    lodgeElement.querySelector('.lodge__type').textContent = window.data.getRusLodgeType(lodge.offer.type);
    lodgeElement.querySelector('.lodge__rooms-and-guests').textContent = 'Для ' + lodge.offer.guests + ' гостей в ' + lodge.offer.rooms + ' комнатах';
    lodgeElement.querySelector('.lodge__checkin-time').textContent = 'Заезд после ' + lodge.offer.checkin + ', выезд до ' + lodge.offer.checkout;
    lodge.offer.features.forEach(function (item) {
      var span = document.createElement('span');
      span.className = 'feature__image feature__image--' + item;
      lodgeElement.querySelector('.lodge__features').appendChild(span);
    });
    lodgeElement.querySelector('.lodge__description').textContent = lodge.offer.description;
    // Замена адреса у аватарки пользователя
    offerDialog.querySelector('.dialog__title > img').setAttribute('src', lodge.author.avatar);
    return lodgeElement;
  };
  // Показ/сокрытие карточки
  var dialogClose = offerDialog.querySelector('.dialog__close');
  var showDialog = function () {
    offerDialog.classList.remove('hidden');
  };
  var hideDialog = function () {
    offerDialog.classList.add('hidden');
  };
  var addCurrentInfo = function (currentPinIndex) {
    offerDialog.appendChild(fillLodge(window.data.advertismentsArr[currentPinIndex]));
    showDialog();
  };
  var addEvtListenersToCard = function (callback) {
    dialogClose.addEventListener('click', callback);
    dialogClose.addEventListener('keydown', callback);
  };
  window.card = {
    offerDialog: offerDialog,
    addCurrentInfo: addCurrentInfo,
    lodgeEl: fillLodge,
    hideDialog: hideDialog,
    addEvtListenersToCard: addEvtListenersToCard
  };
})();
