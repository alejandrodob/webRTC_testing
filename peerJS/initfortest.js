$(function () {
    var model = new ChatModel();
    var view = new ChatView(model, {
            'conversation' : $('#conversation'),
            'message' : $('#message'),
            'sendButton' : $('#sendBtn'),
            'onlineUsers' : $('#onlineUsers'),
            'name' : $('#name'),
            'connectButton' : $('#connectBtn')
        });
    var peers = $('#peers');
    var client = new ChatClient({getActivePeers: function(cb) { cb(null, [peers.val()]) }});
    var controller = new ChatController(model, view, client);
    
    view.show();
});