---
title: Getting Started
primary_navigation: true
---

# Getting Started

The scene server is a node.js app and requires npm to install dependencies. You'll need to install [node](//nodejs.org) and [npm](//npmjs.org) to get started. Scene server will probably only work on os x and linux at the moment, but we'd appreciate pull requests to get it running on Windows.

## Installing

    npm install -g scene-server

This will take a little while while the npm dependencies are downloaded. The `scene-server` executable will then be installed globally.

## Download sample scenes

Download the sample scenes.

    git clone git://github.com/bnolan/sample-scenes

This will checkout the sample-scenes into a new folder. You can then launch some of these scenes.

    cd sample-scenes
    scene-server hello.xml

This will launch the scene server. You can then open a webbrowser to [localhost:4000](//localhost:4000) and view the scene. If you open a second browser window and re-open the same URL (or get a friend to connect to your computer), you will see two players in the scene at the same time.