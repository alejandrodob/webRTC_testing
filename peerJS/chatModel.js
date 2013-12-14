
function ChatModel() {
    this._messages = [];
    this._users = [];

    this.messageAdded = new Event(this);
    this.userAdded = new Event(this);

}

ChatModel.prototype = {
    getConversation : function() {
        return [].concat(this._messages);
    },

    addMessage : function(message) {
        this._messages.push(message);
        this.messageAdded.notify({ message : message });
    },

    getUsers : function() {
        return [].concat(this._users);
    },

    addUser : function(user) {
        this._users.push(user);
        this.userAdded.notify({ user : user });
    }

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