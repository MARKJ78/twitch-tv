var userChannels = [];
if (typeof Cookies('PanelFavorites') === 'undefined') {
    userChannels = ["shoryuken_this", "bandy_coot", "sensible_socks", "esl_sc2", "ogamingsc2", "djtruthsayer", "crazycanuck1985", "replicator_", "cretetion", "freecodecamp", "storbeck", "habathcx", "robotcaleb", "noobs2ninjas"];
    Cookies.set('PanelFavorites', userChannels);
    console.log("Favorites loaded from defaults");
} else {
    userChannels = Cookies.getJSON('PanelFavorites');
    console.log("Favorites loaded from cookies");
}



/*////////////////////////////////////////
Call API
////////////////////////////////////////*/

function request(url, channel) {
    return new Promise(function(resolve) {
        var rawData, data;
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.onload = function() {
            if (request.status >= 200 && request.status < 400) {
                rawData = this.response;
                response = JSON.parse(this.response);
                resolve(response);
            } else {
                $('#fave-' + channel).addClass('c-not-found');
            }
        };
        request.send();
    });
}

function fetch(displayIn, url, channel) {
    request(url, channel).then(function(response) {
        parse(displayIn, response);
    });


}

//enter/return key search
$('#searchTerm').keyup(function(event) {
    var prefix = 'search/streams/?q=';
    var term = $('#searchTerm').val();
    var displayIn = '.search-cards-container';
    var url = 'https://api.twitch.tv/kraken/search/streams/?q=' + term + '&client_id=a59qej09oftmvj165yc0tnhll3sxps';
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
            fetch(displayIn, url);
            console.log('search entered');
        }
    }
});
////Function called to fill twitch featured channels on load
function callFeaturedChannels() {
    var displayIn = '.featured-container';
    var prefix = 'streams/';
    var channel = 'featured/';
    var limit = '?limit=5';
    var url = 'https://api.twitch.tv/kraken/streams/featured?limit=5&client_id=a59qej09oftmvj165yc0tnhll3sxps';
    $('.cards-panel').append([
        '<h1 class="section-title">Featured on Twitch.tv</h1>',
        '<hr>',
        '<div class="featured-container" id="featureCards">',
        '</div>'
    ].join('\n'));
    fetch(displayIn, url, channel);
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
        var channel = userChannels[i];
        var url = 'https://api.twitch.tv/kraken/streams/' + channel + '/?client_id=a59qej09oftmvj165yc0tnhll3sxps';
        fetch(displayIn, url, channel);
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
    console.log(name + ' in addToFaves function');
    if ($.inArray(name, userChannels) == -1) {
        $('.featured-container > #' + name).fadeOut(300, function() {
            $('.featured-container > #' + name).remove();
        });
        userChannels.push(name);
        var url = 'https://api.twitch.tv/kraken/streams/' + name + '/?client_id=a59qej09oftmvj165yc0tnhll3sxps';
        var displayIn = '.user-cards-container';

        fetch(displayIn, url, name);
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
        '<div class="user-card" id="' + path.channel.name + '">',
        '  <div class="top-row" id="top-row-' + path.channel.name + '"><img src="' + path.preview.large + '" alt="Channel preview picture"></div>',
        '    <div class="info-row" id="info-row-' + path.channel.name + '">',
        '    <i class="fa fa-gamepad fa-lg" aria-hidden="true"></i>',
        '    <div class="game">' + path.game + '</div>',
        '  </div>',
        '  <div class="middle-row" id="middle-row-' + path.channel.name + '">',
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
        '      <div id="heart-' + path.channel.name + '"><i class="fa fa-heart" aria-hidden="true"></i></div>',
        '      <div class="go-channel"><a href="' + path.channel.url + '"><i class="fa fa-twitch" aria-hidden="true"></i>&nbsp;&nbsp;' + path.channel.display_name + '&nbsp;</a></div>',
        '      <div class="player-control">',
        '        <div id="videoPlay-' + path.channel.name + '" class="video-play"><i class="fa fa-play" aria-hidden="true"></i></div>',
        '        <div id="videoKill-' + path.channel.name + '" class="video-kill"><i class="fa fa-stop" aria-hidden="true"></i></div>',
        '      </div>',
        '    </div>',
        '</div>'
    ].join('\n'));
    $('#' + path.channel.name).css({
        'display': 'none'
    });
    $('#' + path.channel.name).fadeIn(750);
    $('#videoKill-' + path.channel.name).css({
        'display': 'none'
    });

    $('.c-not-found').click(function() {
        var removeName = $(this).contents().text();
        removeFromFaves(removeName);
    });

    $('#heart-' + path.channel.name).click(function() {
        var addName = $(this).parent().parent().attr('id');
        addToFaves(addName);
        highlightFave(addName);
    });


    /*////////////////////////////////////////
    Embeded video function
    ////////////////////////////////////////*/
    $('#videoPlay-' + path.channel.name).click(function() {
        console.log('VIDEO PLAY ' + path.channel.name);
        var videoWidth = $('#top-row-' + path.channel.name).width();
        var videoHeight = $('#top-row-' + path.channel.name).height();
        $('#top-row-' + path.channel.name).html([
            '<div id="' + path.channel.name + '-user-stream" class="user-stream"></div>'
        ].join('\n'));
        var options = {
            width: videoWidth,
            height: videoHeight,
            channel: path.channel.name,
            playsinline: true,
        };
        var player = new Twitch.Player(path.channel.name + '-user-stream', options);
        player.setVolume(0.5);

        $(this).css({
            'display': 'none'
        });
        $('#videoKill-' + path.channel.name).css({
            'display': 'block'
        });
    });
    $('#videoKill-' + path.channel.name).click(function() {
        console.log('VIDEO KILL ' + path.channel.name);
        $('#' + path.channel.thisName + '-user-stream').remove();
        $('#top-row-' + path.channel.name).html([
            '<img src="' + path.preview.large + '" alt="Channel preview picture">',
        ].join('\n'));
        $(this).css({
            'display': 'none'
        });
        $('#videoPlay-' + path.channel.name).css({
            'display': 'block'
        });
    });
    highlightFave(path.channel.name);

}
/*/ ///////////////////////////////////////

Populate page

////////////////////////////////////////*/
function parse(displayIn, response) {
    /*console.log(response);
    console.log('in parse');*/
    var path;
    if (response.hasOwnProperty('stream') && (response.stream !== null)) {
        path = response.stream;
        $('.link-' + path.channel.name).attr("href", "https://www.twitch.tv/" + path.channel.name);
        $('#fave-' + path.channel.name).addClass('a-online');
        buildCards(displayIn, path, response);
        sort();
    } else if (response.hasOwnProperty('stream') && (response.stream === null)) {
        var channel = response._links.channel;
        var urlArray = channel.split('/');
        var urlName = urlArray[urlArray.length - 1];
        $('#fave-' + urlName).addClass('b-offline');
        $('.link-' + urlName).attr("href", "https://www.twitch.tv/" + urlName);
        sort();
    } else if (response.hasOwnProperty('featured') && (response.featured.length !== 0)) {
        for (var i = 0; i < response.featured.length; i++) {
            var featIsInIndex = userChannels.indexOf(response.featured[i].stream.channel.name);
            if (featIsInIndex == -1) {
                path = response.featured[i].stream;
                buildCards(displayIn, path, response);
            } else {
                console.log('The Featured channel ' + response.featured[i].stream.channel.name + ' is already in Faves so has not been displayed in the featured panel');
            }
        }
    } else if (response.hasOwnProperty('streams') && (response.streams.length !== 0)) {
        for (var j = 0; j < response.streams.length; j++) {
            var searchIsInIndex = userChannels.indexOf(response.streams[j].channel.name);
            if (searchIsInIndex == -1) {
                path = response.streams[j];
                buildCards(displayIn, path, response);
            } else {
                console.log('The Featured channel ' + response.streams[j].channel.name + ' is already in Faves so has not been displayed in the search panel');
            }
        }
    } else if (response.hasOwnProperty('streams') && (response.streams.length === 0)) {
        $('#fave-' + response.streams.channel.name).addClass('c-not-found');
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
    console.log(name + ' in highlight function');
    if ($.inArray(name, userChannels) != -1) {
        $('#heart-' + name + ' i').css({
            'color': '#6441a4'
        });
    }
}
callFaveChannels();
/*detectIE();*/
