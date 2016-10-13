//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
//                                                                                                  //
//                            0.      Global                                                 //
//                                                                                                  //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
//console.log('App init'); //test
var userChannels = [];
if (typeof Cookies('PanelFavorites') === 'undefined') { //if there is no cookie, load faves from default array
    userChannels = ["shoryuken_this", "bandy_coot", "sensible_socks", "esl_sc2", "ogamingsc2", "djtruthsayer", "crazycanuck1985", "replicator_", "cretetion", "freecodecamp", "storbeck", "habathcx", "robotcaleb", "noobs2ninjas"];
    Cookies.set('PanelFavorites', userChannels);
    console.log("Favorites loaded from defaults");
} else { //load useras faves from cookie if available.
    userChannels = Cookies.getJSON('PanelFavorites');
    console.log("Favorites loaded from cookies");
}

//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
//                                                                                                  //
//                               3.     API Call                                                    //
//                                                                                                  //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////


/*////////////////////////////////////////
API call set up and execute
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
                console.log(channel + ' fetch request successful');
                /*console.log(response);
                console.log(' in request');*/
            } else {
                // if result is an error, (single channel only) turn icon red in faves list
                $('#fave-' + channel).addClass('c-not-found');
                console.log(channel + ' is no longer with us, please remove the channel from your favorites list.');
            }
        };
        request.send();
    });
}


/*////////////////////////////////////////
fetch recieves requests from other functions, forwards to request(API CALL) and then sends returned response data to parse
////////////////////////////////////////*/
function fetch(displayIn, url, channel) {
    console.log('fetch ' + channel);
    request(url, channel).then(function(response) {
        parse(displayIn, response);
    });
}

//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
//                                                                                                  //
//                 2.    Get Data to populate page and faves list                                   //
//                                                                                                  //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////

/*////////////////////////////////////////
Function called to fill twitch featured after faves functions are complete
////////////////////////////////////////*/
function callFeaturedChannels() {
    console.log('Featured Channels called'); //test
    //setup API call details
    var displayIn = '.featured-container';
    var prefix = 'streams/';
    var channel = 'featured/';
    var limit = '?limit=5'; //5 results only
    var url = 'https://api.twitch.tv/kraken/streams/featured?limit=5&client_id=a59qej09oftmvj165yc0tnhll3sxps';
    //set up container for results
    $('.cards-panel').append([
        '<h1 class="section-title">Featured on Twitch.tv</h1>',
        '<hr/>',
        '<div class="featured-container" id="featureCards">',
        '</div>'
    ].join('\n'));
    //initiate API call
    fetch(displayIn, url, channel);
}


function populateFavesList(channel) {
    //Append each channel from faves list into list as a list item
    $('#faves-list').append([
        '<li class="fave" id="fave-' + channel + '">',
        '<a class="link-' + channel + '" href="#">' + channel + '</a>',
        '<span class="delete-fave" id="delete-' + channel + '">',
        '<i class="fa fa-trash-o" aria-hidden="true"></i>',
        '</span>',
        '</li>'
    ].join('\n'));
    //Delete/bin button setup
    $('#delete-' + channel).click(function() {
        var removeName = channel;
        /*console.log('click on bin');
        console.log(channel);
        console.log(removeName);*/
        removeFromFaves(removeName);
    });
}

/*////////////////////////////////////////
Function called to fill faves on load
////////////////////////////////////////*/
function callFaveChannels() {
    var displayIn = '.user-cards-container';
    console.log('faveChannels called'); //test
    $('.cards-panel').append([
        '<h1 class="section-title">Live Favorites</h1>',
        '<hr/>',
        '<div class="user-cards-container" id="userCards">',
        '</div>'
    ].join('\n'));
    //Loop through faves array -  for each user:
    for (var i = 0; i < userChannels.length; i++) {
        //set up API call
        var channel = userChannels[i];
        var url = 'https://api.twitch.tv/kraken/streams/' + channel + '/?client_id=a59qej09oftmvj165yc0tnhll3sxps';
        //initiate API call
        fetch(displayIn, url, channel);
        //initiate faves list entry
        populateFavesList(userChannels[i]);
    }
    //now go get the Twitch.tv featured channels
    callFeaturedChannels();
}

/*////////////////////////////////////////
Search Twitch.tv function
////////////////////////////////////////*/
$('#searchTerm').keyup(function(event) {
    //setup API call
    var prefix = 'search/streams/?q=';
    var term = $('#searchTerm').val();
    var displayIn = '.search-cards-container';
    var url = 'https://api.twitch.tv/kraken/search/streams/?q=' + term + '&client_id=a59qej09oftmvj165yc0tnhll3sxps';
    if (event.keyCode == 13) { //when search term is entered
        if (term !== '') {
            //clear search box
            var clearThis = "#search-' + term + '";
            //setup search results container
            $('.cards-panel').prepend([
                '<div id="search-' + term + '">',
                '   <h1 class="section-title">Search Results: ' + term + '</h1>',
                '   <a href="#" class="btn" id="removeSearch">Clear This Search</a>',
                '   <hr>',
                '   <div class="search-cards-container" id="searchCards">',
                '   </div>',
                '</div>'
            ].join('\n'));
            //unhide
            $('.search-cards-container').css({
                'display': 'flex'
            });
            //re-hide panel on smaller screens
            if ($(window).width() <= 1024) {
                $('.channel-panel').addClass('closed');
                $('.cards-panel').addClass('closed');
            }
            //setup remove search button (only clears this search)
            $('#removeSearch').click(function() {
                $(this).parent().toggle('blind', 750);
            });
            //initiate API call
            fetch(displayIn, url, term);
            console.log('Searching twitch for ' + term);
        }
    }
});

