(function () {
  'use strict';

  const filePath = './cucumber-source/cucumber.json';
  let cucumberData = new Array();

  /**
   * @function iterateCucumberData
   * @description Iterate the Cucumber report per feature and then per scenario and render the results.
   */
  const iterateCucumberData = () => {
    for (const feature in cucumberData) {
      console.log(cucumberData[feature]);
    }
  };

  /**
   * @description Use jQuery to get the JSON file contents and store them to the `cucumberData` Array. When the file has loaded, the
   * `iterateCucumberData` Function executes, but if there is a problem with loading the file, then an error is shown on the page.
   */
  $.getJSON(filePath, data => {
    data.forEach(element => cucumberData.push(element));
  })
    .done(iterateCucumberData)
    .fail(() => {
      document.getElementById('table-report').innerHTML = 'Cannot load the JSON file.';
    });
})();