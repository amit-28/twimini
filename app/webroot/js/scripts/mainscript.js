var start = 0;
var count = 25;
var userprofile = new Array();
var load_flag = true;
var stop = false;
var pollID;
$(document).ready(function() {
    //scripts for home page 
    $('#uploadAvatarForm').remove();
    $('#me').removeClass('active');
    $('#home').addClass('active');
    pollID = setInterval('pollnewtweets()', 15000);
     
     $('#changeAvatar').hide();
    //functions to call on load
    getuserdata();

    loadTweets("initial","home");
    
    getSuggestions(3, null);

    $(window).scroll(function() {
        if ($(window).scrollTop() + $(window).height() === $(document).height() && $('#tweets-tab').hasClass('active')) {
            if (stop !== true)
            {
                console.log("scroll :"+$(window).scrollTop());
                loadmore();
                
            }
        }
    });

    $("[data-toggle=tooltip]").tooltip();

    $('#changeAvatar').click(function() {
        $(this).css('display', 'none');
        $('#uploadAvatarForm').css('display', 'block');
        $("#uploadsubmit").attr("disabled", true);
    });

    var bioEdited = false;
    var validated = false;
    var editImgValidated = false;
    var file = null;
    $('#UploadMyimage,#uploadEdit').change(function() {
        console.log("binding");
        file = $(this)[0].files[0];
        var imgStatus = validateImg(file);
        if (imgStatus === true)
        {
            if ($(this).attr('id') === 'UploadMyimage')
            {
                $("#uploadsubmit").removeAttr("disabled");
                $("#uploadsubmit").addClass("btn-success");
                validated = true;
            }
            else
            {
                $("#saveEdits").removeAttr("disabled");
                editImgValidated = true;
            }

        }
        else
        {
            if (imgStatus === 1)
                alert('Invalid File Extension! Please choose valid picture file');
            else
                alert('File is too big..Choose file having size less than 5MB');
        }
    });

    $('#saveEdits').click(function() {

        var formData = new FormData();
        formData.append("data[Upload][myimage]", $("#uploadEdit")[0].files[0]);
        console.log(new FormData(this));
        if (editImgValidated === true)
        {
            $.ajax({
                type: 'post',
                url: BASE_URL + 'uploads/index',
                data: formData,
                contentType: false,
                cache: false,
                processData: false
            }).done(function(data) {
                console.log(data);
                if (data.status === 'SUCCESS')
                {
                    console.log(data.message);
                }
                else
                {
                    console.log(data.message);
                }
            });
        }
        if (bioEdited === true)
        {
            var newBio = $('#editBio').val();
            console.log(newBio);
            $.ajax({
                type: 'post',
                url: BASE_URL + 'user_details/editBio',
                data: {bio: newBio}
            }).done(function(data) {
                if (data.status === 'SUCCESS')
                {
                    console.log(data.message);
                }
                else
                {
                    console.log(data.message);
                }
            });
        }
        $('#editClose').trigger('click');
        //location.reload(true);
    });

    $('#uploadAvatarForm').on('submit', function(e) {
        //files=$("#UploadMyimage")[0].files;
        e.preventDefault();
        console.log(new FormData(this));
        console.log(validated);
        if (file !== null && validated === true)
        {
            console.log("uploading");
            $.ajax({
                type: 'POST',
                url: BASE_URL + 'uploads/index',
                data: new FormData(this),
                contentType: false,
                cache: false,
                processData: false
            }).done(function(data) {
                console.log(data);
                if (data['status'] === 'SUCCESS')
                {
                    $('#changeAvatar').css('display', 'block');
                    $('#uploadAvatarForm').css('display', 'none');
                    //window.location.reload(true);
                    console.log(data.message);
                }
                else
                {
                    console.log(data.message);
                }
            });
            //location.reload(true);
        }
    });

    $('#editProfile').on('click', function() {
        $.ajax({
            type: 'GET',
            url: BASE_URL + 'user_details/getBio'
        }).done(function(data) {
            console.log(data);
            if (data.status === 'SUCCESS')
            {
                var userBio = data['data'][0]['user_details']['bio'];
                //console.log(userBio.length);
                if (userBio !== null)
                {
                    $('#editBio').val(userBio);
                    $('#editBio').parent().siblings("#textcount").text(160 - userBio.length);
                }
                else
                {
                    $('#editBio').val('');
                    $('#editBio').parent().siblings("#textcount").text("160");
                }
            }
            else
            {
                console.log(data.message);
            }

        });
        $('#editModal').modal({show: true});

    });

    $('#editClose').on('click', function() {
        $('#editForm')[0].reset();
        $("#saveEdits").attr("disabled", true);
    });

    $('#tweetlink').click(function() {
        var href=$('#me_link').attr('href');
        window.location.href = href;
    });
    $('#followinglink').click(function() {
        localStorage.setItem("clicked", "following");
        var href=$('#me_link').attr('href');
        window.location.href = href;
    });
    $('#followerslink').click(function() {
        localStorage.setItem("clicked", "followers");
        var href=$('#me_link').attr('href');
        window.location.href = href;
    });

    $('#new-tweetmsg,#editBio').keyup(function() {
        var msglength = $(this).val().length;
        $(this).parent().siblings('#textcount').text(160 - msglength);
        if ($(this).attr('id') === 'editBio')
        {
            bioEdited = true;
            $("#saveEdits").removeAttr("disabled");
        }
    });

    $('#new-tweetbtn').click(function() {
        console.log("Posting tweet");
        var tweet_text = $('#new-tweetmsg').val();
        if(tweet_text!==""){

            $.ajax({
                type: "POST",
                url: BASE_URL + "tweet_details/posttweet",
                data: {tweet_text: tweet_text}
            }).done(function(data) {
                console.log("ajax over");
                if (data.status === "SUCCESS")
                {
                    console.log(data['message']);
                    $(':input[id="new-tweetmsg"]').val(null);
                    $('#postAlert').modal({show: true}).delay(3000).fadeOut();
                    setTimeout(function() {
                        $('.postclose').trigger('click');
                    }, 3000);
                    //tweet_id,fullname,username
                    //adding tweet on the wall
                    var tweettime = new Date();
                    var tid = data['data']['tweet_id'];
                    var tweeterRetweeter = data['data']['fullname'];
                    var tweeterusername = data['data']['username'];

                    //var tweet = '<div class="media tweetbox" id="' + tid + '" style="background : aliceblue"><a class="pull-left" href="#"><img class="media-object tweet-thumb" src=' + imgURL(user_id) + ' alt="Firstname Lastname">  </a><div class="media-body">    <h5 class="media-heading"><a href="#" alt="Fullname" class="' + tid + 'orgname">' + tweeterRetweeter + '</a><small class="' + tid + 'orgusername"> @' + tweeterusername + '</small></h5>  <text class="' + tid + 'tweettxt">' + tweet_text + '</text><div class="tweetactions" dataorgid="' + user_id + '" datastatus="false" >     <ul class="pull-right">       <li class="tweettime"><i class="glyphicon glyphicon-time" data-toggle="tooltip" title="' + tweettime + '"></i></li>        <li class="actions"><button type="button" data-toggle="tooltip" title="Like" class="actionButton"><i class="glyphicon glyphicon-thumbs-up" id="liketweet"></i></button><span class="likecount ' + tid + 'like">0</span></li>        <li class="actions" ><button type="button" data-toggle="tooltip" title="Retweet" class="actionButton" ><i class="glyphicon glyphicon-share-alt" id="retweet"></i></button><span class="retweetcount ' + tid + 'tweet">0</span></li>      </ul>    </div>  </div></div>';


                   // $("#tweet-wall").prepend(tweet);
                   pollnewtweets();
                    $('#emptymsg').hide();
                    console.log(data);

                    //updating profile    
                    tweetcount=parseInt($('#prof-tweets-count').html());
                    $('#prof-tweets-count').html(tweetcount+1);
                }
                else
                {
                    console.log(data['message']);
                    alert("Tweet couldnt be posted");
                }
            });
        }
    });

    
//    $(document).bind("click", function(e) {
//
//        if (e.target.id === "liketweet")
//        {
//            var tweetid = e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.id;
//            var orgid = e.target.parentNode.parentNode.parentNode.parentNode.attributes.dataorgid.value;
//            var rstatus= e.target.parentNode.parentNode.parentNode.parentNode.attributes.datastatus.value;
//            var retweeterid;
//            console.log(rstatus);
//            if(rstatus==="true"){
//                retweeterid= e.target.parentNode.parentNode.parentNode.parentNode.attributes.dataname.value;
//            }else{
//                retweeterid=-1;
//            }
//            console.log(retweeterid);
//            //var pointer="#"+tweetid+'-likecount';
//            //var curlikecount=$(pointer).innerHTML;
//
//            console.log("tweetid: " + tweetid);
//            console.log("orgid: " + orgid);
//            console.log("user id : " + user_id);
//            $.ajax({
//                type: "POST",
//                url: BASE_URL + "likes/tweetlike",
//                data: {userid: user_id, tweet_id: tweetid, notified_id: orgid,retweeter_id: retweeterid,fullname:userprofile.fullname,username:userprofile.username}
//            }).done(function(data) {
//                console.log("waiting for data");
//                console.log(data);
//                if (data['status'] === "SUCCESS") {
//                    //var pointer=tweetid+"like";
//                    var classpointer = tweetid + "like";
//                    //$('.' + classpointer).innerHTML;
//                    $('.' + classpointer).each(function() {
//                        var curcount = parseInt($(this).html()) + 1;
//                        $(this).html(curcount);
//                        console.log("curcount: " + (curcount));
//                    });
//                    var likestatus = "likestatus" + tweetid;
//                    $('.' + likestatus).each(function() {
//                        $(this).attr('title', 'Unlike');
//                        $(this).children().removeAttr('id');
//                        $(this).children().removeClass('glyphicon-thumbs-up');
//                        $(this).children().attr('id', 'unliketweet');
//                        $(this).children().addClass('glyphicon-thumbs-down');
//                    });
//
//                } else {
//                    console.log(data['message']);
//                }
//            });
//
//        }
//        if (e.target.id === "unliketweet")
//        {
//            var tweetid = e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.id;
//            var orgid = e.target.parentNode.parentNode.parentNode.parentNode.attributes.dataorgid.value;
//            var rstatus= e.target.parentNode.parentNode.parentNode.parentNode.attributes.datastatus.value;
//            var retweeterid;
//            console.log(rstatus);
//            if(rstatus==="true"){
//                retweeterid= e.target.parentNode.parentNode.parentNode.parentNode.attributes.dataname.value;
//            }else{
//                retweeterid=-1;
//            }
//            //var pointer="#"+tweetid+'-likecount';
//            //var curlikecount=$(pointer).innerHTML;
//            console.log("retweeterid: " + retweeterid);
//            console.log("tweetid: " + tweetid);
//            console.log("orgid: " + orgid);
//            console.log("user id : " + user_id);
//            $.ajax({
//                type: "POST",
//                url: BASE_URL + "likes/tweetunlike",
//                data: {userid: user_id, tweet_id: tweetid, notified_id: orgid,retweeter_id: retweeterid}
//            }).done(function(data) {
//                console.log("waiting for data");
//                console.log(data);
//                if (data['status'] === "SUCCESS") {
//
//                    //var pointer=tweetid+"like";
//                    var classpointer = tweetid + "like";
//                    //$('.' + classpointer).innerHTML;
//                    $('.' + classpointer).each(function() {
//                        var curcount = parseInt($(this).html()) - 1;
//                        $(this).html(curcount);
//                        console.log("curcount: " + (curcount));
//                    });
//                    var likestatus = "likestatus" + tweetid;
//                    $('.' + likestatus).each(function() {
//                        $(this).attr('title', 'Like');
//                        $(this).children().removeAttr('id');
//                        $(this).children().removeClass('glyphicon-thumbs-down');
//                        $(this).children().attr('id', 'liketweet');
//                        $(this).children().addClass('glyphicon-thumbs-up');
//                    });
//                } else {
//                    console.log(data['message']);
//                }
//            });
//
//        }
//        if (e.target.id == "retweet")
//        {
//            var tweetid = e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.id;
//            var orgid = e.target.parentNode.parentNode.parentNode.parentNode.attributes.dataorgid.value;
//            var rstatus = e.target.parentNode.parentNode.parentNode.parentNode.attributes.datastatus.value;
//
//            console.log("tweetid: " + tweetid);
//            console.log("orgid: " + orgid);
//            console.log("rstatus: " + rstatus);
//            if (rstatus === "true") {
//                var retweeterid = e.target.parentNode.parentNode.parentNode.parentNode.attributes.dataname.value;
//                var tweeterRetweeter = $('.' + tweetid + "tweeterRetweeter").html().substring(13);
//            }
//            else {
//                var retweeterid = null;
//                var tweeterRetweeter = userprofile.fullname;
//            }
//            console.log(retweeterid);
//            //tweeterRetweeter,tweettxt
//
//            /*var letsee=e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;*/
//            //console.log(userprofile);
//
//            //incomplete calling
//            $.ajax({
//                type: "POST",
//                url: BASE_URL + "tweet_details/postretweet",
//                data: {userid: user_id, tweet_id: tweetid, orgid: orgid, InterID: retweeterid,fullname:tweeterRetweeter,username:userprofile.username}
//            }).done(function(data) {
//                console.log("waiting for data");
//                console.log(data);
//                if (data['status'] === "SUCCESS")
//                {
//
//                    console.log(data);
//                    //tweeterRetweeter,originatorname,originatorusername,tweettxt
//                    var classpointer = tweetid + "tweet";
//
//                    var tweettime = new Date();
//                    var tweettxt = $('.' + tweetid + "tweettxt").html();
//                    var originatorname = $('.' + tweetid + "orgname").html();
//                    var originatorusername = $('.' + tweetid + "orgusername").html().substring(2);
//
//
//                    retweetcount = $('.' + classpointer).html();
//                    var classpointerlike = tweetid + "like";
//                    tweetlike = $('.' + classpointerlike).html();
//                    likestatus = $('#likestatus' + tweetid).children().attr('id');
//                    console.log(likestatus);
//                    if (likestatus === 'liketweet')
//                        var liketoggle = '<li class="actions"><button type="button" data-toggle="tooltip" title="Like" class="actionButton likestatus' + tweetid + '"><i class="glyphicon glyphicon-thumbs-up" id="liketweet"></i></button>';
//                    else
//                        var liketoggle = '<li class="actions"><button type="button" data-toggle="tooltip" title="Unlike" class="actionButton likestatus' + tweetid + '"><i class="glyphicon glyphicon-thumbs-down" id="unliketweet"></i></button>';
//                    //var retweet = '<div class="media tweetbox" id="' + tweetid + '" style="background : aliceblue"><a class="pull-left" href="#"><img class="media-object tweet-thumb" src=' + imgURL(orgid) + ' alt="Firstname Lastname">  </a><div class="media-body"> <label class="' + tweetid + 'tweeterRetweeter">Retweeted by ' + tweeterRetweeter + '</label>   <h5 class="media-heading"><a href="#" alt="Fullname" class="' + tweetid + 'orgname" >' + originatorname + '</a><small class="' + tweetid + 'orgusername"> @' + originatorusername + '</small></h5>  <text class"' + tweetid + 'tweettxt">' + tweettxt + '</text><div class="tweetactions" dataorgid="' + orgid + '"datastatus="' + rstatus + '" dataname="' + user_id + '">     <ul class="pull-right">       <li class="tweettime"><i class="glyphicon glyphicon-time" data-toggle="tooltip" title="' + tweettime + '"></i></li>   ' + liketoggle + '     <span class="likecount ' + tweetid + 'like" >' + tweetlike + '</span></li>        <li class="actions" ><button type="button" data-toggle="tooltip" title="Retweet" class="actionButton"><i class="glyphicon glyphicon-share-alt" id="retweet"></i></button><span class="retweetcount ' + tweetid + 'tweet">' + retweetcount + '</span></li>      </ul>    </div>  </div></div>';
//
//                    //$("#tweet-wall").prepend(retweet);
//                    pollnewtweets();
//
//                    $('.' + classpointer).each(function() {
//                        var curcount = parseInt($(this).html()) + 1;
//                        $(this).html(curcount);
//                        console.log("curcount: " + (curcount));
//                    });
//
//
//                } else {
//                    console.log(data['message']);
//                }
//            });
//
//        }
//    });

    //reset password
    var checkresetpassword=false;
    var checkresetpasswordConfirm=false;



    $('#resetPassword').blur(function() {
        if ($('#resetPassword').val() === "")
       {
            $('#resetPasswordMissing').css({'color': 'red'});
            $('#resetPasswordMissing').text("Enter Password");
            checkresetpassword = false; 
       }
    });
    $('#resetPassword').keyup(function()
    {
        if ($('#resetPassword').val().length > 7)
        {
            $('#resetPasswordMissing').css({'color': 'green'});
            $('#resetPasswordMissing').text("strong password");
            checkresetpassword = true;
        }
        else
        {
            $('#resetPasswordMissing').css({'color': 'red'});
            $('#resetPasswordMissing').text("cannot accept weak password");
            checkresetpassword = false;
        }

    });    
    $('#resetPasswordConfirm').blur(function(){
       if($('#resetPasswordConfirm').val()===""){
            $('#resetPasswordConfirmMissing').css({'color': 'red'});
            $('#resetPasswordConfirmMissing').text("Enter Confirm Password"); 
            checkresetpasswordConfirm=true;
       }
    });

    $('#resetPasswordConfirm').keyup(function()
    {
        if ($('#resetPasswordConfirm').val() === $('#resetPassword').val()) {
            if ($('#resetPasswordConfirm').val() !== "" && $('#resetPassword').val() !== "") {
                $('#resetPasswordConfirmMissing').css({'color': 'green'});
                $('#resetPasswordConfirmMissing').text("Password match");
                checkresetpasswordConfirm = true;
            } else {
                $('#resetPasswordConfirmMissing').css({'color': 'red'});
                $('#resetPasswordConfirmMissing').text("");
                checkresetpasswordConfirm = false;
            }
        }
        else
        {
            $('#resetPasswordConfirmMissing').css({'color': 'red'});
            $('#resetPasswordConfirmMissing').text("Password mismatch");
            checkresetpasswordConfirm = false;
        }
    });

    $('#savePassword').click(function()
    {
        if(checkresetpassword && checkresetpasswordConfirm){
            $.ajax({
                type: "POST",
                url: "../user_details/resetpassword",
                data: {password: $('#resetPassword').val()}

            }).done(function(data) {
                if(data['status']==="SUCCESS"){
                    checkresetpasswordConfirm = false;
                    checkresetpassword = false;
                    $('#resetPasswordError').css({'color': 'green'});
                    setTimeout(function(){
                     $('#resetPasswordModal').modal('toggle');
                     console.log("out");
                    }, 2000);
                }
                else
                {
                    $('#resetPasswordError').css({'color': 'red'});
                }
                $('#resetPasswordError').text(data['message']);
            });
            

        }else{
                $('#resetPasswordError').css({'color': 'red'});
                $('#resetPasswordError').text("Please fill in above fields properly");
        }
    });    

    $('.pollresult').hover(function() {
        $(this).css('background-color', 'gainsboro');
        }, function() {
            $(this).css('background-color', '#f5f8fa');
        }
    );
    
    $('.pollresult').click(function(){
        loadTweets("top","home");
    });

}); //end script

