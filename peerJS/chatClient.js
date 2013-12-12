(function(global) {
    'use strict';

    var HOST = 'localhost';
    var PORT = 5000;

    var ChatClient = function(session) {
        this._session = session;
        this._peer = null;
        this._connections = {};
    };

    ChatClient.prototype.connect = function() {
        this._peer = new Peer(window.user.id, { host: HOST, port: PORT });
        this._peer.on('open', this._connectToPeers.bind(this));
        this._respondToConnectionRequest();
    };

    ChatClient.prototype._connectToPeers = function() {
        var self = this;
        self._session.getActivePeers(function(err, activePeers) {
            if (err === null) {
                self._addConnectionsWith(activePeers);
                if (typeof self.onconnect === 'function') {
                    self.onconnect(null, activePeers);
                }
            }
            else {
                if (typeof self.onconnect === 'function') {
                    self.onconnect(err, activePeers);
                }
            }
        });
    };

    ChatClient.prototype._addConnectionsWith = function(activePeers) {
        var self = this;
        activePeers.forEach(function(activePeer) {
            self._connections[activePeer] = self._peer.connect(activePeer);
        });
    };

    ChatClient.prototype.send = function(data) {
        for (var peer in this._connections) {
            if (this._connections.hasOwnProperty(peer)) {
                this._connections[peer].send(data);
            }
        }
        //this.onmessage(null, { author: window.user.id, body: data });
    };

    ChatClient.prototype._respondToConnectionRequest = function() {
        var self = this;
        self._peer.on('connection', function(c) {
            self._connections[c.peer] = c;
            self.onNewUserEnter(null, c.peer);
        });
    };

    ChatClient.prototype._prepareConnection = function(connection) {
        connection.on('open', function() {});
        connection.on('data', function() { this.onmessage(); });
        connection.on('close', function() { this.onUserLeaves(); });
    };

    global.ChatClient = ChatClient;
}(this));