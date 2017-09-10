'use strict';
(function () {
  // Клонирование данных шаблона
  var lodgeTemplate = document.querySelector('#lodge-template');
  var lodgeTemplateContent = lodgeTemplate.content ? lodgeTemplate.content : lodgeTemplate;
  var offerDialog = document.querySelector('#offer-dialog');
  var getRusLodgeType = function (type) {
    var rusLodgeType = '';
    switch (type) {
      case 'flat':
        rusLodgeType = 'Квартира';
        break;
      case 'house':
        rusLodgeType = 'Дом';
        break;
      case 'bungalo':
        rusLodgeType = 'Бунгало';
        break;
      default:
        rusLodgeType = 'Тип не указан';
    }
    return rusLodgeType;
  };
  // Создание и заполнение DOM-элемента
  var fillLodge = function (lodge) {
    var lodgeElement = lodgeTemplateContent.cloneNode(true);
    var dialogPanel = offerDialog.querySelector('.dialog__panel');
    if (dialogPanel) {
      dialogPanel.remove();
    }
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
    if (offerDialog.classList.contains('hidden')) {
      offerDialog.classList.remove('hidden');
    }
    return lodgeElement;
  };
  window.createCard = {
    offerDialog: offerDialog,
    fillLodge: fillLodge
  };
})();
