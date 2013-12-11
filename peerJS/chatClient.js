var ChatClient = function(session) {

    var HOST = 'localhost';
    var PORT = 5000;
    var _peer;
    var _connections = {};

    function _connect() {
        _peer = new Peer(window.user.id, { host: HOST, port: PORT });
        _peer.on('open', _connectToPeers.bind(this));
    }

    function _connectToPeers() {
        var self = this;
        session.getActivePeers(function(err, activePeers) {
            activePeers.forEach(function(activePeer) {
                _connections[activePeer] = _peer.connect(activePeer);
            });
            if (typeof self.onconnect === 'function') {
                self.onconnect(null, activePeers);
            }
        });
    }

    this.connect = _connect;

};




