'use strict';
(function () {
  var advertisments = [];
  var setAdvertisments = function (data) {
    for (var i = 0; i < data.length; i++) {
      advertisments.push(data[i]);
    }
  };
  window.data = {
    setAdvertisments: setAdvertisments,
    advertisments: advertisments
  };
})();
