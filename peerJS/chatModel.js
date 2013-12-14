
function ChatModel() {
    this._messages = [];
    this._users = [];

    this.messageAdded = new Event(this);
    this.onlineUsersChanged = new Event(this);

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
        this.onlineUsersChanged.notify({ user : user });
    },

    removeUser : function(user) {
        var newUsers = [];
        this._users.forEach(function(u) {
            if (u !== user) newUsers.push(u);
        });
        this._users = newUsers;
        this.onlineUsersChanged.notify({ user : user });
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