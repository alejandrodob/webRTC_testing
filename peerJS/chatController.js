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
    },

    rebuildConversation : function() {
        var conversation, messages, message;

        conversation = this._elements.conversation;
        conversation.html('');

        messages = this._model.getConversation();
        for (message in messages) {
            if (messages.hasOwnProperty(message)) {
                conversation.append($('<li>' + messages[message] + '</li>'));
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
    this._view.connectButtonClicked.subscribe(function() {
        self._client.connect(self._view._elements.name.val());
    });

    //define client callbacks
    this._client.onconnect = function(err, activePeers) {
        if (!err) {
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
    addMessage : function(own, message) {
        var _message = own ? this._view._elements.message.val() : message
        //var message = this._view._elements.message.val();
        if (_message) {
            this._model.addMessage(_message);
            if (own) this._client.send(_message);

        }
    },

    addUsers : function(users) {
        console.log('addUsers on controller called')
    },

    removeUser : function(user) {
        console.log('removeUser on controller called')
    }

};