//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
//                                                                                                  //
//                                user modify favorites functions                                   //
//                                                                                                  //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////


function removeFromFaves(channel) {
    var i = userChannels.indexOf(channel);
    if (i != -1) { //check user is in faves
        //remove name from array
        userChannels.splice(i, 1);
        Cookies.set('PanelFavorites', userChannels);
        //fadeout remove card and name from list
        $('#fave-' + channel).fadeOut(100, function() {
            $('#fave-' + channel).remove();
        });
        $('#' + channel).fadeOut(100, function() {
            $('#' + channel).remove();
        });
        //infromation
        console.log(channel + ' has been removed from Faves');
        alertUser('<p>' + channel + ' has been successfully removed from your favorites list</p>');
    }
}

function addToFaves(name) {
    //  console.log(name + ' in addToFaves function');
    if ($.inArray(name, userChannels) == -1) { //check not already in faves. Stops player controls not hiding on duplicate cards
        $('.featured-container > #' + name).fadeOut(100, function() { //remove card from dom
            $('.featured-container > #' + name).remove();
        });
        $('.search-cards-container > #' + name).fadeOut(100, function() { //remove card from dom
            $('.search-cards-container > #' + name).remove();
        });
        //add to faves array
        userChannels.push(name);
        Cookies.set('PanelFavorites', userChannels);
        //Add back into page in faves container
        var url = 'https://api.twitch.tv/kraken/streams/' + name + '/?client_id=a59qej09oftmvj165yc0tnhll3sxps';
        var displayIn = '.user-cards-container';
        fetch(displayIn, url, name);
        //add to faves list and sort list accordingly
        populateFavesList(name);
        sort();
        //infromation
        console.log(name + ' is now a favorite.');
        alertUser('<p>' + name + ' has been successfully added to your favorites list</p>');
    } else {
        alertUser('You already have ' + name + ' as a favorite'); //test
    }
}




//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
//                                                                                                  //
//                               5.   Build cards and their related functions                       //
//                                                                                                  //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////

/*////////////////////////////////////////
Request and display iframe when play is clicked
////////////////////////////////////////*/
function makePlayer(channel) {
    /*var videoWidth = $('#top-row-' + channel).width();
    var videoHeight = $('#top-row-' + channel).height();*/
    $('#top-row-' + channel).html([
        '<div id="' + channel + '-user-stream" class="user-stream"></div>'
    ].join('\n'));
    //player
    var options = {
        /*width: videoWidth,
        height: videoHeight,*/ //removed to allow flex
        channel: channel,
        playsinline: true,
    };
    var player = new Twitch.Player(channel + '-user-stream', options); //where to put the vid
    player.setVolume(0.5);
    console.log(channel + ' - Video Created');

    //OLD PLAYER
    /*  $('#top-row-' + channel).html([
          '<iframe',
          '  src="http://player.twitch.tv/?channel=' + channel + '"',
          '  frameborder="0"',
          '  scrolling="no"',
          '  allowfullscreen="true">',
          '</iframe>'
      ].join('\n'));*/

}


function buildCards(displayIn, path, response) {
    //build each card
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
    /*////////////////////////////////////////
    Fade cards in
    ////////////////////////////////////////*/
    $('#' + path.channel.name).css({
        'display': 'none'
    });
    $('#' + path.channel.name).fadeIn(750);
    /*////////////////////////////////////////
    Set up faves button
    ////////////////////////////////////////*/
    $('#heart-' + path.channel.name).click(function() {
        var addName = $(this).parent().parent().attr('id');
        addToFaves(addName);
        highlightFave(addName);
    });
    /*////////////////////////////////////////
    Hide stop button under play button
    ////////////////////////////////////////*/
    $('#videoKill-' + path.channel.name).css({
        'display': 'none'
    });
    /*////////////////////////////////////////
    Set up embeded video functionality
    ////////////////////////////////////////*/
    $('#videoPlay-' + path.channel.name).click(function() {
        makePlayer(path.channel.name);
        console.log('VIDEO PLAY ' + path.channel.name);
        //Hide play button
        $(this).css({
            'display': 'none'
        });
        //present stop button
        $('#videoKill-' + path.channel.name).css({
            'display': 'block'
        });
    });
    $('#videoKill-' + path.channel.name).click(function() {
        console.log('VIDEO KILL ' + path.channel.name);
        //remove video and display channel preview
        $('#' + path.channel.name + '-user-stream').remove();
        $('#top-row-' + path.channel.name).html([
            '<img src="' + path.preview.large + '" alt="Channel preview picture">',
        ].join('\n'));
        //hide stop button
        $(this).css({
            'display': 'none'
        });
        //present play button
        $('#videoPlay-' + path.channel.name).css({
            'display': 'block'
        });
    });

    highlightFave(path.channel.name);
    console.log('Channel card for ' + path.channel.name + ' successfully built');
}
//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
//                                                                                                  //
//                                4.    Parse Results of API call                                   //
//                                                                                                  //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////

