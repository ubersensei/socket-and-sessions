$(document).ready(function () {


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
                alert( "done");
            })
            .fail(function() {
                alert( "error");
            })
    });

});