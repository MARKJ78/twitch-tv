var userChannels = [];
if (typeof Cookies('PanelFavorites') === 'undefined') {
    userChannels = ["ShoRyuKen_this", "Bandy_Coot", "Sensible_Socks", "ESL_SC2", "OgamingSC2", "DJTruthsayer", "Crazycanuck1985", "Replicator_", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];
    Cookies.set('PanelFavorites', userChannels);
    console.log("Favorites loaded from defaults");
} else {
    userChannels = Cookies.getJSON('PanelFavorites');
    console.log("Favorites loaded from cookies");
}
/*////////////////////////////////////////
Call API
////////////////////////////////////////*/
function fetch(displayIn, prefix, channel) {
    $.ajax({
        type: 'GET',
        url: 'https://api.twitch.tv/kraken/' + prefix + channel,
        headers: {
            'Client-ID': 'a59qej09oftmvj165yc0tnhll3sxps'
        },
        success: function(response) {
            /*  console.log(response);
              console.log('response in fetch');*/
            var path;
            if (response.hasOwnProperty('stream') && (response.stream !== null)) {
                path = response.stream;
                parse(displayIn, path, response);
            } else if (response.hasOwnProperty('stream') && (response.stream === null)) {
                parse(displayIn, path, response);
            } else if (response.hasOwnProperty('featured') && (response.featured.length !== 0)) {
                for (var i = 0; i < response.featured.length; i++) {
                    var featIsInIndex = userChannels.indexOf(response.featured[i].stream.channel.display_name);
                    if (featIsInIndex == -1) {
                        path = response.featured[i].stream;
                        parse(displayIn, path, response);
                    } else {
                        console.log('The Featured channel ' + response.featured[i].stream.channel.display_name + ' is already in Faves so has not been displayed in the featured panel');
                    }
                }
            } else if (response.hasOwnProperty('streams') && (response.streams.length !== 0)) {
                for (var j = 0; j < response.streams.length; j++) {
                    var searchIsInIndex = userChannels.indexOf(response.streams[j].channel.display_name);
                    if (searchIsInIndex == -1) {
                        path = response.streams[j];
                        parse(displayIn, path, response);
                    } else {
                        console.log('The Featured channel ' + response.streams[j].channel.display_name + ' is already in Faves so has not been displayed in the search panel');
                    }
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
//enter/return key search
$('#searchTerm').keyup(function(event) {
    var term = $('#searchTerm').val();
    var prefix = 'search/streams?q=';
    var displayIn = '.search-cards-container';
    if (event.keyCode == 13) {
        if (term !== '') {
            var clearThis = "#search-' + term + '";
            $('.cards-panel').prepend([
                '<div id="search-' + term + '">',
                '   <h1>Search Results: ' + term + '</h1>',
                '   <a href="#" class="btn" id="removeSearch">Clear This Search</a>',
                '   <hr>',
                '   <div class="search-cards-container" id="searchCards">',
                '   </div>',
                '</div>'
            ].join('\n'));
            $('.search-cards-container').css({
                'display': 'flex'
            });
            $('#removeSearch').click(function() {
                $(this).parent().toggle('blind', 750);
            });
            fetch(displayIn, prefix, term);
            console.log('search entered');
        }
    }
});
////Function called to fill twitch featured channels on load
function callFeaturedChannels() {
    var displayIn = '.featured-container';
    var prefix = 'streams/';
    var channel = 'featured?limit=5';
    $('.cards-panel').append([
        '<h1 class="section-title">Featured on Twitch.tv</h1>',
        '<hr>',
        '<div class="featured-container" id="featureCards">',
        '</div>'
    ].join('\n'));
    fetch(displayIn, prefix, channel);
}
////Function called to fill faves on load
function callFaveChannels() {
    var prefix = 'streams/';
    var displayIn = '.user-cards-container';
    $('.cards-panel').append([
        '<h1 class="section-title">Live Favorites</h1>',
        '<hr>',
        '<div class="user-cards-container" id="userCards">',
        '</div>'
    ].join('\n'));
    for (var i = 0; i < userChannels.length; i++) {
        fetch(displayIn, prefix, userChannels[i]);
        $('#faves-list').append('<li id="fave-' + userChannels[i] + '"><a class="link-' + userChannels[i] + '" href="#">' + userChannels[i] + '</a></li>');
    }
    callFeaturedChannels();
}

function removeFromFaves(name) {
    var i = userChannels.indexOf(name);
    if (i != -1) {
        userChannels.splice(i, 1);
        $('#fave-' + name).remove();
        Cookies.set('PanelFavorites', userChannels);
        console.log(name + " has been removed from Faves");
    }
}

function addToFaves(name) {
    if ($.inArray(name, userChannels) == -1) {
        userChannels.push(name);
        var prefix = 'streams/';
        var displayIn = '.user-cards-container';
        $('#' + name).fadeOut(300, function() {
            $('#' + name).remove();
        });
        fetch(displayIn, prefix, name);
        $('#faves-list').append('<li id="fave-' + name + '"><a class="link-' + name + '" href="https://www.twitch.tv/' + name + '">' + name + '</a></li>');
        Cookies.set('PanelFavorites', userChannels);
        sort();
        console.log(name + ' is now a favorite.');
    } else {
        alert('You already have ' + name + ' as a favorite'); //test
    }
}

function buildCards(displayIn, path, response) {
    $(displayIn).append([
        '<div class="user-card" id="' + path.channel.display_name + '">',
        '  <div class="top-row" id="top-row-' + path.channel.display_name + '"><img src="' + path.preview.medium + '" alt="Channel preview picture"></div>',
        '    <div class="info-row" id="info-row-' + path.channel.display_name + '">',
        '    <i class="fa fa-gamepad fa-lg" aria-hidden="true"></i>',
        '    <div class="game">' + path.game + '</div>',
        '  </div>',
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
        '      <div class="go-channel"><a href="' + path.channel.url + '"><i class="fa fa-twitch" aria-hidden="true"></i>&nbsp;&nbsp;' + path.channel.display_name + '&nbsp;</a></div>',
        '      <div class="player-control">',
        '        <div id="videoPlay-' + path.channel.display_name + '" class="video-play"><i class="fa fa-play" aria-hidden="true"></i></div>',
        '        <div id="videoKill-' + path.channel.display_name + '" class="video-kill"><i class="fa fa-stop" aria-hidden="true"></i></div>',
        '      </div>',
        '    </div>',
        '</div>'
    ].join('\n'));
    $('#' + path.channel.display_name).css({
        'display': 'none'
    });
    $('#' + path.channel.display_name).fadeIn(750);
    $('#videoKill-' + path.channel.display_name).css({
        'display': 'none'
    });

    $('.c-not-found').click(function() {
        var removeName = $(this).contents().text();
        removeFromFaves(removeName);
    });

    $('#heart-' + path.channel.display_name).click(function() {
        var addName = $(this).parent().parent().attr('id');

        addToFaves(addName);
        highlightFave(addName);
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
    highlightFave(path.channel.display_name);

}
/*/ ///////////////////////////////////////

Populate page

////////////////////////////////////////*/
function parse(displayIn, path, response) {
    /*console.log(path);
    console.log('in parse');*/

    if (response.hasOwnProperty('stream') && (response.stream !== null)) {
        $('.link-' + path.channel.display_name).attr("href", "https://www.twitch.tv/" + path.channel.display_name);
        $('#fave-' + path.channel.display_name).addClass('a-online');
        buildCards(displayIn, path, response);
        sort();
    } else if (response.hasOwnProperty('stream') && (response.stream === null)) {
        var channel = response._links.channel;
        var urlArray = channel.split('/');
        var urlName = urlArray[urlArray.length - 1];
        $('#fave-' + urlName).addClass('b-offline');
        $('.link-' + urlName).attr("href", "https://www.twitch.tv/" + urlName);
        sort();
    } else {
        buildCards(displayIn, path, response);
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

function highlightFave(name) {
    if ($.inArray(name, userChannels) != -1) {
        $('#heart-' + name + ' i').css({
            'color': '#6441a4'
        });
    }
}
callFaveChannels();
