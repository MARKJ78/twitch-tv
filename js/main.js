$(document).ready(function() {

    /*////////////////////////////////////////


    Call API


    ////////////////////////////////////////*/

    function fetch(channel, name) {
        $.ajax({
            type: 'GET',
            url: 'https://api.twitch.tv/kraken/streams/' + channel,
            headers: {
                'Client-ID': 'a59qej09oftmvj165yc0tnhll3sxps'
            },
            success: function(data) {
                populate(data);
                console.log(data);
            },
            error: function(error) {
                console.log(error);
            },
        });
    }

    function callChannels() {
        var userChannels = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas" /*, "brunofin", "comster404"*/ ];
        for (var i = 0; i < userChannels.length; i++) {
            fetch(userChannels[i], userChannels[i]);
        }
    }

    callChannels();

    console.log("ready!");
});

/*////////////////////////////////////////


Populate


////////////////////////////////////////*/

function populate(response) {
    if (response.stream !== null) {
        $('#userCards').append('<div class="user-card" id="' + response.stream.channel.display_name + '"><div class="status">' + response.stream.channel.status + '</div><div id="videoPlay-' + response.stream.channel.display_name + '" class="video-play"><i class="fa fa-play" aria-hidden="true"></i></div><div id="videoKill-' + response.stream.channel.display_name + '" class="video-kill"><i class="fa fa-stop" aria-hidden="true"></i></div><div class="logo"><img src="' + response.stream.channel.logo + '" alt="Channel Logo"></div><div class="display-name"><a href="' + response.stream.channel.url + '">' + response.stream.channel.display_name + '</a></div><div class="game"><p>Playing:&nbsp;<b>' + response.stream.channel.game + '</b><p><div></div>');
    } else {
        var channel = response._links.channel;
        console.log(response._links.channel);
        var urlArray = channel.split('/');
        var urlName = urlArray[urlArray.length - 1];
        $('#offlineCards').append('<div class="offline-card"><h2>' + urlName + '&nbsp; is OFFLINE</h2><div class="link"><a href="https://www.twitch.tv/' + urlName + '">Go To Channel&nbsp;<i class="fa fa-external-link fa-lg" aria-hidden="true"></i></a></div>');
    }



    /*////////////////////////////////////////


    Embeded video function


    ////////////////////////////////////////*/

    function getStream(name, streamWidth) {
        console.log(name);
        console.log(streamWidth);
        $('#' + name).append('<div class="user-stream"><iframe src="https://player.twitch.tv/?channel={' + name + '}" width="100%" frameborder="0" scrolling="no" allowfullscreen="true"></iframe></div>');
    }
    if (response.stream !== null) {
        $('#videoPlay-' + response.stream.channel.display_name).click(function() {
            var thisName = $(this).parent().attr('id');
            var thisWidth = $(this).parent().width();
            getStream(thisName, thisWidth);
            $('#videoPlay-' + response.stream.channel.display_name).css({
                'display': 'none'
            });
            $('#videoKill-' + response.stream.channel.display_name).css({
                'display': 'block'
            });
        });
        $('#videoKill-' + response.stream.channel.display_name).click(function() {
            $('.user-stream').remove();
            $('#videoPlay-' + response.stream.channel.display_name).css({
                'display': 'block'
            });
            $('#videoKill-' + response.stream.channel.display_name).css({
                'display': 'none'
            });
        });
    }
}
