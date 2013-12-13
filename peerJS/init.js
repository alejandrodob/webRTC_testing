$(function () {
    var model = new ChatModel();
    var view = new ChatView(model, {
            'conversation' : $('#conversation'),
            'message' : $('#message'),
            'sendButton' : $('#sendBtn')
        });
    var controller = new ChatController(model, view);
    
    view.show();
});