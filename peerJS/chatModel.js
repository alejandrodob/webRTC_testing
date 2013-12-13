
function ChatModel(client) {
    this._client = client;
    this._messages = [];

    this.messageAdded = new Event(this);

}

ChatModel.prototype = {
    getConversation : function() {
        return [].concat(this._messages);
    },

    addMessage : function(message) {
        this._messages.push(message);
        this.messageAdded.notify({ message : message });
    },

    newParticipant : function(participant) {},

    checkAuthor : function() {}

};




function Event(sender) {
    this._sender = sender;
    this._listeners = [];
}

Event.prototype = {
    subscribe : function(listener) {
        this._listeners.push(listener);
    },
    notify : function(args) {
        var index;

        for (index = 0; index < this._listeners.length; index += 1) {
            this._listeners[index](this._sender, args);
        }
    }
};