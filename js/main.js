var userChannels = [];
if (typeof Cookies('PanelFavorites') === 'undefined') {
    userChannels = ["Jimmy_Savelle", "brunofin", "comster404", "ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];
    Cookies.set('PanelFavorites', userChannels);
    /* console.log(userChannels + " From Array");*/
} else {
    userChannels = Cookies.getJSON('PanelFavorites');
    /* console.log(Cookies.getJSON('PanelFavorites') + " From Cookies");*/
}


//go button search
$('#search-channels-btn').click(function() {
    var term = $('#searchTerm').val();
    if (term !== '') {
        fetchSearch(term); //go straight to fetch
    }
});
//enter/return key search
$('#searchTerm').keyup(function(event) {
    var term = $('#searchTerm').val();
    if (event.keyCode == 13) {
        if (term !== '') {
            fetchSearch(term);
        }
    }
});


/*////////////////////////////////////////
Call API
////////////////////////////////////////*/
function fetchFaves(channel) {
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
            $('#fave-' + channel).addClass('c-not-found');

        },
    });

}


function fetchSearch(term) {
    $.ajax({
        type: 'GET',
        url: 'https://api.twitch.tv/kraken/search/channels?q=' + term,
        headers: {
            'Client-ID': 'a59qej09oftmvj165yc0tnhll3sxps'
        },
        success: function(data) {
            populateSearch(data);

        },
        error: function(error) {
            console.log('Not Found');

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

function populateSearch(found) {
    console.log(found.channels);
    console.log(found.channels.length);
    if (found.channels.length !== 0) {
        console.log(found.channels);
        console.log(found.channels.length);
        for (var i = 0; i < found.channels.length; i++) {
            $('#fave-' + found.channels[i].display_name).addClass('a-online');
            $('.link-' + found.channels[i].display_name).attr("href", "https://www.twitch.tv/" + found.channels[i].display_name);
            $('#userCards').append('<div class="user-card" id="' + found.channels[i].display_name + '">  <div class="top-row">     <div class="on-air-text">On air text</div>       <div class="game"><p>Playing:&nbsp;<b>' + found.channels[i].game + '</b></p></div>    <div class="display-name"><a href="' + found.channels[i].url + '">' + found.channels[i].display_name + '</a></div>  </div>  <div class="middle-row" id="middle-row-' + found.channels[i].display_name + '">  <div class="logo" id="logo-' + found.channels[i].display_name + '"><img src="' + found.channels[i].logo + '" alt="Channel Logo"></div>    <div class="status">' + found.channels[i].status + '</div>  </div>  <div class="bottom-row">    <div class="heart-' + found.channels[i].display_name + '"><p>Favorite</p><i class="fa fa-heart" aria-hidden="true"></i></div>    <div class="go-channel"><p>Visit Channel</p><i class="fa fa-twitch" aria-hidden="true"></i></div>    <div class="player-control">    <div id="videoPlay-' + found.channels[i].display_name + '" class="video-play"><p>Stream</p><i class="fa fa-play" aria-hidden="true"></i></div>    <div id="videoKill-' + found.channels[i].display_name + '" class="video-kill"><p>Stream</p><i class="fa fa-stop" aria-hidden="true"></i></div></div></div><div>');
            $('#videoKill-' + found.channels[i].display_name).css({
                'display': 'none'
            });
            $('.on-air-text').html(
                'STREAMING'
            );
            sort();
        }
    } else {
        alert("Nothing Found!");
    }
}


/*/ ///////////////////////////////////////

Populate Faves

////////////////////////////////////////*/

function populateFaves(response) {
    if (response.stream !== null) {
        $('#fave-' + response.stream.channel.display_name).addClass('a-online');
        $('.link-' + response.stream.channel.display_name).attr("href", "https://www.twitch.tv/" + response.stream.channel.display_name);
        $('#userCards').append('<div class="user-card" id="' + response.stream.channel.display_name + '">  <div class="top-row">     <div class="on-air-text">On air text</div>       <div class="game"><p>Playing:&nbsp;<b>' + response.stream.channel.game + '</b></p></div>    <div class="display-name"><a href="' + response.stream.channel.url + '">' + response.stream.channel.display_name + '</a></div>  </div>  <div class="middle-row" id="middle-row-' + response.stream.channel.display_name + '">  <div class="logo" id="logo-' + response.stream.channel.display_name + '"><img src="' + response.stream.channel.logo + '" alt="Channel Logo"></div>    <div class="status">' + response.stream.channel.status + '</div>  </div>  <div class="bottom-row">    <div class="heart-' + response.stream.channel.display_name + '"><p>Favorite</p><i class="fa fa-heart" aria-hidden="true"></i></div>    <div class="go-channel"><p>Visit Channel</p><i class="fa fa-twitch" aria-hidden="true"></i></div>    <div class="player-control">    <div id="videoPlay-' + response.stream.channel.display_name + '" class="video-play"><p>Stream</p><i class="fa fa-play" aria-hidden="true"></i></div>    <div id="videoKill-' + response.stream.channel.display_name + '" class="video-kill"><p>Stream</p><i class="fa fa-stop" aria-hidden="true"></i></div></div></div><div>');
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


    $('.c-not-found').click(function() {
        var removeName = $(this).contents().text();
        removeFromFaves(removeName);
        console.log(userChannels + " fave-list li c-not-found click");
    });

    $('.heart-' + response.stream.channel.display_name).click(function() {
        var addName = $(this).parent().parent().attr('id');
        addToFaves(addName);
        /*console.log($(this).parent().parent().attr('id') + ' is now a favorite.');*/
    });
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





/*/ ///////////////////////////////////////

Initiate page load

////////////////////////////////////////*/


callFaveChannels();
