# SceneVR

[![Build Status](https://travis-ci.org/bnolan/scene-server.svg?branch=master)](https://travis-ci.org/bnolan/scene-server)

The scene server loads scene files in .xml format and listens for clients on a websocket connection. Any connected client gets a streamed version of the world sent to them. You can write scripts in javascript using <script /> tags in your scenefile to provide interactivity to connected clients.

Contact [bnolan@gmail.com](mailto:bnolan@gmail.com).

---

## Installation

Prerequisites: make sure you have the latest version of Node and NPM installed.

OS: Verified running on Windows 8 and Mac OS X.

### Running the scenevr server
1. Clone this repo: https://github.com/bnolan/scenevr.git
1. `cd scenevr`
1. `npm install`
1. `npm install -g coffee`
1. `coffee server.coffee scenes/hello.xml` 

Note: *you can replace hello.xml with any of the demo files*

### Running the scenevr-web client
In a new console window, and in a new directory:

1. Clone the scenevr-web repo: https://github.com/bnolan/scenevr-web.git
1. `cd scenevr-web`
1. `npm install`
1. `npm start`

You should now be able to open `localhost:9000` in your browser to see `scenes/hello.xml`.