function parse(displayIn, response) {
    /*console.log(response);
    console.log('in parse');*/
    // path is required because search, featured and favorites all have differing responses
    var path;
    if (response.hasOwnProperty('stream') && (response.stream !== null)) { //if channel is online {object}
        path = response.stream;
        $('.link-' + path.channel.name).attr("href", "https://www.twitch.tv/" + path.channel.name);
        $('#fave-' + path.channel.name).addClass('a-online');
        console.log(path.channel.name + ' is online - card build requested');
        buildCards(displayIn, path, response);
        sort();
    } else if (response.hasOwnProperty('stream') && (response.stream === null)) { //if channel is online {object}
        var channel = response._links.channel;
        var urlArray = channel.split('/');
        var urlName = urlArray[urlArray.length - 1];
        $('#fave-' + urlName).addClass('b-offline');
        $('.link-' + urlName).attr("href", "https://www.twitch.tv/" + urlName);
        console.log(urlName + ' is offline.');
        sort();
    } else if (response.hasOwnProperty('featured') && (response.featured.length !== 0)) { //if featured channel [array]
        for (var i = 0; i < response.featured.length; i++) {
            var featIsInIndex = userChannels.indexOf(response.featured[i].stream.channel.name);
            if (featIsInIndex == -1) {
                path = response.featured[i].stream;
                buildCards(displayIn, path, response);
                console.log(path.channel.name + ' is online');
            } else {
                //stop featured channel appearing if already loaded. Stops player controls not hiding on duplicate cards
                console.log('The Featured channel ' + response.featured[i].stream.channel.name + ' is already in Faves so has not been displayed in the featured panel');
            }
        }
    } else if (response.hasOwnProperty('streams') && (response.streams.length !== 0)) { //if searched channel is online [array]
        for (var j = 0; j < response.streams.length; j++) {
            var searchIsInIndex = userChannels.indexOf(response.streams[j].channel.name);
            if (searchIsInIndex == -1) { //if not already displayed
                path = response.streams[j];
                buildCards(displayIn, path, response);
            } else { //if already displayed.Stops player controls not hiding on duplicate cards
                console.log('The Featured channel ' + response.streams[j].channel.name + ' is already in Faves so has not been displayed in the search panel');
            }
        }
    } else if (response.hasOwnProperty('streams') && (response.streams.length === 0)) { // Nothing found in search
        alertUser('Nothing found for that search, try again');
        console.log('Nothing found for that search');

    } else { //catch all
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
/*////////////////////////////////////////
Change color of heart/fave if present in faves list
////////////////////////////////////////*/
function highlightFave(name) {
    /*  console.log(name + ' in highlight function');*/
    if ($.inArray(name, userChannels) != -1) {
        $('#heart-' + name + ' i').css({
            'color': '#6441a4'
        });
    }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
//                                                                                                  //
//                                   6.  Post populate functions                                    //
//                                                                                                  //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////


/*////////////////////////////////////////
User alerts
////////////////////////////////////////*/

function alertUser(message) {
    $('.user-alert').fadeIn(function() {
        $('.user-alert').html(message);
    });
    $('.user-alert').delay(3000).fadeOut(function() {
        $('.user-alert').css({
            'display': 'none'
        });
        $('.user-alert').html('');
    });
}

/*////////////////////////////////////////
Menu handle function
////////////////////////////////////////*/

$('#channel-panel-handle i').click(function() {
    $('.channel-panel').toggleClass('closed');
    $('.cards-panel').toggleClass('closed');
});

/*////////////////////////////////////////
menu panel function
////////////////////////////////////////*/
if ($(window).width() > 1024) {
    $('.channel-panel').removeClass('closed');
    $('.cards-panel').removeClass('closed');
} else if ($(window).width() <= 1024) {
    $('.channel-panel').addClass('closed');
    $('.cards-panel').addClass('closed');
}


$(window).resize(function() {
    if ($(window).width() > 1024) {
        $('.channel-panel').removeClass('closed');
        $('.cards-panel').removeClass('closed');
    } else if ($(window).width() <= 1024) {
        $('.channel-panel').addClass('closed');
        $('.cards-panel').addClass('closed');
    }
});

//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
//                                                                                                  //
//                                1.  Initialise page loaded                                        //
//                                                                                                  //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////

callFaveChannels();
