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
    $.ajax({
        type: 'GET',
        url: 'https://api.twitch.tv/kraken/' + prefix + channel,
        headers: {
            'Client-ID': 'a59qej09oftmvj165yc0tnhll3sxps'
        },
        success: function(response) {
            var path;
            if (response.hasOwnProperty('stream') && (response.stream !== null)) {
                path = response.stream.channel;
                console.log('is Not Array in fetch');
                parse(path, response);
            } else if (response.hasOwnProperty('stream') && (response.stream === null)) {
                parse(path, response);
            } else if (response.hasOwnProperty('channels') && (response.channels.length !== 0)) {
                for (var i = 0; i < response.channels.length; i++) {
                    path = response.channels[i];
                    console.log(response);
                    console.log('response in fetch');
                    parse(path, response);
                }
            }
        },
        error: function(error) {
            $('#fave-' + channel).addClass('c-not-found');
        },
    });
}
////Function called to fill faves on load
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
        var prefix = 'streams/';
        fetch(prefix, name);
        sort();
        /* console.log(userChannels + " rmvfunc");*/
    } else {
        alert('You already have ' + name + ' as a favorite'); //test
    }
}
//go button search
$('#search-channels-btn').click(function() {
    var term = $('#searchTerm').val();
    var prefix = 'search/channels?q=';
    if (term !== '') {
        fetch(prefix, term);
        console.log('search clicked');
    }
});
//enter/return key search
$('#searchTerm').keyup(function(event) {
    var term = $('#searchTerm').val();
    var prefix = 'search/channels?q=';
    if (event.keyCode == 13) {
        if (term !== '') {
            fetch(prefix, term);
            console.log('search entered');
        }
    }
});

function buildCards(path, response) {
    $('#userCards').append([
        '<div class="user-card" id="' + path.display_name + '">',
        '    <div class="top-row">',
        '        <div class="on-air-text">On air text</div>',
        '        <div class="game"><p>Playing:&nbsp;<b>' + path.game + '</b></p>',
        '        </div>',
        '        <div class="display-name"><a href="' + path.url + '">' + path.display_name + '</a></div>',
        '    </div>',
        '    <div class="middle-row" id="middle-row-' + path.display_name + '">',
        '        <div class="logo" id="logo-' + path.display_name + '"><img src="' + path.logo + '" alt="Channel Logo"></div>',
        '        <div class="status">' + path.status + '</div>',
        '    </div>',
        '    <div class="bottom-row">',
        '        <div id="heart-' + path.display_name + '"><p>Favorite</p><i class="fa fa-heart" aria-hidden="true"></i></div>',
        '        <div class="go-channel"><p>Visit Channel</p><i class="fa fa-twitch" aria-hidden="true"></i></div>',
        '        <div class="player-control">',
        '            <div id="videoPlay-' + path.display_name + '" class="video-play"><p>Stream</p><i class="fa fa-play" aria-hidden="true"></i></div>',
        '            <div id="videoKill-' + path.display_name + '" class="video-kill"><p>Stream</p><i class="fa fa-stop" aria-hidden="true"></i></div>',
        '        </div>',
        '    </div>',
        '</div>'
    ].join('\n'));
    $('#videoKill-' + path.display_name).css({
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

    $('#heart-' + path.display_name).click(function() {
        var addName = $(this).parent().parent().attr('id');
        addToFaves(addName);
        /*console.log($(this).parent().parent().attr('id') + ' is now a favorite.');*/
    });
    /*////////////////////////////////////////
    Embeded video function
    ////////////////////////////////////////*/
    $('#videoPlay-' + path.display_name).click(function() {
        console.log('VIDEO PLAY ' + path.display_name);
        $('#middle-row-' + path.display_name).html([
            '<div id="' + path.display_name + '-user-stream" class="user-stream">',
            '   <iframe src="https://player.twitch.tv/?channel={' + path.display_name + '}" width="100%" frameborder="0" scrolling="no" allowfullscreen="true"></iframe>',
            '</div>'
        ].join('\n'));
        $(this).css({
            'display': 'none'
        });
        $('#videoKill-' + path.display_name).css({
            'display': 'block'
        });
    });
    $('#videoKill-' + path.display_name).click(function() {
        console.log('VIDEO KILL ' + path.display_name);
        $('#' + path.thisName + '-user-stream').remove();
        $('#middle-row-' + path.display_name).html([
            '        <div class="logo" id="logo-' + path.display_name + '"><img src="' + path.logo + '" alt="Channel Logo"></div>',
            '        <div class="status">' + path.status + '</div>',
        ].join('\n'));
        $(this).css({
            'display': 'none'
        });
        $('#videoPlay-' + path.display_name).css({
            'display': 'block'
        });
    });

}
/*/ ///////////////////////////////////////

Populate page

////////////////////////////////////////*/
function parse(path, response) {
    /*console.log(path);
    console.log('in parse');*/
    if (response.hasOwnProperty('stream') && (response.stream !== null)) {
        $('.link-' + path.display_name).attr("href", "https://www.twitch.tv/" + path.display_name);
        $('#fave-' + path.display_name).addClass('a-online');
        buildCards(path, response);
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
        buildCards(path, response);
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
