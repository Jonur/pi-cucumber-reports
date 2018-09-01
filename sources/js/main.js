(function () {
  'use strict';

  const filePath = 'cucumber-source/cucumber.json';

  $.getJSON(filePath, function (data) {
    console.log(data);
  });

})();