'use strict';
(function () {
  var SERVER_URL = 'https://1510.dump.academy/keksobooking';
  var setup = function (successHandler, errorHandler) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        successHandler(xhr.response);
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
    save: function (data, successHandler, errorHandler) {
      var xhr = setup(successHandler, errorHandler);
      xhr.open('POST', SERVER_URL);
      xhr.send(data);
    },
    load: function (successHandler, errorHandler) {
      var xhr = setup(successHandler, errorHandler);
      xhr.open('GET', SERVER_URL + '/data');
      xhr.send();
    },
    error: function (message) {
      var errorBlock = document.createElement('div');
      errorBlock.style.width = 50 + '%';
      errorBlock.style.height = 50 + 'px';
      errorBlock.style.position = 'fixed';
      errorBlock.style.top = 50 + '%';
      errorBlock.style.left = 50 + '%';
      errorBlock.style.transform = 'translate(-50%, -50%)';
      errorBlock.style.zIndex = 5;
      errorBlock.style.display = 'flex';
      errorBlock.style.alignItems = 'center';
      errorBlock.style.justifyContent = 'center';
      errorBlock.style.backgroundColor = '#ffffff';
      errorBlock.style.border = '3px solid #ff5635';
      errorBlock.style.borderRadius = 50 + '%';
      errorBlock.style.color = '#ff5635';
      errorBlock.textContent = message;
      document.body.insertAdjacentElement('afterbegin', errorBlock);
    }
  };
})();
