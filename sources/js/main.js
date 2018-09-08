(function () {
  'use strict';

  const tableReportDOM = document.getElementById('table-report'),
    statisticsDOM = document.getElementById('statistics');
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
                <th scope="col" class="fixed-tablecell-width">Scenario</th>
                <th scope="col">Browser</th>
                <th scope="col">Version</th>
                <th scope="col">Platform</th>
                <th scope="col">Resolution</th>
                <th scope="col"><div class="text-center">Status</div></th>
                <th scope="col"><div class="text-center">Steps Passed</div></th>
                <th scope="col"><div class="text-center">Steps Failed</div></th>
                <th scope="col"><div class="text-center">Steps Undefined</div></th>
                <th scope="col"><div class="text-center">Duration</div></th>
              </tr>
            </thead>
            <tbody>`;

          for (const element of feature.elements) {
            const currentBefore = element.before[element.before.length - 1],
              browserName = currentBefore.output[0] || '',
              browserVersion = currentBefore.output[1] || '',
              operatingSystem = currentBefore.output[2] || '',
              browserResolution = currentBefore.output[3] || '';
            let scenarioDuration = 0, statusPassed = 0, statusFailed = 0, statusUndefined = 0, status = '', statusClass = '';

            // Calculate the scenario's duration and status
            const phases = [...element.before, ...element.steps, ...element.after];
            for (const phase of phases) {
              scenarioDuration += !!phase.result.duration ? phase.result.duration : 0;
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
              <th scope="row"">${++noOfScenario}</th>
              <td class="fixed-tablecell-width">${element.name}</td>
              <td><span class="text-capitalize">${browserName}</span></td>
              <td>${browserVersion}</td>
              <td><span class="text-capitalize">${operatingSystem.toLowerCase()}</span></td>
              <td>${browserResolution}</td>
              <td><div class="text-center">${status}</div></td>
              <td><div class="text-center">${statusPassed} / ${phases.length}</div></td>
              <td><div class="text-center">${statusFailed} / ${phases.length}</div></td>
              <td><div class="text-center">${statusUndefined} / ${phases.length}</div></td>
              <td><div class="text-center">${renderDuration(scenarioDuration)}</div></td>
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

        tableReportDOM.innerHTML += `<h2 class="row push-up expanded" onclick="toggleScenarios(this)">
            <span class="col text-sm-left">
              ${feature.name}
              <span class="feature-status ${featureStatusClass}">${featureStatus}</span>
            </span>
            <span class="col text-sm-right pr-0">
              <span class="scenarios-status alert-success">${scenariosPassed} / ${scenarios}</span>
              <span class="scenarios-status alert-danger">${scenariosFailed} / ${scenarios}</span>
              <span class="scenarios-status alert-warning">${scenariosUndefined} / ${scenarios}</span>
              <span class="scenarios-status alert-info"><label>Duration:</label> ${renderFeatureDuration(featureDuration)}</span>
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
   * @function renderFeatureDuration
   * @description Convert Nanoseconds to Seconds and return a string with the Feature's duration in minutes and seconds
   * @param {Number} num
   * @returns {String}
   */
  const renderFeatureDuration = (num = 0) => {
    const secondsRun = Math.round((num / 1000000000).toFixed(2));
    return `${Math.floor(secondsRun / 60)} mins ${secondsRun % 60}s`;
  };

  /**
   * @function renderDuration
   * @description Convert Nanoseconds to Seconds and append the 's' symbol
   * @param {Number} num
   */
  const renderDuration = (num = 0) => `${(num / 1000000000).toFixed(2)}s`;

  /**
   * @function toggleScenarios
   * @description Toggles an element's next table sibling
   * @param {Object} element
   */
  window.toggleScenarios = element => {
    const next = element.nextElementSibling;
    if (element.classList.value.includes('expanded')) {
      element.classList.add('collapsed');
      element.classList.remove('expanded');
      if (next.tagName === 'TABLE') {
        next.classList.add('d-none');
        next.classList.remove('d-table');
      }
    } else if (element.classList.value.includes('collapsed')) {
      element.classList.add('expanded');
      element.classList.remove('collapsed');
      if (next.tagName === 'TABLE') {
        next.classList.add('d-table');
        next.classList.remove('d-none');
      }
    }
  };

  /**
   * @function generateProjectNavigation
   * @description Create the project navigation links on each side of the header
   * @param {Number} page
   */
  const generateProjectNavigation = (page = 0) => {
    if (!filePaths[page - 1]) {
      document.getElementById('prev').href = `?page=${filePaths.length - 1}`;
    } else {
      document.getElementById('prev').href = `?page=${page - 1}`;
    }
    if (!filePaths[page + 1]) {
      document.getElementById('next').href = `?page=0`;
    } else {
      document.getElementById('next').href = `?page=${page + 1}`;
    }
  };

  /**
   * @function prepareNext
   * @description Create the link of the next page and navigate to the next page after the configured time (config.js)
   * @param {Number} page
   */
  const prepareNext = (page = 0) => {
    const nextPage = filePaths[page + 1] ? `?page=${page + 1}` : `?page=0`;
    if (pageInterval) {
      setTimeout(() => {
        window.location.href = nextPage;
      }, pageInterval * 1000);
    }
  };

  /**
   * @description Get the JSON file contents and store them to the `cucumberData` Array. When the file has loaded, the
   * `iterateCucumberFeatures` Function executes, but if there is a problem with loading the file, then an error is shown on the page.
   */
  const url = new URL(window.location.href),
    page = url.searchParams.get('page') || 0,
    cacheBustingHash = [...Array(10)].map(() => Math.random().toString(36)[3]).join('');
  let filePath = '';

  filePath = `${(!!page && filePaths[page]) ? filePaths[page] : filePaths[0]}?v=${cacheBustingHash}`;
  generateProjectNavigation(parseInt(page));

  fetch(filePath)
    .then(res => res.json())
    .then(res => {
      res.features.forEach(element => cucumberData.push(element));
      iterateCucumberFeatures();
      document.getElementById('project').innerHTML = !!res.project ? ` for ${res.project}` : '';
      document.getElementById('runtime').innerHTML = !!res.runTime ? `Last run: ${res.runTime}` : '';
      document.getElementById('environment').innerHTML = !!res.environment ? ` - ${res.environment.toLowerCase()}` : '';
      prepareNext(parseInt(page));
    })
    .catch(renderError('Oops! The JSON file cannot be loaded.'));
})();
