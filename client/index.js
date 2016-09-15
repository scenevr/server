require('aframe');
require('aframe-interpolate-component');

const Client = require('./client');

var client = window.client = new Client();
client.start();
