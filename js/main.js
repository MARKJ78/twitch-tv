var userChannels = ["garry_Glitter", "ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "brunofin", "comster404"];

$(document).ready(function() {
    /*////////////////////////////////////////
    Call API
    ////////////////////////////////////////*/
    var userChannels = ["garry_Glitter", "ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "brunofin", "comster404"];

    Cookies.set('PanelFavorites', userChannels);
    var getCookie = Cookies.getJSON('PanelFavorites');
    console.log(getCookie);

    function fetchFaves(channel) {
        var user = channel;
        $.ajax({
            type: 'GET',
            url: 'https://api.twitch.tv/kraken/streams/' + channel,
            headers: {
                'Client-ID': 'a59qej09oftmvj165yc0tnhll3sxps'
            },
            success: function(data) {
                populateFaves(data);

            },
            error: function(error) {
                $('#fave-' + user).addClass('c-not-found');

            },
        });

    }

    /*/ ///////////////////////////////////////

    Loop through favorites array, send each fave username to fetchFaves and list in channel panel

    ////////////////////////////////////////*/

    function callFaveChannels() {
        for (var i = 0; i < userChannels.length; i++) {
            fetchFaves(userChannels[i]);
            $('#faves-list').append('<li id="fave-' + userChannels[i] + '"><a class="link-' + userChannels[i] + '" href="#">' + userChannels[i] + '</a></li>');


        }
    }




    /*/ ///////////////////////////////////////

    Initiate page load

    ////////////////////////////////////////*/
    callFaveChannels();

}); //end ready

/*/ ///////////////////////////////////////

Populate

////////////////////////////////////////*/

function populateFaves(response, name) {
    if (response.stream !== null) {
        $('#fave-' + response.stream.channel.display_name).addClass('a-online');
        $('.link-' + response.stream.channel.display_name).attr("href", "https://www.twitch.tv/" + response.stream.channel.display_name);
        $('#userCards').append('<div class="user-card" id="' + response.stream.channel.display_name + '">  <div class="top-row">     <div class="on-air-text">On air text</div>       <div class="game"><p>Playing:&nbsp;<b>' + response.stream.channel.game + '</b></p></div>    <div class="display-name"><a href="' + response.stream.channel.url + '">' + response.stream.channel.display_name + '</a></div>  </div>  <div class="middle-row" id="middle-row-' + response.stream.channel.display_name + '">  <div class="logo" id="logo-' + response.stream.channel.display_name + '"><img src="' + response.stream.channel.logo + '" alt="Channel Logo"></div>    <div class="status">' + response.stream.channel.status + '</div>  </div>  <div class="bottom-row">    <div class="heart"><p>Favorite</p><i class="fa fa-heart" aria-hidden="true"></i></div>    <div class="go-channel"><p>Visit Channel</p><i class="fa fa-twitch" aria-hidden="true"></i></div>    <div class="player-control">    <div id="videoPlay-' + response.stream.channel.display_name + '" class="video-play"><p>Stream</p><i class="fa fa-play" aria-hidden="true"></i></div>    <div id="videoKill-' + response.stream.channel.display_name + '" class="video-kill"><p>Stream</p><i class="fa fa-stop" aria-hidden="true"></i></div></div></div><div>');
        $('#videoKill-' + response.stream.channel.display_name).css({
            'display': 'none'
        });
        $('.on-air-text').html(
            'STREAMING'
        );
        sort();
    } else {
        var channel = response._links.channel;
        var urlArray = channel.split('/');
        var urlName = urlArray[urlArray.length - 1];
        $('#fave-' + urlName).addClass('b-offline');
        $('.link-' + urlName).attr("href", "https://www.twitch.tv/" + urlName);
        sort();
        /*  $('#offlineCards').append('<div class="offline-card"><h2>' + urlName + '&nbsp; is OFFLINE</h2><div class="link"><a href="https://www.twitch.tv/' + urlName + '">Go To Channel&nbsp;<i class="fa fa-external-link fa-lg" aria-hidden="true"></i></a></div>');*/
    }


    function removeFromFaves(name) {
        var i = userChannels.indexOf(name);
        if (i != -1) {
            userChannels.splice(i, 1);
            $('#fave-' + name).remove();


            /*$.cookie('ChannelPanelFavorites', sendToCookie);
            var retrieved = JSON.parse($.cookie('ChannelPanelFavorites'));
            console.log(retrieved + "2nd");*/

        }
    }

    $('.c-not-found').click(function() {
        var txt = $(this).contents().text();
        removeFromFaves(txt);
    });

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


/*////////////////////////////////////////
Sort faves list, online first function
////////////////////////////////////////*/


function sort() {
    $('#faves-list').each(function() {
        $('.a-online', this).prependTo(this);
        $('.c-not-found', this).appendTo(this);
    });
}
