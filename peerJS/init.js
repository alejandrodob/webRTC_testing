$(function () {
    var model = new ChatModel();
    var view = new ChatView(model, {
            'conversation' : $('#conversation'),
            'onlineUsers' : $('#onlineUsers'),
            'message' : $('#message'),
            'sendButton' : $('#sendBtn')
        });
    var session = sessionModel();
    var client = new ChatClient(session);
    var controller = new ChatController(model, view, client);
    client.connect();
    view.show();
});