# SceneVR

[![Build Status](https://travis-ci.org/scenevr/server.svg?branch=master&)](https://travis-ci.org/scenevr/server)
[![Download count](https://img.shields.io/npm/dm/scenevr.svg?style=flat)](https://npmjs.org/package/scenevr)
[![js-semistandard-style](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg?style=flat-square)](https://github.com/Flet/semistandard)

The scene server loads scene files in .html format and listens for clients on a websocket connection. Any connected client gets a streamed version of the world sent to them. You can write scripts in javascript using `<script />` tags in your scenefile to provide interactivity to connected clients. 

SceneVR uses [A-Frame](https://aframe.io/docs/) as markup for scenes:

    <a-scene>
      <a-box position="1 2 3" material="color: blue"></a-box>
    </a-scene>

Contact [bnolan@gmail.com](mailto:bnolan@gmail.com). Follow development at [@scenevr](http://twitter.com/scenevr/).

## License

MIT License.

## Screenshot

![Screenshot](https://pbs.twimg.com/media/B2tuCOKCAAA7VQ7.png:large)

