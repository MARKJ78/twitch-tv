//client ida59qej09oftmvj165yc0tnhll3sxps

/*$.ajax({
    type: 'GET',
    url: 'https://api.twitch.tv/kraken/channels/twitch',
    headers: {
        'Client-ID': 'axjhfp777tflhy0yjb5sftsil'
    },
    success: function(data) {
        console.log(data);
    }
});*/
//client ida59qej09oftmvj165yc0tnhll3sxps

function callChannels() {
    var userChannels = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];
    for (var i = 0; i < userChannels.length; i++) {
        fetch(userChannels[i]);
    }
}

var channelData = []; //Array of response objects(channel)

function fetch(channel) {
    $.ajax({
        type: 'GET',
        url: 'https://api.twitch.tv/kraken/channels/' + channel,
        headers: {
            'Client-ID': 'a59qej09oftmvj165yc0tnhll3sxps'
        },
        success: function(response) {
            channelData.push(response);

        },
        error: function(error) {
            console.log(error);
        },
    });
}

callChannels();
console.log(channelData);
