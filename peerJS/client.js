var ChatClient = function(session) {

    var HOST = 'localhost';
    var PORT = 5000;

    var _peer = null;
    var _connections = {};
    var _lastDataReceived;

    var _connectToServer = function() {
        _peer = new Peer(id, {host: host, port: port, debug: 3});
        _peer.on('open', _notifyConnection);
        _listenToPeers();
    };

    var _notifyConnection = function() {
        console.log("connected to server " + host);
    };

    var _connectToClient = function(otherClientId) {
        _connections[otherClientId] = _peer.connect(otherClientId);
    };

    var _listenToPeers = function() {
        _peer.on('connection', function(c) {
            c.on('open', _addConnection.bind(null, c));
            c.on('data', _handleData);
        });
    };

    var _addConnection = function(conn) {
        _connections[conn.peer] = conn;
    };

    var _closeConnection = function(otherClient) {
        if(_connections[otherClient]) {
            _connections[otherClient].close();
            delete _connections[otherClient];
        }
    };

    var _sendData = function(receiver, data) {
        if (_connections[receiver]) {
            _connections[receiver].send(data);
        };
    };

    var _handleData = function(data) {
        _lastDataReceived = data;
        console.log('received data!!!');
    };

    var _serverConnection = function() {
        return _peer ? !_peer.disconnected : false;
    };

    var _getConnections = function() {
        return _connections;
    };

    var _disconnect = function() {
        _peer.destroy();
        _peer = null;
    }

    var _retrieveLastData = function() {
        return _lastDataReceived;
    };

    return {
        connectToServer      : _connectToServer,
        connectToClient      : _connectToClient,
        listenToClients      : _listenToPeers,
        isConnectedToServer  : _serverConnection,
        connections          : _getConnections,
        disconnect           : _disconnect,
        lastData             : _retrieveLastData,
        send                 : _sendData,
        closeConnection      : _closeConnection
    };
};




