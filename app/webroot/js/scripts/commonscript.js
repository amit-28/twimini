var skipped = new Array();
var skippedindex = 0;
var notificationflag = false;
$(document).ready(function() {

    $('#progress').html("<img src='" + BASE_URL + "img/tweets-loading.gif'>");
    $('#suggestion-progress').html("<img src='" + BASE_URL + "img/tweets-loading.gif'>");
    hoverToggle();
    //trigger search
    $("#SearchBar").on("keyup", function() {
        $("#searchOutput").fadeIn("fast");
        // Show Loading
        $(".more").fadeIn();
        $(".more").html("<span class='span10'>RETRIEVING RESULTS</span><img src='" + BASE_URL + "img/ajax-loader.gif' />");
        searchPeople($(this).val(), "bar");
    });

    $(document).click(function(e) {
        var clicked = $(e.target);
        if (!clicked.hasClass(".searchOutput")) {
            $("#searchOutput").fadeOut("fast");
            $("#SearchBar").val("");
        }

    });
    //search end


    getNotificationsCount("new");

    $("#notifybell").on("click", function() {
        //console.log("click on notification");
        if ($('#noofnotifications').text() !== "") {
            notificationflag = true;
            $('#noofnotifications').html("");
            $("#notificationOutput").fadeIn("fast");
            getNotifications("new", null);
        }
        else {
            getNotificationsCount("new");
            $("#notificationOutput").fadeIn("fast");
        }

    });

    $('.tabbable').find('a[href="#tweets-tab"]').click(function() {
        pollID = setInterval('pollnewtweets()', 15000);
    });
    $('.tabbable').find('a[href="#following-tab"]').click(function() {
        clearInterval(pollID); //Stop polling tweets
        if ($('#following-tab > .row').children().length > 0)
        {
            $('#following-tab > .row').children().remove();
        }
        if (userprofile.no_of_following > 0)
        {
            $('#following-progress').html("<img src='" + BASE_URL + "img/tweets-loading.gif'>");
            getFollowing();
        }
        else
        {
            $msg = "<p align='center' id='emptymsg'>Not following anyone yet<p>"
            $('#following-tab > .row').append($msg);
        }
    });

    $('.tabbable').find('a[href="#followers-tab"]').click(function() {
        //$('#followers-tab').html("<center><img src='" + BASE_URL + "img/tweets-loading.gif'></center>");
        clearInterval(pollID);
        if ($('#followers-tab > .row').children().length > 0)
        {
            $('#followers-tab > .row').children().remove();
        }
        if (userprofile.no_of_followers > 0)
        {
            $('#followers-progress').html("<img src='" + BASE_URL + "img/tweets-loading.gif'>");
            getFollowers();
        }
        else
        {
            $msg = "<p align='center' id='emptymsg'>No followers yet<p>"
            $('#followers-tab > .row').append($msg);
        }
    });

    $(document).click(function(e) {
        var clicked = $(e.target);
        if (!clicked.hasClass(".notificationOutput") && clicked.attr('id') !== "notifybell") {
            $("#notificationOutput").fadeOut("fast");
            notificationflag = false;
        }
    });

    //notification end

     $(document).bind("click", function(e) {

        if (e.target.id === "liketweet")
        {
            var tweetid = e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.id;
            var orgid = e.target.parentNode.parentNode.parentNode.parentNode.attributes.dataorgid.value;
            var rstatus= e.target.parentNode.parentNode.parentNode.parentNode.attributes.datastatus.value;
            var retweeterid;
            console.log(rstatus);
            if(rstatus==="true"){
                retweeterid= e.target.parentNode.parentNode.parentNode.parentNode.attributes.dataname.value;
            }else{
                retweeterid=-1;
            }
            console.log(retweeterid);
            //var pointer="#"+tweetid+'-likecount';
            //var curlikecount=$(pointer).innerHTML;

            console.log("tweetid: " + tweetid);
            console.log("orgid: " + orgid);
            console.log("user id : " + user_id);
            $.ajax({
                type: "POST",
                url: BASE_URL + "likes/tweetlike",
                data: {userid: user_id, tweet_id: tweetid, notified_id: orgid,retweeter_id: retweeterid,fullname:userprofile.fullname,username:userprofile.username}
            }).done(function(data) {
                console.log("waiting for data");
                console.log(data);
                if (data['status'] === "SUCCESS") {
                    //var pointer=tweetid+"like";
                    var classpointer = tweetid + "like";
                    //$('.' + classpointer).innerHTML;
                    $('.' + classpointer).each(function() {
                        var curcount = parseInt($(this).html()) + 1;
                        $(this).html(curcount);
                        console.log("curcount: " + (curcount));
                    });
                    var likestatus = "likestatus" + tweetid;
                    $('.' + likestatus).each(function() {
                        $(this).attr('title', 'Unlike');
                        $(this).children().removeAttr('id');
                        $(this).children().removeClass('glyphicon-thumbs-up');
                        $(this).children().attr('id', 'unliketweet');
                        $(this).children().addClass('glyphicon-thumbs-down');
                    });

                } else {
                    console.log(data['message']);
                }
            });

        }
        if (e.target.id === "unliketweet")
        {
            var tweetid = e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.id;
            var orgid = e.target.parentNode.parentNode.parentNode.parentNode.attributes.dataorgid.value;
            var rstatus= e.target.parentNode.parentNode.parentNode.parentNode.attributes.datastatus.value;
            var retweeterid;
            console.log(rstatus);
            if(rstatus==="true"){
                retweeterid= e.target.parentNode.parentNode.parentNode.parentNode.attributes.dataname.value;
            }else{
                retweeterid=-1;
            }
            //var pointer="#"+tweetid+'-likecount';
            //var curlikecount=$(pointer).innerHTML;
            console.log("retweeterid: " + retweeterid);
            console.log("tweetid: " + tweetid);
            console.log("orgid: " + orgid);
            console.log("user id : " + user_id);
            $.ajax({
                type: "POST",
                url: BASE_URL + "likes/tweetunlike",
                data: {userid: user_id, tweet_id: tweetid, notified_id: orgid,retweeter_id: retweeterid}
            }).done(function(data) {
                console.log("waiting for data");
                console.log(data);
                if (data['status'] === "SUCCESS") {

                    //var pointer=tweetid+"like";
                    var classpointer = tweetid + "like";
                    //$('.' + classpointer).innerHTML;
                    $('.' + classpointer).each(function() {
                        var curcount = parseInt($(this).html()) - 1;
                        $(this).html(curcount);
                        console.log("curcount: " + (curcount));
                    });
                    var likestatus = "likestatus" + tweetid;
                    $('.' + likestatus).each(function() {
                        $(this).attr('title', 'Like');
                        $(this).children().removeAttr('id');
                        $(this).children().removeClass('glyphicon-thumbs-down');
                        $(this).children().attr('id', 'liketweet');
                        $(this).children().addClass('glyphicon-thumbs-up');
                    });
                } else {
                    console.log(data['message']);
                }
            });

        }
        if (e.target.id == "retweet")
        {
            var tweetid = e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.id;
            var orgid = e.target.parentNode.parentNode.parentNode.parentNode.attributes.dataorgid.value;
            var rstatus = e.target.parentNode.parentNode.parentNode.parentNode.attributes.datastatus.value;

            console.log("tweetid: " + tweetid);
            console.log("orgid: " + orgid);
            console.log("rstatus: " + rstatus);
            if (rstatus === "true") {
                var retweeterid = e.target.parentNode.parentNode.parentNode.parentNode.attributes.dataname.value;
                var tweeterRetweeter = $('.' + tweetid + "tweeterRetweeter").html().substring(13);
            }
            else {
                var retweeterid = null;
                var tweeterRetweeter = userprofile.fullname;
            }
            console.log(retweeterid);
            //tweeterRetweeter,tweettxt

            /*var letsee=e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;*/
            //console.log(userprofile);

            //incomplete calling
            $.ajax({
                type: "POST",
                url: BASE_URL + "tweet_details/postretweet",
                data: {userid: user_id, tweet_id: tweetid, orgid: orgid, InterID: retweeterid,fullname:tweeterRetweeter,username:userprofile.username}
            }).done(function(data) {
                console.log("waiting for data");
                console.log(data);
                if (data['status'] === "SUCCESS")
                {

                    console.log(data);
                    //tweeterRetweeter,originatorname,originatorusername,tweettxt
                    var classpointer = tweetid + "tweet";

                    var tweettime = new Date();
                    var tweettxt = $('.' + tweetid + "tweettxt").html();
                    var originatorname = $('.' + tweetid + "orgname").html();
                    var originatorusername = $('.' + tweetid + "orgusername").html().substring(2);


                    retweetcount = $('.' + classpointer).html();
                    var classpointerlike = tweetid + "like";
                    tweetlike = $('.' + classpointerlike).html();
                    likestatus = $('#likestatus' + tweetid).children().attr('id');
                    console.log(likestatus);
                    if (likestatus === 'liketweet')
                        var liketoggle = '<li class="actions"><button type="button" data-toggle="tooltip" title="Like" class="actionButton likestatus' + tweetid + '"><i class="glyphicon glyphicon-thumbs-up" id="liketweet"></i></button>';
                    else
                        var liketoggle = '<li class="actions"><button type="button" data-toggle="tooltip" title="Unlike" class="actionButton likestatus' + tweetid + '"><i class="glyphicon glyphicon-thumbs-down" id="unliketweet"></i></button>';
                    //var retweet = '<div class="media tweetbox" id="' + tweetid + '" style="background : aliceblue"><a class="pull-left" href="#"><img class="media-object tweet-thumb" src=' + imgURL(orgid) + ' alt="Firstname Lastname">  </a><div class="media-body"> <label class="' + tweetid + 'tweeterRetweeter">Retweeted by ' + tweeterRetweeter + '</label>   <h5 class="media-heading"><a href="#" alt="Fullname" class="' + tweetid + 'orgname" >' + originatorname + '</a><small class="' + tweetid + 'orgusername"> @' + originatorusername + '</small></h5>  <text class"' + tweetid + 'tweettxt">' + tweettxt + '</text><div class="tweetactions" dataorgid="' + orgid + '"datastatus="' + rstatus + '" dataname="' + user_id + '">     <ul class="pull-right">       <li class="tweettime"><i class="glyphicon glyphicon-time" data-toggle="tooltip" title="' + tweettime + '"></i></li>   ' + liketoggle + '     <span class="likecount ' + tweetid + 'like" >' + tweetlike + '</span></li>        <li class="actions" ><button type="button" data-toggle="tooltip" title="Retweet" class="actionButton"><i class="glyphicon glyphicon-share-alt" id="retweet"></i></button><span class="retweetcount ' + tweetid + 'tweet">' + retweetcount + '</span></li>      </ul>    </div>  </div></div>';

                    //$("#tweet-wall").prepend(retweet);
                    pollnewtweets();

                    $('.' + classpointer).each(function() {
                        var curcount = parseInt($(this).html()) + 1;
                        $(this).html(curcount);
                        console.log("curcount: " + (curcount));
                    });


                } else {
                    console.log(data['message']);
                }
            });

        }
    });
    
    $(document).on('click', '.followbtn', function() { //Follow,Unfollow events
        var btn = $(this);
        var status = btn.children('.btntext-display').text();

        if (status === 'Unfollow') {
            var id = $(this).attr('id');
            id = parseInt(id.replace(/\D/g, ''));
            console.log(userprofile);
            console.log("using");
            $.ajax({
                type: 'POST',
                url: BASE_URL + 'connections/unfollow',
                data: {followerid: id}
            }).done(function(data) {
                if (data.status === 'SUCCESS')
                {
                    console.log(data.status);
                    btn.removeClass('btn-danger');
                    btn.removeClass('btn-primary');
                    btn.addClass('btn-default');
                    btn.children('#follow-text').addClass('active');
                    btn.children('#following-text').removeClass('active');
                    btn.children('#following-text').css('display', 'none');
                    btn.children('#unfollow-text').css('display', 'none');
                    btn.children('#follow-text').css('display', 'block');
                    btn.children('#unfollow-text').removeClass('btntext-display');
                    btn.children('#follow-text').addClass('btntext-display');
                }
                else
                {
                    console.log(data['message']);
                    alert("Error in unfollow");
                }
            });
        }
        var btn = $(this);
        if (status === 'Follow') {

            var id = $(this).attr('id');

            id = parseInt(id.replace(/\D/g, ''));

            $.ajax({
                type: 'POST',
                url: BASE_URL + 'connections/follow',
                data: {followingid: id, fullname: userprofile.fullname, username: userprofile.username}
            }).done(function(data) {
                console.log(data);
                if (data.status === 'SUCCESS')
                {

                    btn.removeClass('btn-default');
                    btn.addClass('btn-primary');
                    btn.children('#follow-text').removeClass('btntext-display');
                    btn.children('#follow-text').removeClass('active');
                    btn.children('#following-text').addClass('active');
                    btn.children('#follow-text').css('display', 'none');
                    btn.children('#following-text').css('display', 'block');
                    if ($('#user' + id).length > 0)
                        btn = $('#user' + id);
                    if (btn.parent().parent().hasClass('suggestion')) {
                        fetchNext(btn.parent().parent(), "followed");
                    }
                    if(userprofile.id==user_id) {
                        var updated_no_following=parseInt($('#prof-following-count').text())+1;
                        $('#prof-following-count').text(updated_no_following);
                        userprofile.no_of_following=""+updated_no_following;
                    }
                }
            });
        }
    });

    $(document).on('click', '.skip', function() { //Skipping suggestions
        console.log('clicked');
        fetchNext($(this).parent().parent(), "skipped");
    });

    $('#logout').click(function() {
        console.log("logging out");
        $.ajax({
            type: "POST",
            url: BASE_URL + "user_details/logout"
        }).done(function(data) {
            console.log(data);
            if (data['status'] === "SUCCESS") {
                //checkCookie();
                window.location.assign(BASE_URL);
            }
        });
    });

});

