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

//                var serverIP = "http://127.0.0.1";
//                socket = io(serverIP, {reconnect: false});

                socket = io('http://localhost');

                socket.emit('join', JSON.stringify({}));

                socket.on('connect', function () {
                    console.log('connected');
                });
                socket.on('connecting', function () {
                    console.log('connecting');
                });
                socket.on('disconnect', function () {
                    console.log('disconnect');
//                    intervalID = setInterval(tryReconnect, 4000);
                });
                socket.on('connect_failed', function () {
                    console.log('connect_failed');
                });
                socket.on('error', function (err) {
                    console.log('error: ' + err);
                });
                socket.on('reconnect_failed', function () {
                    console.log('reconnect_failed');
                });
                socket.on('reconnect', function () {
                    console.log('reconnected ');
                });
                socket.on('reconnecting', function () {
                    console.log('reconnecting');
                });


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