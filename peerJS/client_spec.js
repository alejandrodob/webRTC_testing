context = describe;

describe("client", function() {

    var host = 'localhost';
    var port = 5000;


    describe("when connecting to signaling server", function() {
        var newClient = createClient(host, port);
        xit("fails if no connection has been established yet", function() {
            expect(newClient.isConnectedToServer()).toBeFalsy();
        });

        xit("succeeds if server params are ok", function() {
            newClient.connectToServer();
            expect(newClient.isConnectedToServer()).toBeTruthy();
        });

        xit("fails if an invalid server is given", function() {
            var anotherClient = createClient('nohost', 2000);
            anotherClient.connectToServer();

            waits(1000);

            runs(function() {
                expect(anotherClient.isConnectedToServer()).toBeFalsy();
            });
        });

        xit("can disconnect from the server, if desired", function() {
            newClient.disconnect();
            expect(newClient.isConnectedToServer()).toBeFalsy();
        });
    });

    describe("when connecting actively to another peer", function() {

        xit("adds the other peer to connections list", function() {
            var active = createClient(host, port, '1');
            var passive = createClient(host, port, '2');
            active.connectToServer();
            active.connectToClient('2');

            expect(active.connections()['2']).toBeTruthy();

            active.disconnect();
        });

        xit("adds the other peer to connections list - triangulation", function() {
            var active = createClient(host, port, '1');
            var passive1 = createClient(host, port, '2');
            var passive2 = createClient(host, port, '2');
            active.connectToServer();
            active.connectToClient('2');
            active.connectToClient('3');

            expect(active.connections()['2']).toBeTruthy();
            expect(active.connections()['3']).toBeTruthy();
            expect(active.connections()['doesnotexist']).toBeFalsy();

            active.disconnect();
        });
    });

    describe("when receiving a connection request from another client", function() {

        xit("adds the other peer to connections list", function() {
            var active = createClient(host, port, '4');
            var passive = createClient(host, port, '5');
            passive.connectToServer();
            active.connectToServer();
            active.connectToClient('5');

            waits(1000);

            runs(function() {
                expect(passive.connections()['4']).toBeTruthy();
            });

            passive.disconnect();
            active.disconnect();
        });

        xit("adds the other peer to connections list - triangulation", function() {
            var active1 = createClient(host, port, '4');
            var active2 = createClient(host, port, '5');
            var passive = createClient(host, port, '6');

            passive.connectToServer();
            active1.connectToServer();
            active2.connectToServer();
            active1.connectToClient('6');
            active2.connectToClient('6');

            waits(3000);

            runs(function() {
                expect(passive.connections()['4']).toBeTruthy();
                expect(passive.connections()['5']).toBeTruthy();
            });

            passive.disconnect();
            active1.disconnect();
            active2.disconnect();
        });
    });

    describe("when in connection with other clients", function() {

        xit("can send data to one of them", function() {
            var client1 = createClient(host, port, 'c1');
            client1.connectToServer();
            var client2 = createClient(host, port, 'c2');
            client2.connectToServer();
            client1.connectToClient('c2');
            client1.send('c2', "hola");
            waits(3000);
            expect(client2.lastData()).toEqual("hola");
        });
    });

});