function hoverToggle() {
    $(document).on({
        mouseenter: function() {
            var status = $(this).children('.active').text();
            if (status === 'Following') {
                $(this).children('#following-text').css('display', 'none');
                $(this).removeClass('btn-primary');
                $(this).addClass('btn-danger');
                $(this).children('#unfollow-text').addClass('btntext-display');
                $(this).children('#unfollow-text').css('display', 'block');
            }
        },
        mouseleave: function() {
            var status = $(this).children('.active').text();
            if (status === 'Following') {
                $(this).removeClass('btn-danger');
                $(this).addClass('btn-primary');
                $(this).children('.btntext.active').css('display', 'block');
                $(this).children('#unfollow-text').css('display', 'none');
                $(this).children('#unfollow-text').removeClass('.btntext-display');
            }
        }
    }, '.followbtn');
}
function getNotifications(type, start) {

    $.ajax({
        type: "POST",
        url: BASE_URL + "notifications/showNotifications",
        data: {id: user_id, start: start, type: type},
        cache: false
    }).done(function(response) {
        console.log(response);
        if (response.data !== null)
        {
            $result = "";
            $count = 0;

            $(response.data).each(function(index, obj) {
                $style = "";
                var notification = obj['Notification'];
                if (notification['notification_status'] == 0) {
                    $style = 'style="background:aliceblue"';
                }

                if (notification['message'] === "like") {
                    $result = $result + "<li class='notifyResultList pull-left' id=notification" + notification['id'] + " " + $style + " datastatus=" + notification['notification_status'] + "><a href='/" + notification['notifier_username'] + "'>" + notification['notifier_fullname'] + "</a> liked your tweet</li>";
                }
                else if (notification['message'] === "retweet") {
                    $result = $result + "<li class='notifyResultList pull-left' id=notification" + notification['id'] + " " + $style + " datastatus=" + notification['notification_status'] + "><a href='/" + notification['notifier_username'] + "'>" + notification['notifier_fullname'] + "</a> retweeted your tweet</li>";
                }
                else if (notification['message'] === "follow") {
                    $result = $result + "<li class='notifyResultList pull-left' id=notification" + notification['id'] + " " + $style + " datastatus=" + notification['notification_status'] + "><a href='/" + notification['notifier_username'] + "'>" + notification['notifier_fullname'] + "</a> followed you</li>";
                }
            });
            $(".NotifyResults").html($result);
            readNotifications(true);
        }
        else
        {
            $(".NotifyResults").html("There are no notifications");
        }
    });


}
function getNotificationsCount(type) {

    $.ajax({
        type: "POST",
        url: BASE_URL + "notifications/countnotifications",
        data: {id: user_id, type: type},
        cache: false
    }).done(function(response) {
        if (response.status === "SUCCESS") {
            console.log(response.data);
            if (response.data[0]['Notification']['notification_status'] == "1") //OLD notifications are present
            {
                $(".seemore").show();
                $(".seemore").html('<a href="' + BASE_URL + 'notifications/">Show older</a>');
                if (response.data.length > 1)//New notifications are present
                {
                    $("#noofnotifications").html(response.data[1][0]['total']); //New notifications count
                }
                else
                {
                    $(".NotifyResults").html("No new notifications");
                }
            }
            else ///Only New notifications are present
            {
                $("#noofnotifications").html(response.data[0][0]['total']);
                $(".seemore").hide();
            }

        } else { //No notifications for user

            $(".NotifyResults").html(response.message);
            $(".seemore").hide();
        }
    });
}
function readNotifications($flag) {

    var readnotificationsids = [];
    if ($flag)
    {
        console.log($('.NotifyResults').children());
        $('.NotifyResults').children().each(function() {

            if ($(this)[0].attributes.datastatus.value === "false") {
                readnotificationsids.push(parseInt($(this)[0].id.substring(12)));
            }
        });
        console.log("new:" + readnotificationsids);

    }
    else {

        var hr = document.createElement("hr");
        $('#notification-wall').children().each(function() {
            if (!$(this).hasClass("hr")) {
                if ($(this)[0].attributes.datastatus.value === "false") {
                    readnotificationsids.push(parseInt($(this)[0].id.substring(12)));
                }
            }
        });

        console.log(readnotificationsids);
    }
    $.ajax({
        type: "POST",
        url: BASE_URL + "notifications/markreadnotifications",
        data: {id: user_id, readnotificationsids: readnotificationsids},
        cache: false
    }).done(function(response) {
        if (response.status === "SUCCESS") {
            console.log("notification upadated");
            getNotificationsCount("new");
        } else {
            console.log("notification upadate failed");
        }
    });
    //getNotificationsCount();
}

