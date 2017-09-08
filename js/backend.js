'use strict';
(function () {
  var SERVER_URL = 'https://1510.dump.academy/keksobooking';
  var setup = function (loadHandler, errorHandler) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        loadHandler(xhr.response);
      } else {
        errorHandler(xhr.response);
      }
    });
    xhr.addEventListener('error', function () {
      errorHandler('Ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      errorHandler('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });
    xhr.timeout = 10000; // 10 секунд
    return xhr;
  };
  window.backend = {
    save: function (data, loadHandler, errorHandler) {
      var xhr = setup(loadHandler, errorHandler);
      xhr.open('POST', SERVER_URL);
      xhr.send(data);
    },
    load: function (loadHandler, errorHandler) {
      var xhr = setup(loadHandler, errorHandler);
      xhr.open('GET', SERVER_URL + '/data');
      xhr.send();
    },
    error: function (message) {
      var errorBlock = document.createElement('div');
      errorBlock.classList.add('error-message');
      errorBlock.textContent = message;
      document.body.insertAdjacentElement('afterBegin', errorBlock);
      var closeBtn = document.createElement('a');
      closeBtn.setAttribute('href', '#');
      closeBtn.setAttribute('tabindex', '1');
      closeBtn.classList.add('error-close');
      closeBtn.innerHTML = '<img src="img/close.svg" alt="close" width="15" height="15">';
      errorBlock.insertAdjacentElement('afterBegin', closeBtn);
      closeBtn.addEventListener('click', function () {
        errorBlock.remove();
      });
      // beforeEnd
    }
  };
})();
