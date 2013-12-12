var ChatClient = function(session) {

    var HOST = 'localhost';
    var PORT = 5000;
    var _peer;
    var _connections = {};

    function _connect() {
        _peer = new Peer(window.user.id, { host: HOST, port: PORT });
        _peer.on('open', _connectToPeers.bind(this));
        _peer.on('connection', _respondToConnectionRequest);
    }


    function _connectToPeers() {
        var self = this;
        session.getActivePeers(function(err, activePeers) {
            if (err === null) {
                _addConnectionsWith(activePeers);
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
    }

    function _addConnectionsWith(activePeers) {
        activePeers.forEach(function(activePeer) {
            _connections[activePeer] = _peer.connect(activePeer);
        });
    }

    function _send(data) {
        for (var key in _connections) {
            if (_connections.hasOwnProperty(key)) {
                _connections[key].send(data);
            }
        }
        this.onmessage(null, { author: window.user.id, body: data });
    }

    this.connect = _connect;
    this.send = _send;
};


