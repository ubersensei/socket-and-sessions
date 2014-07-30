$(document).ready(function () {


    var socket = io();
    socket.on('newJoinerConfirmation', function(msg){
        $('#messages').append($('<li>').text(msg));
    });


    $('#userNameButton').click(function () {
        var userName = $('#login input').val() == "" ? "Johny" : $('#login input').val();
        $.ajax({
            type: "POST",
            url: "/user",
            data: JSON.stringify({ "user": userName}),
            contentType : 'application/json',
            dataType: "json"
        })
            .done(function() {
                // send join message
                socket.emit('join', JSON.stringify({}));
                alert('login success');
            })
            .fail(function() {
                console.log( "error");
            })
    });

});