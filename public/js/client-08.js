$(document).ready(function () {

    var socket; // a global variable.

    $('#chatButton').click(function () {
        if ($('#chat input').val() != "") {
            socket.emit('chat', JSON.stringify({msg: $('#chat input').val()}));
            $('#chat input').val('');
        }
    });

    $('#userNameButton').click(function () {
        if ($('#login input').val() != "") {
            var userName = $('#login input').val();
            $('#login input').val('');
        }

        $.ajax({
            type: "POST",
            url: "/user",
            data: JSON.stringify({ "user": userName}),
            contentType : 'application/json',
            dataType: "json"
        })
            .done(function(data) {

                $('#userName span').text(data.userFromSession);

                socket = io();
                socket.emit('join', JSON.stringify({}));
                socket.on('chat', function(message){
                    var content;
                    var chatMessage = JSON.parse(message);

                    if (chatMessage.category == "join") {
                        content = chatMessage.user + chatMessage.msg;
                    }

                    if (chatMessage.category == "chat") {
                        content = chatMessage.user + " says: " + chatMessage.msg;
                    }

                    // what if you cannot handle the message ? validation
                    $('#messages').append($('<li>').text(content));
                });


            })
            .fail(function() {
                console.log( "error");
            })
    });

});