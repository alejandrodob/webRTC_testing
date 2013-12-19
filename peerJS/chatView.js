function ChatView(model, elements) {
    this._model = model;
    this._elements = elements;

    this.sendButtonClicked = new Event(this);

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

}

ChatView.prototype = {
    show : function() {
        this.rebuildConversation();
        this.rebuildOnlineUsers();
    },

    clearTextInput : function() {
        this._elements.message.val('');
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