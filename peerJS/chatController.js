function ChatView(model, elements) {
    this._model = model;
    this._elements = elements;

    this.sendButtonClicked = new Event(this);
    this.connectButtonClicked = new Event(this);

    var self = this;

    // subscribe model listeners
    this._model.messageAdded.subscribe(function() {
        self.rebuildConversation();
    });
    this._model.onlineUsersChanged.subscribe(function() {
        self.rebuildOnlineUsers();
    });

    // subscribe listeners to HTML controls
    this._elements.sendButton.click(function() {
        self.sendButtonClicked.notify();
    });
    this._elements.connectButton.click(function() {
        self.connectButtonClicked.notify();
    });

}

ChatView.prototype = {
    show : function() {
        this.rebuildConversation();
        this.rebuildOnlineUsers();
    },

    rebuildConversation : function() {
        var conversation, messages, message;

        conversation = this._elements.conversation;
        conversation.html('');

        messages = this._model.getConversation();
        for (message in messages) {
            if (messages.hasOwnProperty(message)) {
                var author = messages[message].author;
                var body = messages[message].body;
                conversation.append($('<li>' + author +": " + body + '</li>'));
            }
        }
    },

    rebuildOnlineUsers : function() {
        var onlineUsers, users, user;

        onlineUsers = this._elements.onlineUsers;
        onlineUsers.html('');

        users = this._model.getUsers();
        console.log(users.length)
        for (user in users) {
            if (users.hasOwnProperty(user)) {
                onlineUsers.append($('<li>' + users[user] + '</li>'));
            }
        }
    }
};

/**
 * The Controller. Controller responds to user actions and
 * invokes changes on the model.
 */
function ChatController(model, view, client) {
    this._model = model;
    this._view = view;
    this._client = client;

    var self = this;

    //subscribe to view events
    this._view.sendButtonClicked.subscribe(function() {
        self.addMessage(true);
    });

    //only for testing GUI--to be removed after that is done
    this._view.connectButtonClicked.subscribe(function() {
        self._client.connect(self._view._elements.name.val());
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
    //this will need to be re-written after user ID definition
    wrapMessage : function(message) {
        return { author : this._client._peer.id, body : message };
    }

};