function loadTweets(position,type)
{
    $.ajax({
        type: "POST",
        url: BASE_URL + "tweet_details/retrievetweets",
        data: {id:user_id,start: start, count: count, display: position, type: type}
    }).done(function(data) {
        $('#progress').html("");
        if (data['status'] === 'FAILURE')
        {
            //console.log(data['message']);
            $("#tweet-wall").append(data['message']);
        } else
        {
            
            if (data['data'].length < 25 && data['data'].length > 0)
            {
                load_flag = false;
            }
            if (data['data'].length > 0)
            {
                //console.log("worked");
                var tweet="";
                console.log(data);
                $.each(data['data'], function(index, value) {
                    //console.log("INDEX: " + index + " VALUE: " + value.T.id);
                    //console.log("INDEX: " + index + " Tweeter/Retweeter: " + value['UD']['Tweeter/Retweeter'] + " id: " + value['T']['id'] + "Tweettxt: " + value['T']['Tweettxt'] + " TweetTime: " + value['TD']['TweetTime'] + " RStatus: " + value['TD']['RStatus'] + " Orginator: " + value[0]['Orginator']);
                    var tweeterRetweeter = value['UD']['Tweeter/Retweeter'];
                    var tweeterusername = value['UD']['username'];
                    var tid = value['T']['id'];   //where to store?
                    var tweettxt = value['T']['tweet_text'];
                    var retweetcount = value['T']['retweetcount'];
                    var tweetlike = value['T']['likecount'];
                    var tweettime = new Date(value['TD']['TweetTime']); //post_time = new Date(data[i]["Post"].post_time*1000);
                    var rstatus = value['TD']['RStatus'];
                    var originatorname = value[0]['Orginator name'];
                    var originatorusername = value[0]['Orginator username'];
                    var likestatus = parseInt(value[0]['likestatus']);
                    //console.log(index+":"+likestatus);
                    if (likestatus === 0)
                        var liketoggle = '<li class="actions"><button type="button" data-toggle="tooltip" title="Like" class="actionButton likestatus' + tid + '"><i class="glyphicon glyphicon-thumbs-up" id="liketweet"></i></button>';
                    else
                        var liketoggle = '<li class="actions"><button type="button" data-toggle="tooltip" title="Unlike" class="actionButton likestatus' + tid + '"><i class="glyphicon glyphicon-thumbs-down" id="unliketweet"></i></button>';
                    if (!rstatus)
                    {
                        var originatorid = value['TD']['tweetorgid'];
                        //tweet
                        tweet =tweet+ '<div class="media tweetbox" id="' + tid + '" style="background : aliceblue"><a class="pull-left" href="'+BASE_URL+tweeterusername+'"><img class="media-object tweet-thumb" src=' + imgURL(tweeterusername) + ' alt="'+tweeterRetweeter+'">  </a><div class="media-body">    <h5 class="media-heading"><a href="'+BASE_URL+tweeterusername+'" alt="'+tweeterRetweeter+'" class="' + tid + 'orgname">' + tweeterRetweeter + '</a><small class="' + tid + 'orgusername"> @' + tweeterusername + '</small></h5>  <text class="' + tid + 'tweettxt">' + tweettxt + '</text><div class="tweetactions" dataorgid="' + originatorid + '" datastatus="' + rstatus + '" >     <ul class="pull-right">       <li class="tweettime"><i class="glyphicon glyphicon-time" data-toggle="tooltip" title="' + tweettime + '"></i></li> ' + liketoggle + '       <span class="likecount ' + tid + 'like">' + tweetlike + '</span></li>        <li class="actions" ><button type="button" data-toggle="tooltip" title="Retweet" class="actionButton" ><i class="glyphicon glyphicon-share-alt" id="retweet"></i></button><span class="retweetcount ' + tid + 'tweet">' + retweetcount + '</span></li>      </ul>    </div>  </div></div>';
                    }
                    else {
                        var retweeterid = value['TD']['tweetorgid'];
                        var originatorid = value['TD']['retweetorgid'];
                        //retweet
                        tweet =tweet+ '<div class="media tweetbox" id="' + tid + '" style="background : aliceblue"><a class="pull-left" href="'+BASE_URL+originatorusername+'"><img class="media-object tweet-thumb" src=' + imgURL(originatorusername) + ' alt="Firstname Lastname">  </a><div class="media-body"> <label class="' + tid + 'tweeterRetweeter">Retweeted by ' + tweeterRetweeter + '</label>   <h5 class="media-heading"><a href="'+BASE_URL+tweeterusername+'" alt="'+originatorname+'" class="' + tid + 'orgname">' + originatorname + '</a><small class="' + tid + 'orgusername"> @' + originatorusername + '</small></h5>  <text class="' + tid + 'tweettxt">' + tweettxt + '</text><div class="tweetactions" dataorgid="' + originatorid + '"datastatus="' + rstatus + '" dataname="' + retweeterid + '">     <ul class="pull-right">       <li class="tweettime"><i class="glyphicon glyphicon-time" data-toggle="tooltip" title="' + tweettime + '"></i></li> ' + liketoggle + '       <span class="likecount ' + tid + 'like" >' + tweetlike + '</span></li>        <li class="actions" ><button type="button" data-toggle="tooltip" title="Retweet" class="actionButton"><i class="glyphicon glyphicon-share-alt" id="retweet"></i></button><span class="retweetcount ' + tid + 'tweet">' + retweetcount + '</span></li>      </ul>    </div>  </div></div>';
                    }

                });
                start = start + data['data'].length;
                if(position!=="top")
                    $("#tweet-wall").append(tweet);
                else
                {
                    $('.pollresult').fadeOut('slow');
                    $('.pollresult').siblings().first().before(tweet).fadeIn('slow');
                }
            }
            else if (load_flag !== false)
            {
                $msg = "<p align='center' id='emptymsg'> No tweets to display </p>";
                $("#tweet-wall").append($msg);
            }
            console.log("start: " + start);
            //$("#tweet-wall").append(tweet);
        }
    });


}

