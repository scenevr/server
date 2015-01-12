---
title: Getting Started
primary_navigation: false
position: 2
---

# Home

The scene server is a node.js app and requires npm to install dependencies. You'll need to install [node](//nodejs.org) and [npm](//npmjs.org) to get started. Scene server has been tested on Windows and OS X.

# Getting Started 

## Installing

    npm install -g scenevr

This will take a little while while the npm dependencies are downloaded. The `scenevr` executable will then be installed globally.

## Download sample scenes

Download the sample scenes.

    git clone git://github.com/bnolan/scenevr

Start the server:

    scenevr ./scenes/

## Launch the webclient

Open the webclient and load the files served from your localhost:

### &raquo; Open [client.scenevr.com](http://client.scenevr.com/?connect=localhost:8080/index.xml) for local files

