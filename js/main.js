var userChannels = [];
if (typeof Cookies('PanelFavorites') === 'undefined') {
    userChannels = ["ShoRyuKen_this", "Bandy_Coot", "crazycanuck1985", "Sensible_Socks", "ESL_SC2", "OgamingSC2", "DJTruthsayer", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];
    Cookies.set('PanelFavorites', userChannels);
    console.log(userChannels + " From Array");
} else {
    userChannels = Cookies.getJSON('PanelFavorites');
    console.log(Cookies.getJSON('PanelFavorites') + " From Cookies");
}
/*////////////////////////////////////////
Call API
////////////////////////////////////////*/
function fetch(display, prefix, channel) {
    $.ajax({
        type: 'GET',
        url: 'https://api.twitch.tv/kraken/' + prefix + channel,
        headers: {
            'Client-ID': 'a59qej09oftmvj165yc0tnhll3sxps'
        },
        success: function(response) {
            console.log(response);
            console.log('response in fetch');
            var path;
            if (response.hasOwnProperty('stream') && (response.stream !== null)) {
                path = response.stream;
                parse(display, path, response);
            } else if (response.hasOwnProperty('stream') && (response.stream === null)) {
                parse(display, path, response);
              } else if (response.hasOwnProperty('featured') && (response.featured.length !== 0)) {
                  for (var i = 0; i < response.featured.length; i++) {
                      path = response.featured[i].stream;
                      parse(display, path, response);
                  }
            } else if (response.hasOwnProperty('streams') && (response.streams.length !== 0)) {
                for (var j = 0; j < response.streams.length; j++) {
                    path = response.streams[j];
                    parse(display, path, response);
                }
            } else if (response.hasOwnProperty('streams') && (response.streams.length === 0)) {
                alert('Nothing Found for that search');
            }
        },
        error: function(error) {
            $('#fave-' + channel).addClass('c-not-found');
        },
    });
}
////Function called to fill twitch featured channels on load
function callFeaturedChannels() {
    var display = '.featured-container';
    var prefix = 'streams/';
    var channel = 'featured?limit=4';
    fetch(display, prefix, channel);
}


////Function called to fill faves on load
function callFaveChannels() {
    var prefix = 'streams/';
    var display = '.user-cards-container';
    for (var i = 0; i < userChannels.length; i++) {
        fetch(display, prefix, userChannels[i]);
        $('#faves-list').append('<li id="fave-' + userChannels[i] + '"><a class="link-' + userChannels[i] + '" href="#">' + userChannels[i] + '</a></li>');
    }
    callFeaturedChannels();
}


//go button search
$('#search-channels-btn').click(function() {
    var term = $('#searchTerm').val();
    var prefix = 'search/streams?q=';
    var display = '.search-cards-container';
    if (term !== '') {
        $('.search-cards-container').css({
            'display': 'flex'
        });
        fetch(display, prefix, term);
        console.log('search clicked');
    }
});
//enter/return key search
$('#searchTerm').keyup(function(event) {
    var term = $('#searchTerm').val();
    var prefix = 'search/streams?q=';
    var display = '.search-cards-container';
    if (event.keyCode == 13) {
        if (term !== '') {
            $('.search-cards-container').css({
                'display': 'flex'
            });
            fetch(display, prefix, term);
            console.log('search entered');
        }
    }
});


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
        var prefix = 'streams/';
        fetch(prefix, name);
        sort();
        /* console.log(userChannels + " rmvfunc");*/
    } else {
        alert('You already have ' + name + ' as a favorite'); //test
    }
}

