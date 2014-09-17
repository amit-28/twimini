var stopnotifications = false;
var flagnotifications = false;
var notificationstart = 0;
var notificationcount=10;
$(document).ready(function() {
    getuserdata();
    getSuggestions(3, null);
    getnotifications();
});
/*$(document).change(function() {
 console.log("document closing");
 alert("document closing");
 });
 */

$(window).scroll(function() {
    if ($(window).scrollTop() + $(window).height() === $(document).height()) {
        if (stopnotifications !== true)
        {
            console.log("scroll :" + $(window).scrollTop());
            getnotifications();

        }
    }
});

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
            console.log("intialing");
            userprofile = $profile;
            if ($profile.resetpassword) {
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
function getnotifications() {

    //console.log("notifications called");
    //$(".NotifyResults").html("There are no notifications");
    //flagnotifications = false;
    console.log("called 10 records");
    $.ajax({
        type: "POST",
        url: BASE_URL + "notifications/showNotifications",
        data: {id: user_id, start: notificationstart, type : "all"},
        cache: false
    }).done(function(response) {
        //console.log(response);
        //console.log(user_id);
        //console.log(response.data);
        if (response.data !== null)
        {
            //console.log("reached length: "+response.data.length);
            //console.log("notification wall reached");
            $resultwall = "";
            $count = 0;
            flagnotifications = true;
            notificationstart=notificationstart+response.data.length;
            console.log("notificationstart: "+notificationstart);
            console.log("response.data.length: "+response.data.length);
            $(response.data).each(function(index, obj) {
                $style = "";
                //console.log(obj);
                //var notification = obj['user_details'];
                //$result = $result + "<li class='resultList'><a href='" + BASE_URL + user.username + "' class='userLink'><span class='span1'><img class='searchImg' src='" + imgURL(user.username) + "'><span class='span2'><span class='span3'><span class='span4'>" + user.fullname + "</span><span class='span5'>@" + user.username + "</span></span></span></span></a></li>";
                var notification = obj['Notification'];
                if (notification['notification_status'] == 0) {
                    //$count = $count + 1;                            //notification count
                    $style = 'style="background:aliceblue"';
                }


                //console.log(notification);
                if (notification['message'] === "like") {
                    $wallresult = "<H4 id=notification" + notification['id'] + " " + $style + " datastatus=" + notification['notification_status'] + "><a href='/" + notification['notifier_username'] + "'>" + notification['notifier_fullname'] + "</a> liked your tweet</H4><HR class='hr'>";
                }
                else if (notification['message'] === "retweet") {
                    $wallresult = "<H4 id=notification" + notification['id'] + " " + $style + " datastatus=" + notification['notification_status'] + "><a href='/" + notification['notifier_username'] + "'>" + notification['notifier_fullname'] + "</a> retweeted your tweet</H4><HR class='hr'>";
                }
                else if (notification['message'] === "follow") {
                    $wallresult = "<H4 id=notification" + notification['id'] + " " + $style + " datastatus=" + notification['notification_status'] + "><a href='/" + notification['notifier_username'] + "'>" + notification['notifier_fullname'] + "</a> followed you</H4><HR class='hr'>";
                }
                $("#notification-wall").append($wallresult);


            });
            // setTimeout(function() {
            //     readNotifications(false);
            // }, 1000);
        }
        else
        {
            //console.log("reached");
            if (flagnotifications) {
                $("#notification-wall").append("<p id='emptymsg' align='center'>No more notifications</p>");
                stopnotifications=true;
            }
            else
                $("#notification-wall").append("<p id='emptymsg' align='center'>There are no notifications</p>");
            //$(".NotifyResults").html("There are no notifications");
        }
    });

}
