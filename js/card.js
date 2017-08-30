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
    lodgeElement.querySelector('.lodge__type').textContent = getRusLodgeType(lodge.offer.type);
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
  var addCurrentInfo = function (currentPin) {
    var currentPinIndex;
    for (var i = 0; i < pinElements.length; i++) {
      if (currentPin === pinElements[i]) {
        currentPinIndex = i;
      }
    }
    offerDialog.appendChild(fillLodge(advertisments[currentPinIndex]));
  };
  var showDialog = function () {
    offerDialog.classList.remove('hidden');
  };
  var hideDialog = function () {
    offerDialog.classList.add('hidden');
  };
  var closeEventHandler = function (event) {
    if (event.keyCode === window.constants.ENTER_KEY || event.type === 'click') {
      hideDialog();
      deactivatePins();
    }
  };
  var pinEventHandler = function (event) {
    if (event.keyCode === window.constants.ENTER_KEY || event.type === 'click') {
      addCurrentInfo(event.currentTarget);
      showDialog();
    }
  };
  dialogClose.addEventListener('click', closeEventHandler);
  dialogClose.addEventListener('keydown', closeEventHandler);
  // Событие ESCAPE
  document.addEventListener('keydown', function (event) {
    if (event.keyCode === window.constants.ESCAPE_KEY) {
      hideDialog();
    }
  });
  window.card = {
    dialogCloseBtn: dialogClose,
    lodgeEl: fillLodge
  };
})();
