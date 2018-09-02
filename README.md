# PI Cucumber Reports

This project creates a visual representation of the Test Automation Overview Report from [Cucumber](https://cucumber.io/).

## How does it work?

It reads the file paths of two Cucumber JSON results files, then it generates two pie chart diagrams - one for the total Features found and one for the total Scenarios found of all Features, and finally creates a table view of detailed results of each Feature's Scenarios.

Automatically, the page refreshes every 30 seconds and each time it switches the file it fetches the results from.

The results will be updated seemlessly as the JSON files are themselves updated, since the updated files will be fetched at the next page refresh.

## Installation

The project is plug and play, but it does require a server to run on, as it uses an [XMLHTTPRequest](https://api.jquery.com/jquery.getjson/) to fetch the JSON files.

For development use, running `npm install` would be sufficient.

## Configuration

The file `sources/config.js` should contain the file paths of the two Cucumber JSON results files, as well as the pie chart colours.

The page refreshes every 30 seconds and depending on the second of the current time, the set file is used: 0-29 seconds for the first and 30 to 59 seconds the seconds one. The pie chart colours are used for the actual Pie Diagrams. The `sources/css/main.scss` file contains these colours, as well, as they are needed for styling the labels on the right of the pie charts. Ideally, should the colours need changing, it should happen on both these and the SCSS file.

## CSS conic-gradient() polyfill

The `conic-gradient` is a CSS polyfill by [Lea Verou](http://lea.verou.me/) used to create light-weight pie charts without needing special tools. Instead, they can be generated either by CSS, or Javascript. Visit [this page](https://leaverou.github.io/conic-gradient) for its documentation.