function buildCards(display, path, response) {
    $(display).append([
        '<div class="user-card" id="' + path.channel.display_name + '">',
        '  <div class="top-row" id="top-row-' + path.channel.display_name + '"><img src="' + path.preview.medium + '" alt="Channel preview picture"></div>',
        '    <div class="info-row" id="info-row-' + path.channel.display_name + '">',
        '      <div class="game"><p>' + path.channel.display_name + '&nbsp;</p><p><i class="fa fa-gamepad fa-lg" aria-hidden="true"></i></p><p>&nbsp;' + path.game + '</p></div>',
        '    </div>',
        '  <div class="middle-row" id="middle-row-' + path.channel.display_name + '">',
        '    <div class="status">' + path.channel.status + '</div>',
        '    <div class="stream-info">',
        '      <ul>',
        '        <li>' + path.viewers + ' viewers</li>',
        '        <li>' + Math.round(path.average_fps) + ' FPS</li>',
        '        <li>' + path.video_height + 'p, ' + path.channel.language + '</li>',
        '      </ul>',
        '    </div>',
        '   </div>',
        '    <div class="bottom-row">',
        '      <div id="heart-' + path.channel.display_name + '"><i class="fa fa-heart" aria-hidden="true"></i></div>',
        '      <div class="go-channel"><a href="' + path.channel.url + '"><i class="fa fa-twitch" aria-hidden="true"></i></a></div>',
        '      <div class="player-control">',
        '        <div id="videoPlay-' + path.channel.display_name + '" class="video-play"><i class="fa fa-play" aria-hidden="true"></i></div>',
        '        <div id="videoKill-' + path.channel.display_name + '" class="video-kill"><i class="fa fa-stop" aria-hidden="true"></i></div>',
        '      </div>',
        '    </div>',
        '</div>'
    ].join('\n'));
    $('#videoKill-' + path.channel.display_name).css({
        'display': 'none'
    });
    $('.on-air-text').html(
        'STREAMING'
    );
    $('.c-not-found').click(function() {
        var removeName = $(this).contents().text();
        removeFromFaves(removeName);
        console.log(userChannels + " fave-list li c-not-response click");
    });

    $('#heart-' + path.channel.display_name).click(function() {
        var addName = $(this).parent().parent().attr('id');
        addToFaves(addName);
        /*console.log($(this).parent().parent().attr('id') + ' is now a favorite.');*/
    });
    /*////////////////////////////////////////
    Embeded video function
    ////////////////////////////////////////*/
    $('#videoPlay-' + path.channel.display_name).click(function() {
        console.log('VIDEO PLAY ' + path.channel.display_name);
        $('#top-row-' + path.channel.display_name).html([
            '<div id="' + path.channel.display_name + '-user-stream" class="user-stream">',
            '   <iframe src="https://player.twitch.tv/?channel={' + path.channel.display_name + '}" width="320" height="180" frameborder="0" scrolling="no" allowfullscreen="true"></iframe>',
            '</div>'
        ].join('\n'));
        $(this).css({
            'display': 'none'
        });
        $('#videoKill-' + path.channel.display_name).css({
            'display': 'block'
        });
    });
    $('#videoKill-' + path.channel.display_name).click(function() {
        console.log('VIDEO KILL ' + path.channel.display_name);
        $('#' + path.channel.thisName + '-user-stream').remove();
        $('#top-row-' + path.channel.display_name).html([
            '<img src="' + path.preview.medium + '" alt="Channel preview picture">',
        ].join('\n'));
        $(this).css({
            'display': 'none'
        });
        $('#videoPlay-' + path.channel.display_name).css({
            'display': 'block'
        });
    });

}
/*/ ///////////////////////////////////////

Populate page

////////////////////////////////////////*/
function parse(display, path, response) {
    /*console.log(path);
    console.log('in parse');*/
    if (response.hasOwnProperty('stream') && (response.stream !== null)) {
        $('.link-' + path.channel.display_name).attr("href", "https://www.twitch.tv/" + path.channel.display_name);
        $('#fave-' + path.channel.display_name).addClass('a-online');
        buildCards(display, path, response);
        sort();
    } else if (response.hasOwnProperty('stream') && (response.stream === null)) {
        var channel = response._links.channel;
        var urlArray = channel.split('/');
        var urlName = urlArray[urlArray.length - 1];
        $('#fave-' + urlName).addClass('b-offline');
        $('.link-' + urlName).attr("href", "https://www.twitch.tv/" + urlName);
        sort();
        /*$('#offlineCards').append('<div class="offline-card"><h2>' + urlName + '&nbsp; is OFFLINE</h2><div class="link"><a href="https://www.twitch.tv/' + urlName + '">Go To Channel&nbsp;<i class="fa fa-external-link fa-lg" aria-hidden="true"></i></a></div>');*/
    } else {
        buildCards(display, path, response);
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
callFaveChannels();
