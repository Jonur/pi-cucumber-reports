(function () {
  'use strict';

  const filePath = './cucumber-source/cucumber.json';
  let cucumberData = new Array();

  /**
   * @function iterateCucumberFeatures
   * @description Iterate the Cucumber report per feature and then per scenario and render the results.
   */
  const iterateCucumberFeatures = () => {
    if (cucumberData.length) {
      const tableReportDOM = document.getElementById('table-report');
      let feature = {}, scenarios, scenarioOutput = '', noOfScenario = 0, featureDuration = 0,
        scenariosPassed = 0, scenariosFailed = 0, scenariosUndefined = 0, featureStatus = '', featureStatusClass = '';

      tableReportDOM.innerHTML = `<h1 class="pi-underlined">Features &amp; Details</h1>`;

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
                <th scope="col"><div class="text-center">Status</div></th>
                <th scope="col"><div class="text-center">Steps Passed</div></th>
                <th scope="col"><div class="text-center">Steps Failed</div></th>
                <th scope="col"><div class="text-center">Steps Undefined</div></th>
                <th scope="col"><div class="text-center">Duration</div></th>
              </tr>
            </thead>
            <tbody>`;

          for (const element of feature.elements) {
            const browserName = ucFirst(element.before[0].output[0].split(',')[0]),
              browserVersion = ucFirst(element.before[0].output[0].split(',')[1]),
              operatingSystem = ucFirst(element.before[0].output[0].split(',')[2]);
            let scenarioDuration = 0, statusPassed = 0, statusFailed = 0, statusUndefined = 0, totalSteps = 0,
              status = '', statusClass = '';

            // Calculate the scenario's duration and status
            for (const before of element.before) {
              scenarioDuration += before.result.duration;
              if (before.result.status === 'failed') {
                ++statusFailed;
              } else if (before.result.status !== 'passed' && before.result.status !== 'failed') {
                ++statusUndefined;
              } else {
                ++statusPassed;
              }
            }
            for (const step of element.steps) {
              scenarioDuration += step.result.duration;
              if (step.result.status === 'failed') {
                ++statusFailed;
              } else if (step.result.status !== 'passed' && step.result.status !== 'failed') {
                ++statusUndefined;
              } else {
                ++statusPassed;
              }
            }
            for (const after of element.after) {
              scenarioDuration += after.result.duration;
              if (after.result.status === 'failed') {
                ++statusFailed;
              } else if (after.result.status !== 'passed' && after.result.status !== 'failed') {
                ++statusUndefined;
              } else {
                ++statusPassed;
              }
            }

            featureDuration += scenarioDuration;

            totalSteps = element.before.length + element.steps.length + element.after.length;
            if (statusFailed) {
              status = 'Failed';
              statusClass = 'alert-danger';
            } else if (statusUndefined) {
              status = 'Undefined';
              statusClass = 'alert-warning';
            } else {
              status = 'Passed';
              statusClass = 'alert-success';
            }

            scenarioOutput += `<tr class="${statusClass}">
              <th scope="row">${++noOfScenario}</th>
              <td scope="col">${element.name}</td>
              <td scope="col">${browserName}</td>
              <td scope="col">${browserVersion}</td>
              <td scope="col">${operatingSystem}</td>
              <td scope="col"><div class="text-center">${status}</div></td>
              <td scope="col"><div class="text-center">${statusPassed} / ${totalSteps}</div></td>
              <td scope="col"><div class="text-center">${statusFailed} / ${totalSteps}</div></td>
              <td scope="col"><div class="text-center">${statusUndefined} / ${totalSteps}</div></td>
              <td scope="col"><div class="text-center">${renderDuration(scenarioDuration)}</div></td>
            </tr>`;

            if (statusFailed) {
              ++scenariosFailed;
            } else if (statusUndefined) {
              ++scenariosUndefined;
            } else {
              ++scenariosPassed;
            }
          }

          scenarioOutput += `</tbody>
            </table >`;
        } else {
          renderError(`No Scenarios found for the Feature "${feature.name}".`);
        }


        if (scenariosFailed || scenariosUndefined) {
          featureStatus = 'Failed';
          featureStatusClass = 'alert-danger';
        } else {
          featureStatus = 'Passed';
          featureStatusClass = 'alert-success';
        }

        tableReportDOM.innerHTML += `<h2 class="row push-up">
            <span class="col text-sm-left">
              ${feature.name}
              <span class="feature-status ${featureStatusClass}">${featureStatus}</span>
            </span>
            <span class="col text-sm-right">
              <span class="scenarios-status alert-success">${scenariosPassed} / ${scenarios}</span>
              <span class="scenarios-status alert-danger">${scenariosFailed} / ${scenarios}</span>
              <span class="scenarios-status alert-warning">${scenariosUndefined} / ${scenarios}</span>
              <span class="scenarios-status alert-info"><label>Duration:</label> ${renderDuration(featureDuration)}</span>
            </span>
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
   * @function renderDuration
   * @description Convert Nanoseconds to Seconds and append the 's' symbol
   * @param {Number} num
   */
  const renderDuration = (num = 0) => `${(num / 1000000000).toFixed(2)}s`;

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