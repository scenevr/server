---
title: Getting Started
primary_navigation: true
---

# Home

The scene server is a node.js app and requires npm to install dependencies. You'll need to install [node](//nodejs.org) and [npm](//npmjs.org) to get started. Scene server works on Windows, OS X and Linux.

# Getting Started 

## Installing

    npm install -g scenevr

This will take a little while while the npm dependencies are downloaded. The `scenevr` executable will then be installed globally.

## Download sample scenes

Download the sample scenes.

    git clone git://github.com/bnolan/sample-scenes

This will checkout the sample-scenes into a new folder. You can then launch some of these scenes.

    scene-server sample-scenes

This will launch the scene server.

## Install the web client

    git clone git://github.com/bnolan/scenevr-web/
    cd scenevr-web
    npm install
    npm start

You can then open a webbrowser to [localhost:9000](//localhost:9000) and view the scene. If you open a second browser window and re-open the same URL (or get a friend to connect to your computer), you will see two players in the scene at the same time.