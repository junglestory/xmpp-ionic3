# xmpp-ionic3
This is a XMPP chat Client build using [Strophe.js](http://strophe.im/strophejs/) and [Ionic3](https://ionicframework.com/getting-started/). This is an implementation to Multi-user chat.

## Features
* Creating a room
* Discovering occupied rooms
* Joining a room
* Sending and receiving messages
* Invite to chat rooms

## Requirements
* [Node.js](https://nodejs.org/en/download/)
* [Openfire 4.2.0](https://www.igniterealtime.org/downloads/) or higher

## Soruce code clone
git clone https://github.com/junglestory/xmpp-ionic3.git
<pre><code>
$ cd xmpp-ionic3
</code></pre>

## Installation
<pre><code>
$ npm update
$ npm install -g cordova ionic
</code></pre>

## Configuration
* /app/xmpp.service.ts

<pre><code>
private BOSH_SERVICE: string = "http://localhost:7070/http-bind/";  // Your bosh service
private CONFERENCE_SERVICE: string = "conference.localhost";        // Your conference service
</code></pre>

## Development server
<pre><code>
$ ionic serve
</code></pre>

Run `ionic serve` for a dev server. Navigate to `http://localhost:8100/`. 
The app will automatically reload if you change any of the source files.

## References
* https://github.com/arjunsk/Ionic-Chat-App

## License
This software is released under the MIT license.