function pollingnotification() {
    $.ajax({
        url: BASE_URL + 'tweet_details/poll',
        type: 'GET',
    }).done(function(data) {
        if (data['status'] === "NEW")
        {
            //$('.pollresult').css('display','block');
            $('.pollresult').html("Show " + data['message']);
            $('.pollresult').fadeIn('slow');
        }
    });
}




function searchPeople(keyword, display)
{
    if (keyword !== "") {
        console.log(display);
        $.ajax({
            type: "POST",
            url: BASE_URL + "user_details/search",
            data: {keyword: keyword, display: display},
            cache: false
        }).done(function(response) {
            $(".more").fadeOut('fast');
            $(".pagemore").fadeOut('fast');
            if (display === "bar")
            {

                console.log(response);
                if (response.data.length > 0)
                {
                    $result = "";
                    $(response.data).each(function(index, obj) {
                        var user = obj['user_details'];
                        $result = $result + "<li class='resultList'><a href='" + BASE_URL + user.username + "' class='userLink'><span class='span1'><img class='searchImg' src='" + imgURL(user.username) + "'><span class='span2'><span class='span3'><span class='span4'>" + user.fullname + "</span><span class='span5'>@" + user.username + "</span></span></span></span></a></li>";
                    });
                    $(".Results").html($result);

                    if (response.data.length === 10)
                    {
                        $(".more").fadeIn();
                        $(".more").html('<a href="' + BASE_URL + 'discover/' + keyword + '">See more results for "' + keyword + '"</a>');
                    }
                }
                else
                {
                    $(".Results").html("There are no results for " + keyword);
                }
            }
            else if (display === "page") {

                console.log(response);
                if (response.data.length > 0)
                {
                    $result = "";
                    $(response.data).each(function(index, obj) {
                        var user = obj['user_details'];
                        if (obj[0]['isFollower'] == 1 && obj[0]['followstatus'] == 1)
                            $followstatus = "You follow each other"
                        else if (obj[0]['isFollower'] == 1)
                            $followstatus = "Follows you";
                        else
                            $followstatus = "";
                        if (user.bio === null)
                            user.bio = "";
                        $result = "<div class='resultList col-sm-6 col-md-6'> <div class='thumbnail'> <img src=" + imgURL(user.username) + " class='users-thumb' alt='" + user.fullname + "'> <div class='caption'> <a href='" + BASE_URL + user.username + "' class='profile-name'>" + user.fullname + "</a> <div class='profile-baseinfo'> @<span class='profile-username' id='profile-username'>" + user.username + "</span><span class='follow-status'>" + $followstatus + "</span></div> <p class='profile-bio text-centered'>" + user.bio + "</p> </div> <button class='btn btn-primary followbtn' id='searchPageUser" + user.id + "'><span class='btntext' id='follow-text'>Follow</span><span class='btntext' id='following-text'>Following</span><span class='btntext' id='unfollow-text'>Unfollow</span></button> </div> </div>";
                        //$result = "<li class='resultList'><a href='" + BASE_URL + user.username + "' class='userLink'><span class='span1'><img class='searchImg' src='" + imgURL(user.username) + "'><span class='span2'><span class='span3'><span class='span4'>" + user.fullname + "</span><span class='span5'>@" + user.username + "</span></span></span></span></a></li>";
                        $("#searchPageOutput").append($result);
                        if (obj[0]['followstatus'] == 1)
                        {
                            $('#searchPageUser' + user.id).children('#following-text').addClass('active');
                            $('#searchPageUser' + user.id).children('#following-text').css('display', 'block');
                        }
                        else
                        {
                            $('#searchPageUser' + user.id).children('#follow-text').addClass('active');
                            $('#searchPageUser' + user.id).children('#follow-text').css('display', 'block');
                            $('#searchPageUser' + user.id).removeClass("btn-primary");
                            $('#searchPageUser' + user.id).addClass("btn-default");
                            $('#searchPageUser' + user.id).children('#follow-text').addClass("btntext-display");
                        }
                    });

                }
                else
                {
                    $("#searchPageOutput").append("There are no results for '" + keyword + "'");
                }
            }
        });
    }
    else {
        $("#searchOutput").fadeOut("fast");
    }
}

