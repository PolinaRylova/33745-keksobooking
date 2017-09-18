'use strict';
(function () {
  var ENTER_KEY = 13;
  var ESC_KEY = 27;
  window.keyboard = {
    isEnterPressed: function (e) {
      return e.keyCode === ENTER_KEY;
    },
    isEscPressed: function (e) {
      return e.keyCode === ESC_KEY;
    }
  };
})();
