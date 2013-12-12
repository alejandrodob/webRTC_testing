context = describe;

describe("ChatClient instances", function() {


    function MockConnection(id) {
        this.peer = id;
        this.receivedData = null;
        this.send = function(data) {
            this.receivedData = data;
        };
    }

    var mockSession = {
        _activePeers: ['A', 'B', 'C'],
    };

    var MockPeer = function() {
        this.on = function(eventType, callback) {
            if (this._events.hasOwnProperty(eventType))
                return this._events[eventType](callback);
        };
        this.connect = function(peer) { };
    };
    MockPeer.prototype._events = {
        'open': function(callback) {setTimeout(callback, 0);},
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

        it('calls onNewUserEnter() if a new user enters the chat succesfully', function() {
            var client, done = false;
            var err, newUser;
            mockSession.getActivePeers = function(cb) {
                setTimeout(cb.bind(null, 'error', []), 0);
            };
            MockPeer.prototype._events['connection'] = function(callback) {
                setTimeout(callback, 0, new MockConnection('john doe'));
            };


            runs(function() {
                client = new ChatClient(mockSession);
                client.onconnect = function() { done = true; };
                client.connect();
                client.onNewUserEnter = function(_err, _newUser) {
                    console.log("me llamaron soy onNewUser");
                    err = _err;
                    newUser = _newUser;
                };
            });

            waitsFor(function() { return done; }, 100, 'onconnect to be called eventually.');

            runs(function() {
                expect(err).toBe(null);
                expect(newUser).toEqual('john doe');
            });
        });

        it('calls onUserLeave() if a connections with any user is closed', function() {

        });

        it('calls onmessage() if any message is received', function() {

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

        it('send the same data to all peers', function() {
            var client;
            var message = 'hola a todos';
            var connections = {
                'A': new MockConnection('A'),
                'B': new MockConnection('B')
            };

            client = new ChatClient();
            client._connections = connections;
            client.send(message);

            expect(client._connections['A'].receivedData).toBe(message);
            expect(client._connections['B'].receivedData).toBe(message);
        });

        xit('calls the method onmessage() with client id and message as parameters on success', function() {
            var client, done = false;
            var err, message, author;
            mockSession.getActivePeers = function(cb) {
                setTimeout(cb.bind(null, null, ['A']), 0);
            };

            runs(function() {
                client = new ChatClient(mockSession);
                client.onconnect = function() {};
                client.connect();
                client.onmessage = function(_err, _message) {
                    err = _err;
                    author = _message.author;
                    message = _message.body;
                    done = true
                };
                client.send('hola a todos');
            });

            waitsFor(function() { return done; }, 100, 'onmessage to be called eventually.');

            runs(function() {
                expect(err).toBe(null);
                expect(author).toEqual(window.user.id);
                expect(message).toEqual('hola a todos');
            });
        });
    });

});

