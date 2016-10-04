function fetch(channel) {
    $.ajax({
        type: 'GET',
        url: 'https://api.twitch.tv/kraken/channels/' + channel,
        headers: {
            'Client-ID': 'a59qej09oftmvj165yc0tnhll3sxps'
        },
        success: function(response) {
            $('#userCards').append('<div id="user-card-' + response.display_name + '"><div class="status">' + response.status + '</div><div class="logo"><img src="' + response.logo + '" alt="Channel Logo"></div><div class="display-name"><a href="' + response.url + '">' + response.display_name + '</a></div><div class="game"><p>Plyaing:&nbsp;' + response.game + '<p><div></div>');
            /*  $('#user-card-' + response.display_name).html('<div class="status">' + response.status + '</div><div class="logo"><img src="' + response.logo + '" alt="Channel Logo"></div><div class="display-name"><a href="' + response.url + '">' + response.display_name + '</a></div><div class="game"><p>Plyaing:&nbsp;' + response.game + '<p><div>');*/
            console.log(response);

        },
        error: function(error) {
            console.log(error);
        },
    });
}

function callChannels() {
    var userChannels = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];
    for (var i = 0; i < userChannels.length; i++) {
        fetch(userChannels[i]);
    }
}

callChannels();

/*function buildPage(userData) {
    console.log(userData.logo);
    $('#userCards').append('<div id="user-card' + userData.display_name + '"></div>');
    $('.user-card' + userData.display_name).html('<div class="logo"><img src="' + userData.logo + '" alt="Channel Logo"></div><div class="display-name"></div><div class="status"></div><div class="url"><div>');
}*/




/*$.ajax({
    type: 'GET',
    url: 'https://api.twitch.tv/kraken/channels/twitch',
    headers: {
        'Client-ID': 'ida59qej09oftmvj165yc0tnhll3sxps'
    },
    success: function(data) {
        console.log(data);
    }
});*/
