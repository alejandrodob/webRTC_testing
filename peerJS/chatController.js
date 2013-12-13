function ChatView(model, elements) {
    this._model = model;
    this._elements = elements;

    this.sendButtonClicked = new Event(this);

    var self = this;

    // subscribe model listeners
    this._model.messageAdded.subscribe(function() {
        self.rebuildConversation();
    });

    // subscribe listeners to HTML controls
    this._elements.sendButton.click(function() {
        self.sendButtonClicked.notify();
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
function ChatController(model, view) {
    this._model = model;
    this._view = view;

    var self = this;

    //subscribe to view events
    this._view.sendButtonClicked.subscribe(function() {
        self.addMessage();
    });

}

ChatController.prototype = {
    addMessage : function() {
        var message = this._view._elements.message.val();
        if (message) {
            this._model.addMessage(message);
        }
    }

};