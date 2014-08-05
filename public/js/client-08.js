$(document).ready(function () {

//    var socket; // a global variable.


    var userName = ($('#login input').val());
    if (userName !== "") {
        join(userName); //rejoin using old session
    }


    $('#userNameButton').click(function () {
        if ($('#login input').val() != "") {
            join ( $('#login input').val() );
        }
    });


    $('#chatButton').click(function () {
        if ($('#chat input').val() != "") {
            socket.emit('chat', JSON.stringify({msg: $('#chat input').val()}));
        }
    });

    function join (userName) {

        var socket = io();
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


        $.ajax({
            type: "POST",
            url: "/user",
            data: JSON.stringify({ "user": userName}),
            contentType : 'application/json',
            dataType: "json"
        })
            .done(function() {
                // send join message
//                alert('login success');
                socket.emit('join', JSON.stringify({}));
            })
            .fail(function() {
                console.log( "error");
            })
    };

});