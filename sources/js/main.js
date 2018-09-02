(function () {
  'use strict';

  const tableReportDOM = document.querySelector('#table-report'),
    statisticsDOM = document.querySelector('#statistics');
  let cucumberData = new Array();

  /**
   * @function iterateCucumberFeatures
   * @description Iterate the Cucumber report per feature and then per scenario and render the results.
   */
  const iterateCucumberFeatures = () => {
    if (cucumberData.length) {
      let feature = {}, scenarios, featuresPassed = 0, featuresFailed = 0, totalScenariosPassed = 0, totalScenariosFailed = 0,
        totalScenariosUndefined = 0;

      tableReportDOM.innerHTML = '';

      for (const feat in cucumberData) {
        let featureDuration = 0, scenarioOutput = '', noOfScenario = 0, scenariosPassed = 0, scenariosFailed = 0, scenariosUndefined = 0,
          featureStatus = '', featureStatusClass = '';
        feature = cucumberData[feat];
        scenarios = feature.elements.length;

        if (scenarios) {
          statisticsDOM.classList.remove('d-none');

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
            const currentBefore = element.before[0],
              browserName = currentBefore.output[0],
              browserVersion = currentBefore.output[1],
              operatingSystem = currentBefore.output[2];
            let scenarioDuration = 0, statusPassed = 0, statusFailed = 0, statusUndefined = 0, status = '', statusClass = '';

            // Calculate the scenario's duration and status
            const phases = [...element.before, ...element.steps, ...element.after];
            for (const phase of phases) {
              scenarioDuration += phase.result.duration;
              if (phase.result.status === 'failed') {
                ++statusFailed;
              } else if (phase.result.status !== 'passed' && phase.result.status !== 'failed') {
                ++statusUndefined;
              } else {
                ++statusPassed;
              }
            }

            featureDuration += scenarioDuration;

            if (statusFailed) {
              status = 'Failed';
              statusClass = 'alert-danger';
              ++scenariosFailed;
              ++totalScenariosFailed;
            } else if (statusUndefined) {
              status = 'Undefined';
              statusClass = 'alert-warning';
              ++scenariosUndefined;
              ++totalScenariosUndefined;
            } else {
              status = 'Passed';
              statusClass = 'alert-success';
              ++scenariosPassed;
              ++totalScenariosPassed;
            }

            scenarioOutput += `<tr class="${statusClass}">
              <th scope="row">${++noOfScenario}</th>
              <td scope="col">${element.name}</td>
              <td scope="col"><span class="text-capitalize">${browserName}</span></td>
              <td scope="col">${browserVersion}</td>
              <td scope="col"><span class="text-capitalize">${operatingSystem}</span></td>
              <td scope="col"><div class="text-center">${status}</div></td>
              <td scope="col"><div class="text-center">${statusPassed} / ${phases.length}</div></td>
              <td scope="col"><div class="text-center">${statusFailed} / ${phases.length}</div></td>
              <td scope="col"><div class="text-center">${statusUndefined} / ${phases.length}</div></td>
              <td scope="col"><div class="text-center">${renderDuration(scenarioDuration)}</div></td>
            </tr>`;
          }

          scenarioOutput += `</tbody>
            </table >`;
        } else {
          renderError(`No Scenarios found for the Feature <strong>"${feature.name}"</strong>. The JSON file is possibly corrupted.`);
          return true;
        }

        featureStatus = scenariosFailed || scenariosUndefined ? 'Failed' : 'Passed';
        featureStatusClass = scenariosFailed || scenariosUndefined ? 'alert-danger' : 'alert-success';
        if (!scenariosFailed && !scenariosUndefined) {
          ++featuresPassed;
        } else {
          ++featuresFailed;
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

      generateFeaturePieChart(featuresPassed, featuresFailed);
      generateScenarioPieChart(totalScenariosPassed, totalScenariosFailed, totalScenariosUndefined);
    } else {
      renderError('No Features found.');
      return true;
    }
  };

  /**
   * @function generateFeaturePieChart
   * @description Creates the percentages for the features and adds the conic-gradient property to the element to create the pie chart.
   * Conic Grandients documentation: https://leaverou.github.io/conic-gradient
   * @param {Number} featuresPassed
   * @param {Number} featuresFailed
   */
  const generateFeaturePieChart = (featuresPassed = 0, featuresFailed = 0) => {
    const chart = document.getElementById('feature-pie-chart'),
      total = featuresPassed + featuresFailed,
      featuresPassedPercentage = Math.round(featuresPassed / total * 100),
      featuresFailedPercentage = 100 - featuresPassedPercentage;

    const gradient = new ConicGradient({
      stops: `${statsColorGreen} ${featuresPassedPercentage}%, ${statsColorRed} 0`
    });
    chart.style.background = `url(${gradient.dataURL})`;

    document.getElementById('features-passed').innerHTML = `${featuresPassedPercentage}%`;
    document.getElementById('features-failed').innerHTML = `${featuresFailedPercentage}%`;
  };

  /**
   * @function generateScenarioPieChart
   * @description Creates the percentages for the scenarios and adds the conic-gradient property to the element to create the pie chart.
   * Conic Grandients documentation: https://leaverou.github.io/conic-gradient
   * @param {Number} totalScenariosPassed
   * @param {Number} totalScenariosFailed
   * @param {Number} totalScenariosUndefined
   */
  const generateScenarioPieChart = (totalScenariosPassed = 0, totalScenariosFailed = 0, totalScenariosUndefined = 0) => {
    const chart = document.getElementById('scenarios-pie-chart'),
      total = totalScenariosPassed + totalScenariosFailed + totalScenariosUndefined,
      totalScenariosPassedPercentage = Math.round(totalScenariosPassed / total * 100),
      totalScenariosFailedPercentage = Math.round(totalScenariosFailed / total * 100),
      totalScenariosUndefinedPercentage = 100 - totalScenariosPassedPercentage - totalScenariosFailedPercentage;

    const gradient = new ConicGradient({
      stops: `${statsColorGreen} ${totalScenariosPassedPercentage}%,
        ${statsColorRed} 0 ${totalScenariosPassedPercentage + totalScenariosFailedPercentage}%,
        ${statsColorYellow} 0`
    });
    chart.style.background = `url(${gradient.dataURL})`;

    document.getElementById('scenarios-passed').innerHTML = `${totalScenariosPassedPercentage}%`;
    document.getElementById('scenarios-failed').innerHTML = `${totalScenariosFailedPercentage}%`;
    document.getElementById('scenarios-undefined').innerHTML = `${totalScenariosUndefinedPercentage}%`;
  };

  /**
   * @function renderError
   * @description Renders the given error to the page
   * @param {String} str
   */
  const renderError = (str = '') => {
    tableReportDOM.innerHTML = `<div class="alert alert-danger" role="alert">${str}</div>`;
    statisticsDOM.classList.add('d-none');
  };

  /**
   * @function renderDuration
   * @description Convert Nanoseconds to Seconds and append the 's' symbol
   * @param {Number} num
   */
  const renderDuration = (num = 0) => `${(num / 1000000000).toFixed(2)}s`;

  /**
   * @description Get the JSON file contents and store them to the `cucumberData` Array. When the file has loaded, the
   * `iterateCucumberFeatures` Function executes, but if there is a problem with loading the file, then an error is shown on the page.
   * Every 30 seconds it switches between the two files set in `config.js`.
   */
  const d = new Date();
  let filePath = '';
  if (d.getSeconds() <= 29) {
    filePath = filePaths[0];
  } else {
    filePath = filePaths[1];
  }

  fetch(filePath)
    .then(res => res.json())
    .then(res => {
      res.forEach(element => cucumberData.push(element));
      iterateCucumberFeatures();
    })
    .catch(renderError('Oops! The JSON file cannot be loaded.'));
})();