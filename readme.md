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
1. `npm install -g coffee-script`
1. `coffee server.coffee scenes/hello.xml` 

Note: *you can replace hello.xml with any of the demo files*

### Running the scenevr-web client
In a new console window, and in a new directory:

1. Clone the scenevr-web repo: https://github.com/bnolan/scenevr-web.git
1. `cd scenevr-web`
1. `npm install`
1. `npm start`

You should now be able to open `localhost:9000` in your browser to see `scenes/hello.xml`.

---

## Credits

Credits:
========

### Knight, SUV and Beardie models

@mikelovesrobots
https://github.com/mikelovesrobots/mmmm

### Baking demo and cubes models

@bnolan

### Gallery

[Modified use](http://forums.sketchup.com/t/contact-license-problem/2082/10) off a sketchup warehouse model by Jeff Park.
https://3dwarehouse.sketchup.com/model.html?id=f1feb84e82b7f43479b47ca83eb27537

### Clouds skybox

"free skyboxes"
http://www.redsorceress.com/skybox.html

### Miramar Skybox

By Jockum Skoglund aka hipshot
hipshot@zfight.com
www.zfight.com
Stockholm, 2005 08 25

"Modify however you like, just cred me for my work, maybe link to my page."

### Skyrender and dark skyboxes

by Roel Reijerse
http://reije081.home.xs4all.nl/skyboxes/

"This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License. If that license does not fit to your purposes, please contact me. And if you create something beautiful with them that you would like to share, I'll be glad to receive a message :)"

---

## License

Copyright (c) 2014, Ben Nolan
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
