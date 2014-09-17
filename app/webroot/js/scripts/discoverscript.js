var flag = true;
var stop_suggestion = false;
var suggestion_start = 0;
$(document).ready(function() {
    disable();
    getuserdata();
    if ($('#title').hasClass('suggestion_page'))
    {   
        $('.rightbar').remove();
        getSuggestions(suggestion_start,null);
    }
    else if ($('#title').hasClass('search_page'))
    {
        getSuggestions(3,null);
        console.log("in search");
         $("#searchPageOutput").fadeIn("fast");
        $(".pagemore").fadeIn();
        $(".pagemore").html("<span class='span10'>RETRIEVING RESULTS</span><img src='" + BASE_URL + "img/ajax-loader.gif' />");
        var keyword=$('#keyword').text();
        console.log(keyword);
        searchPeople(keyword,"page");
    }
    
    $(window).scroll(function() {
        if ($(window).scrollTop() + $(window).height() === $(document).height()) {
            {
                if (stop_suggestion !== true)
                    loadmore();
            }
        }
    });
});

function disable() {
    $('#changeAvatar').hide();
    $('#new-tweetbox').hide();
    $('#home').removeClass('active');
    $('#discover').addClass('active');
    $('#me').removeClass('active');
    
}

function getuserdata()
{
    $.ajax({
        type: "POST",
        url: BASE_URL + "user_details/getProfile/",
        data: {id: user_id}
    }).done(function(data) {
        console.log(data);
        if (data.status === "SUCCESS")
        {
            $profile = data.data.UserDetail;
            $('#prof-fullname > b').text($profile.fullname);
            $("#prof-fullname").attr("href", BASE_URL + $profile.username);
            $('#prof-username').html('@' + $profile.username);
            $('#prof-bio > i').html($profile.bio);
            $('#prof-tweets-count').text($profile.no_of_tweets);
            $('#prof-following-count').text($profile.no_of_following);
            $('#prof-followers-count').text($profile.no_of_followers);
            $profilepic = "<img src='" + imgURL($profile.username) + "' class='img-circle'><br>";
            $('#changeAvatar').before($profilepic);
            userprofile = $profile;
            if($profile.resetpassword){
                $('#resetPasswordModal').modal({
                  backdrop: 'static',
                  keyboard: false
                }); 
                $('#resetPasswordModal').modal({show: true});
            }
        }
        else
        {
            console.log(data['message']);
        }
    });
}
function loadmore() {
    $('#progress').html("<img src='" + BASE_URL + "img/ajax-loader.gif'>");
    if (flag === true)
    {
        console.log("loading more");
        getSuggestions(suggestion_start, null);
    }
    else
    {
        $('#progress').html("");
        $msg = '<center><p id="emptymsg"> No more suggestions to display </p></center> ';
        if($('#suggestion_page').find('#emptymsg').length !== 0)
            $("#progress").append($msg);
        stop_suggestion = true;
    }
}