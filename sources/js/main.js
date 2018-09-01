(function () {
  'use strict';

  const filePath = './cucumber-source/cucumber.json'
  let cucumberData = new Array();

  /**
   * @function iterateCucumberFeatures
   * @description Iterate the Cucumber report per feature and then per scenario and render the results.
   */
  const iterateCucumberFeatures = () => {
    const tableReportDOM = document.getElementById('table-report');
    let feature = {}, scenarios, scenarioOutput = '', noOfScenario = 0, browserName = '', browserVersion = '', operatingSystem = '';

    if (cucumberData.length) {
      tableReportDOM.innerHTML = `<h1>Features</h1>`;

      for (const feat in cucumberData) {
        feature = cucumberData[feat];
        scenarios = feature.elements.length;

        if (scenarios) {
          scenarioOutput = `<table class="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Scenario</th>
                <th scope="col">Browser</th>
                <th scope="col">Version</th>
                <th scope="col">Platform</th>
                <th scope="col">Status</th>
                <th scope="col">Steps Passed</th>
                <th scope="col">Steps Failed</th>
                <th scope="col">Steps Undefined</th>
                <th scope="col">Duration</th>
              </tr>
            </thead>
            <tbody>`;
          for (const element of feature.elements) {
            let scenarioDuration = 0, durationDisplay = 0;
            console.log(element);
            browserName = ucFirst(element.before[0].output[0].split(',')[0]);
            browserVersion = ucFirst(element.before[0].output[0].split(',')[1]);
            operatingSystem = ucFirst(element.before[0].output[0].split(',')[2]);

            // Calculate
            for (const before of element.before) {
              scenarioDuration += before.result.duration;
            }
            for (const step of element.steps) {
              scenarioDuration += step.result.duration;
            }
            for (const after of element.after) {
              scenarioDuration += after.result.duration;
            }

            // Convert Nanoseconds to Seconds and append the 's' symbol
            durationDisplay = `${(scenarioDuration / 1000000000).toFixed(2)}s`;
            console.log((scenarioDuration / 1000000000).toFixed(2));

            scenarioOutput += `<tr>
              <th scope="row">${++noOfScenario}</th>
              <td scope="col">${element.name}</td>
              <td scope="col">${browserName}</td>
              <td scope="col">${browserVersion}</td>
              <td scope="col">${operatingSystem}</td>
              <td scope="col">Status</td>
              <td scope="col">Steps Passed</td>
              <td scope="col">Steps Failed</td>
              <td scope="col">Steps Undefined</td>
              <td scope="col">${durationDisplay}</td>
            </tr>`;
          }
          scenarioOutput += `</tbody>
            </table >`;
        } else {
          renderError(`No Scenarios found for the Feature "${feature.name}".`);
        }

        tableReportDOM.innerHTML += `<h2>${feature.name}
          <span class="feature-status">Passed</span>
          <span class="scenarios-passed">2/${scenarios}</span>
          <span class="scenarios-failed">0/${scenarios}</span>
          <span class="scenarios-undefined">0/${scenarios}</span>
          <span class="feature-duration">Duration: 43.75s</span>
        </h2>
        ${scenarioOutput}`;
      }
    } else {
      renderError('No Features found.');
    }
  };

  /**
   * @function ucFirst
   * @description Converts a String to lower case and capitalises its first character
   * @param {String} str
   */
  const ucFirst = (str = '') => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  /**
   * @function renderError
   * @description Renders the given error to the page
   * @param {String} str
   */
  const renderError = (str = '') => {
    document.getElementById('table-report').innerHTML += `<div class="alert alert-danger" role="alert">${str}</div>`;
  };

  /**
   * @description Use jQuery to get the JSON file contents and store them to the `cucumberData` Array. When the file has loaded, the
   * `iterateCucumberFeatures` Function executes, but if there is a problem with loading the file, then an error is shown on the page.
   */
  $.getJSON(filePath, data => {
    data.forEach(element => cucumberData.push(element));
  })
    .done(iterateCucumberFeatures)
    .fail(renderError('Cannot load the JSON file.'));
})();