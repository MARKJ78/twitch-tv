$(document).ready(function() {
    var userChannels = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "brunofin", "comster404"];
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
        for (var i = 0; i < userChannels.length; i++) {
            fetch(userChannels[i]);
        }
    }
    callChannels();

});

/*////////////////////////////////////////


Populate


////////////////////////////////////////*/

function populate(response, name) {
    if (response.stream !== null) {
        $('#userCards').append('<div class="user-card" id="' + response.stream.channel.display_name + '">  <div class="top-row">    <div class="on-air-light"></div>    <div class="on-air-text">On air text</div>     <div class="game"><p>Playing:&nbsp;<b>' + response.stream.channel.game + '</b></p></div>    <div class="display-name"><a href="' + response.stream.channel.url + '">' + response.stream.channel.display_name + '</a></div>  </div>  <div class="middle-row" id="middle-row-' + response.stream.channel.display_name + '">  <div class="logo" id="logo-' + response.stream.channel.display_name + '"><img src="' + response.stream.channel.logo + '" alt="Channel Logo"></div>    <div class="status">' + response.stream.channel.status + '</div>  </div>  <div class="bottom-row">    <div class="fave"><p>Favorite</p><i class="fa fa-heart" aria-hidden="true"></i></div>    <div class="go-channel"><p>Visit Channel</p><i class="fa fa-twitch" aria-hidden="true"></i></div>    <div class="player-control">    <div id="videoPlay-' + response.stream.channel.display_name + '" class="video-play"><p>Stream</p><i class="fa fa-play" aria-hidden="true"></i></div>    <div id="videoKill-' + response.stream.channel.display_name + '" class="video-kill"><p>Stream</p><i class="fa fa-stop" aria-hidden="true"></i></div></div></div><div>');
        $('#videoKill-' + response.stream.channel.display_name).css({
            'display': 'none'
        });
    } else {
        var channel = response._links.channel;
        var urlArray = channel.split('/');
        var urlName = urlArray[urlArray.length - 1];
        $('#offlineCards').append('<div class="offline-card"><h2>' + urlName + '&nbsp; is OFFLINE</h2><div class="link"><a href="https://www.twitch.tv/' + urlName + '">Go To Channel&nbsp;<i class="fa fa-external-link fa-lg" aria-hidden="true"></i></a></div>');
    }

    /*////////////////////////////////////////
    Embeded video function
    ////////////////////////////////////////*/

    function getStream(name) {
        $('#middle-row-' + name).html('<div id="' + name + '-user-stream" class="user-stream"><iframe src="https://player.twitch.tv/?channel={' + name + '}" width="100%" frameborder="0" scrolling="no" allowfullscreen="true"></iframe></div>');
    }

    if (response.stream !== null) {
        $('#videoPlay-' + response.stream.channel.display_name).click(function() {
            var thisName = $(this).parent().parent().parent().attr('id');
            getStream(thisName);
            $(this).css({
                'display': 'none'
            });
            $('#videoKill-' + response.stream.channel.display_name).css({
                'display': 'block'
            });
        });
    }
    if (response.stream !== null) {
        $('#videoKill-' + response.stream.channel.display_name).click(function() {
            $('#' + response.stream.channel.display_name + '-user-stream').remove();
            $('#middle-row-' + response.stream.channel.display_name).html(' <div class="logo" id="logo-' + response.stream.channel.display_name + '"><img src="' + response.stream.channel.logo + '" alt="Channel Logo"></div>    <div class="status">' + response.stream.channel.status + '</div>');
            $(this).css({
                'display': 'none'
            });
            $('#videoPlay-' + response.stream.channel.display_name).css({
                'display': 'block'
            });


        });
    }
}
