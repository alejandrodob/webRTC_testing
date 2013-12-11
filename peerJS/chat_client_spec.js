context = describe;

describe("ChatClient instances", function() {


    var mockConnection = { send: function(data) { return data; } };

    var mockSession = {
        _activePeers: ['A', 'B', 'C'],
    };

    var MockPeer = function() {
        var _callback;
        this.on = function(eventType, callback) {
            if (eventType === 'data') {

            }
            _callback = callback;
            setTimeout(callback, 0);
        };
        this.connect = function(peer) {
            return mockConnection;
        };
    };


    describe('connect() method', function() {
        var realUser = window.user;
        var realPeer = window.Peer;

        beforeEach(function() {
            window.user = { id: 'yo' };
            window.Peer = MockPeer;
        });

        afterEach(function() {
            window.user = realUser;
            window.Peer = realPeer;
        });

        it('calls onconnect() with null and the list of active peers on success', function() {
            var client, done = false;
            var err, activePeers;
            mockSession.getActivePeers = function(cb) {
                setTimeout(cb.bind(null, null, this._activePeers), 0);
            };

            runs(function() {
                client = new ChatClient(mockSession);
                client.onconnect = function (_err, _activePeers) {
                    err = _err;
                    activePeers = _activePeers;
                    done = true;
                };
                client.connect();
            });

            waitsFor(function() { return done; }, 100, 'onconnect to be called eventually.');

            runs(function() {
                expect(err).toBe(null);
                expect(activePeers).toEqual(mockSession._activePeers);
            });
        });

        it('calls onconnect() with error and empty list of peers if retrieving active peers fails', function() {
            var client, done = false;
            var err, activePeers;
            mockSession.getActivePeers = function(cb) {
                setTimeout(cb.bind(null, 'error', []), 0);
            };

            runs(function() {
                client = new ChatClient(mockSession);
                client.onconnect = function (_err, _activePeers) {
                    err = _err;
                    activePeers = _activePeers;
                    done = true;
                };
                client.connect();
            });

            waitsFor(function() { return done; }, 100, 'onconnect to be called eventually.');

            runs(function() {
                expect(err).not.toBe(null);
                expect(activePeers).toEqual([]);
            });
        });
    });

    describe('onconnect()', function() {

        it('', function() {
            client = new ChatClient(mockSession);
        });
    });

    describe('send()', function() {
        var realUser = window.user;
        var realPeer = window.Peer;

        beforeEach(function() {
            window.user = { id: 'yo' };
            window.Peer = MockPeer;
        });

        afterEach(function() {
            window.user = realUser;
            window.Peer = realPeer;
        });

        it('calls the method send() of each of its current connections with message as parameter', function() {
            var client, done = false;
            var message;
            mockSession.getActivePeers = function(cb) {
                setTimeout(cb.bind(null, null, ['A']), 0);
            };
            spyOn(mockConnection, 'send');

            runs(function() {
                client = new ChatClient(mockSession);
                client.onconnect = function() { done = true };
                client.connect();
            });

            waitsFor(function() { return done; }, 100, 'onconnect to be called eventually.');

            runs(function() {
                client.send('hola a todos');
                expect(mockConnection.send).toHaveBeenCalledWith('hola a todos');
            });

        });
    });

});

