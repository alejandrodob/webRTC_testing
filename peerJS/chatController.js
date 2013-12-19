function ChatController(model, view, client) {
    this._model = model;
    this._view = view;
    this._client = client;

    var self = this;

    //subscribe to view events
    this._view.sendButtonClicked.subscribe(function() {
        self.addMessage(true);
        self._view.clearTextInput();
    });

    //define client callbacks
    this._client.onconnect = function(err, activePeers) {
        if (!err && activePeers.length > 0) {
            console.log(self._model)
            self.addUsers(activePeers);
        }
    };
    this._client.onmessage = function(message) {
        self.addMessage(false, message);
    };
    this._client.onUserEnter = function(err, userId) {
        self.addUsers([userId]);
    };
    this._client.onUserLeaving = function(userId) {
        self.removeUser(userId);
    };

}

ChatController.prototype = {
    //needs refactoring
    addMessage : function(own, message) {
        var text = this._view._elements.message.val()
        var _message = own ? this.wrapMessage(text) : message;
        if (_message.body) {
            this._model.addMessage(_message);
            if (own) this._client.send(_message);

        }
    },

    addUsers : function(users) {
        var self = this;
        users.forEach(function(user) {
            self._model.addUser(user);
        });
    },

    removeUser : function(user) {
        var self = this;
        self._model.removeUser(user);
    },

    wrapMessage : function(message) {
        return { author : this._client._user_id, body : message };
    }

};