$(function () {
    var model = new ChatModel();
    var view = new ChatView(model, {
            'conversation' : $('#conversation'),
            'onlineUsers' : $('#onlineUsers'),
            'message' : $('#message'),
            'sendButton' : $('#sendBtn')
        });
    var client = new ChatClient();
    var controller = new ChatController(model, view, client);
    
    view.show();
});