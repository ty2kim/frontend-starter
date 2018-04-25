var $ = require('jquery');
var home = require('./home.js');

$(document).ready(function () {
	console.log('main.js loaded');
	home.print();
});
