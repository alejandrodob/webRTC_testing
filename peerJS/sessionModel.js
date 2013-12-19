var sessionModel = function() {
    var self = {};

    self.getActivePeers = function(callback) {
        var activePeers = [];
        var error = null;
        $.ajax({
            url: document.URL + '/active_users.json',
            type: 'GET',
            dataType: 'json'
        })
        .error(function() {
            error = 'Could not retrieve active peers from server';
            callback(error, activePeers);
        })
        .done(function(data) {
            activePeers = data['active_users'];
            callback(error, activePeers);
        });
    };

    self.getOwnId = function() {
        return $('#user_id').text();
    };

    return self;
}