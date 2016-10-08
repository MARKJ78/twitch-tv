var userChannels = [];
if (typeof Cookies('PanelFavorites') === 'undefined') {
    userChannels = ["Jimmy_Savelle", "brunofin", "comster404", "ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];
    Cookies.set('PanelFavorites', userChannels);
    console.log(userChannels + " From Array");
} else {
    userChannels = Cookies.getJSON('PanelFavorites');
    console.log(Cookies.getJSON('PanelFavorites') + " From Cookies");
}




/*////////////////////////////////////////
Call API
////////////////////////////////////////*/
function fetch(prefix, channel) {
    var path;
    if (prefix == 'streams/') {
        path = "response.stream.channel.";
    }
    $.ajax({
        type: 'GET',
        url: 'https://api.twitch.tv/kraken/' + prefix + channel,
        headers: {
            'Client-ID': 'a59qej09oftmvj165yc0tnhll3sxps'
        },
        success: function(data) {
            populate(data, path);

        },
        error: function(error) {
            $('#fave-' + channel).addClass('c-not-found');

        },
    });

}



/*/ ///////////////////////////////////////

Loop through favorites array, send each fave username to fetchFaves and list in channel panel

////////////////////////////////////////*/

function callFaveChannels() {
    var prefix = 'streams/';
    for (var i = 0; i < userChannels.length; i++) {
        fetch(prefix, userChannels[i]);
        $('#faves-list').append('<li id="fave-' + userChannels[i] + '"><a class="link-' + userChannels[i] + '" href="#">' + userChannels[i] + '</a></li>');
    }
}



function removeFromFaves(name) {
    var i = userChannels.indexOf(name);
    if (i != -1) {
        userChannels.splice(i, 1);
        $('#fave-' + name).remove();
        Cookies.set('PanelFavorites', userChannels);
        /* console.log(userChannels + " rmvfunc");*/
    }
}

function addToFaves(name) {
    if ($.inArray(name, userChannels) == -1) {
        userChannels.push(name);
        console.log(userChannels);
        $('#faves-list').append('<li id="fave-' + name + '"><a class="link-' + name + '" href="https://www.twitch.tv/' + name + '">' + name + '</a></li>');
        Cookies.set('PanelFavorites', userChannels);
        /* console.log(userChannels + " rmvfunc");*/
    } else {
        alert('You already have ' + name + ' as a favorite'); //test
    }
}

/*/ ///////////////////////////////////////

Populate Search

////////////////////////////////////////*/




/*/ ///////////////////////////////////////

Populate Faves

////////////////////////////////////////*/

function populate(response, path) {
    console.log(response);
    console.log(path);
    if (response.stream !== null) {
        $('#fave-' + path + 'display_name').addClass('a-online');
        $('.link-' + path + 'display_name').attr("href", "https://www.twitch.tv/" + path + 'display_name');
        $('#userCards').append('<div class="user-card" id="' + path + 'display_name' + '">  <div class="top-row">     <div class="on-air-text">On air text</div>       <div class="game"><p>Playing:&nbsp;<b>' + path + 'game' + '</b></p></div>    <div class="display-name"><a href="' + path + 'url' + '">' + path + 'display_name' + '</a></div>  </div>  <div class="middle-row" id="middle-row-' + path + 'display_name' + '">  <div class="logo" id="logo-' + path + 'display_name' + '"><img src="' + path + 'logo' + '" alt="Channel Logo"></div>    <div class="status">' + path + status + '</div>  </div>  <div class="bottom-row">    <div class="heart-' + path + 'display_name' + '"><p>Favorite</p><i class="fa fa-heart" aria-hidden="true"></i></div>    <div class="go-channel"><p>Visit Channel</p><i class="fa fa-twitch" aria-hidden="true"></i></div>    <div class="player-control">    <div id="videoPlay-' + path + 'display_name' + '" class="video-play"><p>Stream</p><i class="fa fa-play" aria-hidden="true"></i></div>    <div id="videoKill-' + path + 'display_name' + '" class="video-kill"><p>Stream</p><i class="fa fa-stop" aria-hidden="true"></i></div></div></div><div>');
        $('#videoKill-' + path + 'display_name').css({
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


    var thisName = $(this).parent().parent().parent().attr('id');
    /*////////////////////////////////////////
    Embeded video function
    ////////////////////////////////////////*/

    function getStream(name) {
        $('#middle-row-' + name).html('<div id="' + name + '-user-stream" class="user-stream"><iframe src="https://player.twitch.tv/?channel={' + name + '}" width="100%" frameborder="0" scrolling="no" allowfullscreen="true"></iframe></div>');
    }

    if (response.stream !== null) {
        $('#videoPlay-' + path + 'display_name').click(function() {
            var thisName = $(this).parent().parent().parent().attr('id');
            getStream(thisName);
            $(this).css({
                'display': 'none'
            });
            $('#videoKill-' + path + 'display_name').css({
                'display': 'block'
            });
        });

    }
    if (response.stream !== null) {
        $('#videoKill-' + path + 'display_name').click(function() {
            $('#' + path + 'display_name' + '-user-stream').remove();
            $('#middle-row-' + path + 'display_name').html(' <div class="logo" id="logo-' + path + 'display_name' + '"><img src="' + path + logo + '" alt="Channel Logo"></div>    <div class="status">' + path + status + '</div>');
            $(this).css({
                'display': 'none'
            });
            $('#videoPlay-' + path + 'display_name').css({
                'display': 'block'
            });
        });
    }


    $('.c-not-found').click(function() {
        var removeName = $(this).contents().text();
        removeFromFaves(removeName);
        console.log(userChannels + " fave-list li c-not-found click");
    });

    $('.heart-' + path + 'display_name').click(function() {
        var addName = $(this).parent().parent().attr('id');
        addToFaves(addName);
        /*console.log($(this).parent().parent().attr('id') + ' is now a favorite.');*/
    });
}








/*/ ///////////////////////////////////////

Initiate page load

////////////////////////////////////////*/


callFaveChannels();








$('#userCards').append(
    '<div class="user-card" id="', +path.display_name +
    ',">  <div class="top-row"><div class="on-air-text">On air text</div><div class="game"><p>Playing:&nbsp;<b>', +path.game +
    '</b></p></div><div class="display-name"><a href="', +path.url +
    '">', +path.display_name +
    '</a></div>  </div>  <div class="middle-row" id="middle-row-', +path.display_name + '">  <div class="logo" id="logo-', +path.display_name +
    '"><img src="' + path.logo +
    '" alt="Channel Logo"></div>    <div class="status">', +path.status +
    '</div></div>  <div class="bottom-row"><div class="heart"><p>Favorite</p><i class="fa fa-heart" aria-hidden="true"></i></div><div class="go-channel"><p>Visit Channel</p><i class="fa fa-twitch" aria-hidden="true"></i></div>    <div class="player-control">    <div id="videoPlay-' + path.display_name + '" class="video-play"><p>Stream</p><i class="fa fa-play" aria-hidden="true"></i></div>    <div id="videoKill-' + path.display_name + '" class="video-kill"><p>Stream</p><i class="fa fa-stop" aria-hidden="true"></i></div></div></div><div>');
