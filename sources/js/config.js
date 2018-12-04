'use strict';

/**
 * @desc JSON files for the application to fetch the Cucumber test results from. The page refreshes every 30 seconds and depending on the
 * second of the current time, the set file is used: 0-29 seconds for the first and 30 to 59 seconds the seconds one.
 */
const filePaths = [
  './cucumber-source/PI/cucumber.json',
  './cucumber-source/BB/cucumber.json'
];

/**
 * @desc The time interval (in seconds) to switch between projects. After the set time, the next JSON file will be rendered. Set it to 0
 * to stop the auto-navigation/auto-refresh.
 */
const pageInterval = 30;

/**
 * @desc Pie Chart Color palette optimized for data visualization from
 * http://www.mulinblog.com/a-color-palette-optimized-for-data-visualization/
 * The following are used for the actual Pie Diagrams. The `main.scss` file contains these colours, as well, as they are needed for
 * styling the labels on the right of the pie charts. Ideally, should the colours need changing, it should happen on both these and the
 * SCSS file.
 *
 */
const statsColorGreen = '#60BD68',
  statsColorRed = '#F15854',
  statsColorYellow = '#B2912F';
