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
        success: function(data) {
            parse(data);
        },
        error: function(error) {
            $('#fave-' + channel).addClass('c-not-found');

        },
    });

}

/*/ ///////////////////////////////////////

Populate page

////////////////////////////////////////*/
function parse(response) {
    console.log(response);
    if (response.stream !== null) {
        path = response.stream.channel;
        $('.link-' + path.display_name).attr("href", "https://www.twitch.tv/" + path.display_name);
        $('#fave-' + path.display_name).addClass('a-online');
        sort();
    } else {
        var channel = response._links.channel;
        var urlArray = channel.split('/');
        var urlName = urlArray[urlArray.length - 1];
        $('#fave-' + urlName).addClass('b-offline');
        $('.link-' + urlName).attr("href", "https://www.twitch.tv/" + urlName);
        sort();
        /*$('#offlineCards').append('<div class="offline-card"><h2>' + urlName + '&nbsp; is OFFLINE</h2><div class="link"><a href="https://www.twitch.tv/' + urlName + '">Go To Channel&nbsp;<i class="fa fa-external-link fa-lg" aria-hidden="true"></i></a></div>');*/
    }
    $('#userCards').append('<div class="user-card" id="' + path.display_name + '"><div class="top-row"><div class="on-air-text">On air text</div><div class="game"><p>Playing:&nbsp;<b>' + path.game + '</b></p></div><div class="display-name"><a href="' + path.url + '">' + path.display_name + '</a></div></div><div class="middle-row" id="middle-row-' + path.display_name + '"><div class="logo" id="logo-' + path.display_name + '"><img src="' + path.logo + '"alt="Channel Logo"></div><div class="status">' + path.status + '</div></div><div class="bottom-row"><div class="heart"><p>Favorite</p><i class="fa fa-heart" aria-hidden="true"></i></div><div class="go-channel"><p>Visit Channel</p><i class="fa fa-twitch" aria-hidden="true"></i></div><div class="player-control"><div id="videoPlay-' + path.display_name + '" class="video-play"><p>Stream</p><i class="fa fa-play" aria-hidden="true"></i></div><div id="videoKill-' + path.display_name + '"class="video-kill"><p>Stream</p><i class="fa fa-stop" aria-hidden="true"></i></div></div></div><div>');
    $('#videoKill-' + path.display_name).css({
        'display': 'none'
    });
    $('.on-air-text').html(
        'STREAMING'
    );
    $('#videoPlay-' + path.display_name).on('click', function() {
        console.log(path.display_name);
        var thisName = path.display_name;
        getStream(thisName);
        $(this).css({
            'display': 'none'
        });
        $('#videoKill-' + path.display_name).css({
            'display': 'block'
        });
    });
    $('#videoKill-' + path.display_name).on('click', function() {
        console.log(path.display_name);
        $('#' + path.display_name + '-user-stream').remove();
        $('#middle-row-' + path.display_name).html(' <div class="logo" id="logo-' + path.display_name + '"><img src="' + path.logo + '" alt="Channel Logo"></div>    <div class="status">' + path.status + '</div>');
        $(this).css({
            'display': 'none'
        });
        $('#videoPlay-' + path.display_name).css({
            'display': 'block'
        });
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

function getStream(name) {
    $('#middle-row-' + name).html('<div id="' + name + '-user-stream" class="user-stream"><iframe src="https://player.twitch.tv/?channel={' + name + '}" width="100%" frameborder="0" scrolling="no" allowfullscreen="true"></iframe></div>');
}



callFaveChannels();









//GLOBAL VARIABLES//////////
var path;
var userChannels = [];
if (typeof Cookies('PanelFavorites') === 'undefined') {
    userChannels = ["Jimmy_Savelle", "brunofin", "comster404", "ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];
    Cookies.set('PanelFavorites', userChannels);
    console.log(userChannels + " From Array");
} else {
    userChannels = Cookies.getJSON('PanelFavorites');
    console.log(Cookies.getJSON('PanelFavorites') + " From Cookies");
}

$(document).ready(function() {
    $('.c-not-found').click(function() {
        var removeName = $(this).contents().text();
        removeFromFaves(removeName);
        console.log(userChannels + " fave-list li c-not-found click");
    });

    $('.heart-' + path.display_name).click(function() {
        var addName = $(this).parent().parent().attr('id');
        addToFaves(addName);
        /*console.log($(this).parent().parent().attr('id') + ' is now a favorite.');*/
    });
    /*////////////////////////////////////////
    Embeded video function
    ////////////////////////////////////////*/
    $('#videoPlay-' + path.display_name).click(function() {
        console.log(path.display_name);
        var thisName = path.display_name;
        getStream(thisName);
        $(this).css({
            'display': 'none'
        });
        $('#videoKill-' + path.display_name).css({
            'display': 'block'
        });
    });
    $('#videoKill-' + path.display_name).click(function() {
        console.log(path.display_name);
        $('#' + path.display_name + '-user-stream').remove();
        $('#middle-row-' + path.display_name).html(' <div class="logo" id="logo-' + path.display_name + '"><img src="' + path.logo + '" alt="Channel Logo"></div>    <div class="status">' + path.status + '</div>');
        $(this).css({
            'display': 'none'
        });
        $('#videoPlay-' + path.display_name).css({
            'display': 'block'
        });
    });

    function getStream(name) {
        $('#middle-row-' + name).html('<div id="' + name + '-user-stream" class="user-stream"><iframe src="https://player.twitch.tv/?channel={' + name + '}" width="100%" frameborder="0" scrolling="no" allowfullscreen="true"></iframe></div>');
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

    Make Cards

    ////////////////////////////////////////*/
    function makeCard(path) {
        $('#userCards').append('<div class="user-card" id="' + path.display_name + '">  <div class="top-row">     <div class="on-air-text">On air text</div>       <div class="game"><p>Playing:&nbsp;<b>' + path.game + '</b></p></div>    <div class="display-name"><a href="' + path.url + '">' + path.display_name + '</a></div>  </div>  <div class="middle-row" id="middle-row-' + path.display_name + '">  <div class="logo" id="logo-' + path.display_name + '"><img src="' + path.logo + '" alt="Channel Logo"></div>    <div class="status">' + path.status + '</div>  </div>  <div class="bottom-row">    <div class="heart"><p>Favorite</p><i class="fa fa-heart" aria-hidden="true"></i></div>    <div class="go-channel"><p>Visit Channel</p><i class="fa fa-twitch" aria-hidden="true"></i></div>    <div class="player-control">    <div id="videoPlay-' + path.display_name + '" class="video-play"><p>Stream</p><i class="fa fa-play" aria-hidden="true"></i></div>    <div id="videoKill-' + path.display_name + '" class="video-kill"><p>Stream</p><i class="fa fa-stop" aria-hidden="true"></i></div></div></div><div>');

        $('#videoKill-' + path.display_name).css({
            'display': 'none'
        });
        $('.on-air-text').html(
            'STREAMING'
        );
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
            success: function(data) {
                parse(data);
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

    /*/ ///////////////////////////////////////

    Initiate page load

    ////////////////////////////////////////*/


    callFaveChannels();
}); //end ready
//////////////////////////////////////////////

/////////////////////////////////////////////

///////////////////////////////////////////////
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



//Search Functions
function populateSearch(found) {
    console.log(found.channels);
    console.log(found.channels.length);

}

//go button search
$('#search-channels-btn').click(function() {
    var term = $('#searchTerm').val();
    var prefix = 'search/channels?q=';
    if (term !== '') {
        fetch(prefix, term);
    }
});
//enter/return key search
$('#searchTerm').keyup(function(event) {
    var term = $('#searchTerm').val();
    var prefix = 'search/channels?q=';
    if (event.keyCode == 13) {
        if (term !== '') {
            fetch(prefix, term);
        }
    }
});



else if (Object.prototype.toString.call(response) === '[object Array]') {
    alert('Array! in Parse');
    if (response.channels.length !== 0) {
        for (var i = 0; i < response.channels.length; i++) {
            $('#fave-' + response.channels[i].display_name).addClass('a-online');
            $('.link-' + response.channels[i].display_name).attr("href", "https://www.twitch.tv/" + response.channels[i].display_name);
            $('#userCards').append('<div class="user-card" id="' + response.channels[i].display_name + '">  <div class="top-row">     <div class="on-air-text">On air text</div>       <div class="game"><p>Playing:&nbsp;<b>' + response.channels[i].game + '</b></p></div>    <div class="display-name"><a href="' + response.channels[i].url + '">' + response.channels[i].display_name + '</a></div>  </div>  <div class="middle-row" id="middle-row-' + response.channels[i].display_name + '">  <div class="logo" id="logo-' + response.channels[i].display_name + '"><img src="' + response.channels[i].logo + '" alt="Channel Logo"></div>    <div class="status">' + response.channels[i].status + '</div>  </div>  <div class="bottom-row">    <div class="heart-' + response.channels[i].display_name + '"><p>Favorite</p><i class="fa fa-heart" aria-hidden="true"></i></div>    <div class="go-channel"><p>Visit Channel</p><i class="fa fa-twitch" aria-hidden="true"></i></div>    <div class="player-control">    <div id="videoPlay-' + response.channels[i].display_name + '" class="video-play"><p>Stream</p><i class="fa fa-play" aria-hidden="true"></i></div>    <div id="videoKill-' + response.channels[i].display_name + '" class="video-kill"><p>Stream</p><i class="fa fa-stop" aria-hidden="true"></i></div></div></div><div>');
            $('#videoKill-' + response.channels[i].display_name).css({
                'display': 'none'
            });
            $('.on-air-text').html(
                'STREAMING'
            );
            sort();
        }
    } else {
        alert("Nothing response!");
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









    /*////////////////////////////////////////
    Embeded video function
    ////////////////////////////////////////*/


    $('#videoPlay-' + path.display_name).click(function() {

        console.log(path.display_name);
        var thisName = path.display_name;
        getStream(thisName);
        $(this).css({
            'display': 'none'
        });
        $('#videoKill-' + path.display_name).css({
            'display': 'block'
        });

    });



    $('#videoKill-' + path.display_name).click(function() {

        console.log(path.display_name);
        $('#' + path.display_name + '-user-stream').remove();
        $('#middle-row-' + path.display_name).html(' <div class="logo" id="logo-' + path.display_name + '"><img src="' + path.logo + '" alt="Channel Logo"></div>    <div class="status">' + path.status + '</div>');
        $(this).css({
            'display': 'none'
        });
        $('#videoPlay-' + path.display_name).css({
            'display': 'block'
        });

    });


}

function getStream(name) {
    $('#middle-row-' + name).html('<div id="' + name + '-user-stream" class="user-stream"><iframe src="https://player.twitch.tv/?channel={' + name + '}" width="100%" frameborder="0" scrolling="no" allowfullscreen="true"></iframe></div>');
}





////////////////////////////////////////////////////////////////////////////////15.35




var path;
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
        success: function(data) {
            parse(data);
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


function makeCard() {
    $('#userCards').append('<div class="user-card" id="' + path.display_name + '">  <div class="top-row">     <div class="on-air-text">On air text</div>       <div class="game"><p>Playing:&nbsp;<b>' + path.game + '</b></p></div>    <div class="display-name"><a href="' + path.url + '">' + path.display_name + '</a></div>  </div>  <div class="middle-row" id="middle-row-' + path.display_name + '">  <div class="logo" id="logo-' + path.display_name + '"><img src="' + path.logo + '" alt="Channel Logo"></div>    <div class="status">' + path.status + '</div>  </div>  <div class="bottom-row">    <div class="heart"><p>Favorite</p><i class="fa fa-heart" aria-hidden="true"></i></div>    <div class="go-channel"><p>Visit Channel</p><i class="fa fa-twitch" aria-hidden="true"></i></div>    <div class="player-control">    <div id="videoPlay-' + path.display_name + '" class="video-play"><p>Stream</p><i class="fa fa-play" aria-hidden="true"></i></div>    <div id="videoKill-' + path.display_name + '" class="video-kill"><p>Stream</p><i class="fa fa-stop" aria-hidden="true"></i></div></div></div><div>');

    $('#videoKill-' + path.display_name).css({
        'display': 'none'
    });
    $('.on-air-text').html(
        'STREAMING'
    );
}




/*/ ///////////////////////////////////////

Populate Faves

////////////////////////////////////////*/



function parse(response) {
    console.log(response);
    if (response.stream !== null) {
        path = response.stream.channel;
        $('.link-' + path.display_name).attr("href", "https://www.twitch.tv/" + path.display_name);
        $('#fave-' + path.display_name).addClass('a-online');
        sort();
        makeCard();
        $('.c-not-found').click(function() {
            var removeName = $(this).contents().text();
            removeFromFaves(removeName);
            console.log(userChannels + " fave-list li c-not-found click");
        });
        $('.heart').click(function() {
            var addName = $(this).parent().parent().attr('id');
            addToFaves(addName);
            /*console.log($(this).parent().parent().attr('id') + ' is now a favorite.');*/
        });
    } else {
        var channel = response._links.channel;
        var urlArray = channel.split('/');
        var urlName = urlArray[urlArray.length - 1];
        $('#fave-' + urlName).addClass('b-offline');
        $('.link-' + urlName).attr("href", "https://www.twitch.tv/" + urlName);
        sort();
        /*$('#offlineCards').append('<div class="offline-card"><h2>' + urlName + '&nbsp; is OFFLINE</h2><div class="link"><a href="https://www.twitch.tv/' + urlName + '">Go To Channel&nbsp;<i class="fa fa-external-link fa-lg" aria-hidden="true"></i></a></div>');*/
    }

}



//BUTTON FUNCTIONS////////


/*////////////////////////////////////////

Initiate page load

////////////////////////////////////////*/


callFaveChannels();