function fetchNext(element, type) //fetch next suggestion
{
    var id = [];
    element.fadeOut('3000', function() {
        if (type === "skipped")
        {
            var currentskip = element.children().find('.suggestion-btn').attr('id');
            skipped[skippedindex] = parseInt(currentskip.replace(/\D/g, ''));
            skippedindex = skippedindex + 1;
        }
        element.remove();
        if ($('#suggestion-box').children().length === 2 && !$('#suggestion-box').siblings().hasClass('suggestion_page'))
        {

            $('.suggestion-btn').each(function(i) {
                console.log(i);
                var userid = $(this).attr('id');
                id[i] = parseInt(userid.replace(/\D/g, ''));
            });
            console.log(id);
            index = id.length;
            $.each(skipped, function(i) {
                console.log(skipped);
                id[index] = skipped[i];
                index = index + 1;
            });
            console.log(id);
            getSuggestions(1, id);
        }
        else if ($('#suggestion-box').children().length === 0)
        {
            $msg = "<p align='center'>No people to suggest<p>"
            $('#suggestion-box').append($msg);
        }
    });
}

function getSuggestions(limit, id) //retrieve suggestions of specified limit and skipping users with specified id
{
    $.ajax({
        type: 'POST',
        url: BASE_URL + 'user_details/suggest',
        data: {limit: limit, id: id}
    }).done(function(data) {
        $('#suggestion-box center').remove();
        if (data.status === 'SUCCESS')
        {
            console.log(data);
            if (data.data.length < 10 && data.data.length > 0)
            {
                flag = false;
            }
            if ($('#suggestion-box').children().length > 0 && limit !== 1 && !$('#suggestion-box').siblings().hasClass('suggestion_page'))
            {
                $('#suggestion-box').children().remove();
            }
            if (data.data.length > 0)
            {

                $.each(data.data, function(index, obj) {
                    user = obj['user_details'];
                    if (user.bio === null)
                        user.bio = "";
                    if ($('.suggestion_page').length > 0)
                        $newSuggestion = $("<div class='suggestion col-sm-6 col-md-6'> <div class='thumbnail'> <img src=" + imgURL(user.username) + " class='users-thumb' alt='" + user.fullname + "'> <div class='caption'> <a href='" + BASE_URL + user.username + "' class='profile-name'>" + user.fullname + "</a> <div class='profile-baseinfo'> @<span class='profile-username' id='profile-username'>" + user.username + "</span></div> <p class='profile-bio text-centered'>" + user.bio + "</p> </div> <button class='btn btn-primary followbtn suggestion-btn' id='user" + user.id + "'><span class='btntext' id='follow-text'>Follow</span><span class='btntext' id='following-text'>Following</span><span class='btntext' id='unfollow-text'>Unfollow</span></button> </div> </div>");
                    else
                        $newSuggestion = "<div class='suggestion'><div class='media'><button type='button' class='close skip'>×</button><img class='media-object suggestion-pic pull-left' src='" + imgURL(user.username) + "' alt='" + user.fullname + "' <div class='media-body'><a href='" + BASE_URL + user.username + "' class='profile-name media-heading'>" + user.fullname + "</a><div class='profile-baseinfo'>@<span class='profile-username'>" + user.username + "</span></div><div class='suggestion-bio'><p class='profile-bio'>" + user.bio + "</p></div><button class='btn btn-default followbtn suggestion-btn' id='user" + user.id + "'><span class='btntext' id='follow-text'>Follow</span><span class='btntext' id='following-text'>Following</span><span class='btntext' id='unfollow-text'>Unfollow</span></button></div></div></div>";
                    $('#suggestion-box').append($newSuggestion);
                    $('#user' + user.id).children('#follow-text').addClass('active');
                    $('#user' + user.id).children('#follow-text').css('display', 'block');
                    $('#user' + user.id).removeClass("btn-primary");
                    $('#user' + user.id).addClass("btn-default");
                    $('#user' + user.id).children('#follow-text').addClass("btntext-display");

                });
                if ($('legend').hasClass('suggestion_page'))
                    suggestion_start = suggestion_start + data.data.length;

            }
        }
        else
        {
            if ($('#suggestion-box').children().length === 0)
            {
                $msg = "<p align='center' id='emptymsg'>" + data['message'] + "<p>"
                $('#suggestion-box').append($msg);
                stop_suggestion = true;
            }
            if (limit == 10) {
                $('#progress').html("");
                $msg = '<center><p id="emptymsg"> No more suggestions to display </p></center> ';
                $("#progress").append($msg);
                stop_suggestion = true;
            }
        }
    });
}

function imgURL(username)
{
    var url = BASE_URL + "img/upload/" + username + ".jpg";
    return url;
}
function removeCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
}
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ')
            c = c.substring(1);
        if (c.indexOf(name) !== -1)
            return c.substring(name.length, c.length);
    }
    return "";
}

function checkCookie() {
    var user = getCookie("user_id");

    if (user !== "" || user !== null) {
        removeCookie("user_id");
    }

}