function pollnewtweets()
{
    $.ajax({
        url: BASE_URL + 'tweet_details/poll',
        type: 'POST',
        data: {type : "home"}
    }).done(function(data) {
        if (data['status'] === "NEW")
        {
            //$('.pollresult').css('display','block');
            $('.pollresult').html("Show " + data['message']);
            $('.pollresult').fadeIn('slow');
        }
    });
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
            console.log("intialing");
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
function getFollowers()
{
    $.ajax({
        type: "POST",
        url: BASE_URL + "connections/fetchusers",
        data:{id:user_id,option:0}
    }).done(function(data) {
    	$('#followers-progress').html("");
        if (data.status === "SUCCESS")
        {
            console.log(data);
            if ($('#followers-tab > .row').children().length > 0)
            {
                $('#followers-tab > .row').children().remove();
            }
            if (data.data.length > 0)
            {

                $.each(data.data, function(index, obj) {
                    if (obj[0]['isFollower'] == 1)
                        $followstatus = "Follows you";
                    else
                        $followstatus = "";
                    if (obj.u.bio === null)
                        obj.u.bio = "";
                    $newfollower = "<div class='col-sm-6 col-md-6'> <div class='thumbnail'> <img src=" + imgURL(obj.u.username) + " alt='" + obj.u.fullname + "' class='users-thumb'> <div class='caption'> <a href='"+BASE_URL+obj.u.username+"' class='profile-name' id='follower-fullname'>" + obj.u.fullname + "</a> <div class='profile-baseinfo'> @<span class='profile-username' id='follower-username'>" + obj.u.username + "</span> <span class='follow-status'>"+$followstatus+"</span> </div> <p class='profile-bio text-justify' id='follower-bio'>" + obj.u.bio + "</p> </div> <button class='btn btn-primary followbtn' id='follower" + obj.c.follower_id + "'><span class='btntext' id='follow-text'>Follow</span><span class='btntext' id='following-text'>Following</span><span class='btntext' id='unfollow-text'>Unfollow</span></button> </div> </div>";
                    $('#followers-tab > .row').append($newfollower);
                    if (obj[0]['followstatus'] == 1)
                    {
                        $('#follower' + obj.c.follower_id).children('#following-text').addClass('active');
                        $('#follower' + obj.c.follower_id).children('#following-text').css('display', 'block');
                    }
                    else
                    {
                        $('#follower' + obj.c.follower_id).children('#follow-text').addClass('active');
                        $('#follower' + obj.c.follower_id).children('#follow-text').css('display', 'block');
                        $('#follower' + obj.c.follower_id).removeClass("btn-primary");
                        $('#follower' + obj.c.follower_id).addClass("btn-default");
                        $('#follower' + obj.c.follower_id).children('#follow-text').addClass("btntext-display");
                    }
                });
            }
            else
            {
                $msg = "<p align='center' id='emptymsg'>No followers yet<p>"
                $('#followers-tab > .row').append($msg);
            }
        }
        else
        {
            console.log("message :" + data['message']);
        }
    });
}
function getFollowing()
{
    
    $.ajax({
        type: "POST",
        url: BASE_URL + "connections/fetchusers/",
        data:{id:user_id,option:1}
    }).done(function(data) {
    	$('#following-progress').html("");
        if (data.status === "SUCCESS")
        {
            console.log(data);
            if ($('#following-tab > .row').children().length > 0)
            {
                $('#following-tab > .row').children().remove();
            }
            if (data.data.length > 0)
            {
                $.each(data.data, function(index, obj) {
                    if (obj[0]['followstatus'] == 1)
                        $followstatus = "Follows you";
                    else
                        $followstatus = "";
                    if (obj.u.bio === null)
                        obj.u.bio = "";
                    $newfollowing = $("<div class='col-sm-6 col-md-6'> <div class='thumbnail'> <img src=" + imgURL(obj.u.username) + " class='users-thumb' alt='" + obj.u.fullname + "'> <div class='caption'> <a href='"+BASE_URL+obj.u.username+"' class='profile-name' id='follower-fullname'>" + obj.u.fullname + "</a> <div class='profile-baseinfo'> @<span class='profile-username' id='follower-username'>" + obj.u.username + "</span> <span class='follow-status'>" + $followstatus + "</span> </div> <p class='profile-bio text-justify' id='follower-bio'>" + obj.u.bio + "</p> </div> <button class='btn btn-primary followbtn' id='following" + obj.c.following_id + "'><span class='btntext' id='follow-text'>Follow</span><span class='btntext' id='following-text'>Following</span><span class='btntext' id='unfollow-text'>Unfollow</span></button> </div> </div>");
                    $('#following-tab > .row').append($newfollowing);
                    if (obj[0]['isFollowing'] == 1)
                    {   
                        $('#following' + obj.c.following_id).children('#following-text').addClass('active');
                        $('#following' + obj.c.following_id).children('#following-text').css('display', 'block');
                    }
                    else
                    {
                        $('#following' + obj.c.following_id).children('#follow-text').addClass('active');
                        $('#following' + obj.c.following_id).children('#follow-text').css('display', 'block');
                        $('#following' + obj.c.following_id).removeClass("btn-primary");
                        $('#following' + obj.c.following_id).addClass("btn-default");
                        $('#following' + obj.c.following_id).children('#follow-text').addClass("btntext-display");
                    }
                        
                });
            }
            else
            {
                $msg = "<p align='center' id='emptymsg'>Not following anyone yet<p>"
                $('#following-tab > .row').append($msg);
            }
        }
        else
        {
            console.log("message : " + data['message']);
        }
    });
}

function UrlExists(url)
{
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    return http.status !== 404;
}


function validateImg(file)
{
    var ext = file.name.split('.').pop().toLowerCase();
    if ($.inArray(ext, ['gif', 'png', 'jpg', 'jpeg']) === -1) {
        return 1;
    }
    else
    {
        $file_size = file.size / 1048576;
        if ($file_size > 5)
            return 2;
        else
        {
            return true;
        }
    }
}


function loadmore() {
    $('#progress').html("<img src='" + BASE_URL + "img/ajax-loader.gif'>");
    if (load_flag === true)
    {
        console.log("loading more");
        loadTweets("bottom","home");
    }
    else
    {
        $('#progress').html("");
        $msg = '<center><p id="emptymsg"> No more tweets to display</p></center> ';
        if($('#tweet-wall').find('#emptymsg').length ===0)
            $("#tweet-wall").append($msg);
        stop = true;
    }
}