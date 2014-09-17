$(document).ready(function() {
    //autologin();
    //login
    var checkusernameemail = false;
    var checkloginpassword = false;
    $('#usernameemail').blur(function() {
        if ($('#usernameemail').val() === "") {
            $('#missingusernameemail').text("Enter username or email");
            checkusernameemail = false
        }
        else {
            $('#missingusernameemail').text("");
            checkusernameemail = true;
        }

    });

    $('#loginpassword').blur(function() {
        if ($('#loginpassword').val() === "") {
            $('#missingpassword').text("Enter password");
            checkloginpassword = false;
        }
        else {
            $('#missingpassword').text("");
            checkloginpassword = true;
        }
    });

    $('#usernameemail').click(function() {
        $('#usernameemail').css({'box-shadow': 'none'});
    });

    $('#loginpassword').click(function() {
        $('#loginpassword').css({'box-shadow': 'none'});

    });



    $('#signin').click(function(evt) {
        //evt.preventDefault();
        check();
        if (checkusernameemail && checkloginpassword)
        {
            if (validateEmail($('#usernameemail').val()))
                var fieldtype = "email";
            else
                var fieldtype = "username";
            console.log(fieldtype);
            $.ajax({
                type: "POST",
                url: BASE_URL + "user_details/login",
                data: {usernameemail: $('#usernameemail').val(), loginpassword: $('#loginpassword').val(), type: fieldtype}
            }).done(function(data) {
                console.log(data);
                console.log(data['status']);
                if (data['status'] === "SUCCESS") {
                    checkusernameemail = false;
                    checkloginpassword = false;
                    //console.log(data);
                    //console.log("id:"+['data'][0]['user_details']['id']);
                    //setCookie("user_id", data['data'][0]['user_details']['id'], 10);
                    //checkCookie(data['data'][0]['user_details']['id']);
                    window.location.assign(BASE_URL + 'home');
                    $('#loginerror').text('');
                    console.log(data['message']);
                    //alert("login call");
                }
                else {
                    $('#loginerror').text(data['message']);
                    // alert("login fail");
                }
            });
        }
        else {
            $('#loginerror').text("please fill above details");
            $('#usernameemail').css({'box-shadow': '0px 0px 7px red'});
            $('#loginpassword').css({'box-shadow': '0px 0px 7px red'});
        }
    });

    //register scripts

    var checkfullname = false;
    var checkusername = false;
    var checkemail = false;
    var checkpassword = false;
    var checkconfirmpassword = false;

    $('#regfullname').blur(function() {
        if (!validateFullname($('#regfullname').val()))
        {
            $('#missingname').css({'color': 'red'});
            $('#missingname').text("Enter valid name");
            checkfullname = false;
        }
        else
        {
            if ($('#regfullname').val() === "")
            {
                $('#missingname').text("Enter name");
                checkfullname = false;
            }
            else
            {
                $('#missingname').text("");
                checkfullname = true;
            }
        }
    });

    $('#regemail').blur(function()
    {
        //regex checking of email id remaining
        if (!validateEmail($('#regemail').val()))
        {
            $('#uniqueemailcheck').css({'color': 'red'});
            $('#uniqueemailcheck').text("Enter valid email id");
            checkemail = false;
        }
        else
        {
            if ($('#regemail').val() !== "")
            {
                $('#uniqueemailcheck').css({'color': 'green'});
                $('#uniqueemailcheck').text("");
                $.ajax(
                        {
                            type: "POST",
                            url: BASE_URL + "user_details/checkemail",
                            data: {email: $('#regemail').val()}
                        }).done(function(data)
                {
                    console.log(data);
                    if (data['status'] == "FAILURE")
                    {
                        $('#uniqueemailcheck').css({'color': 'green'});
                        $('#uniqueemailcheck').text(data['message']);
                        checkemail = true;
                    }
                    else {
                        $('#uniqueemailcheck').css({'color': 'red'});
                        $('#uniqueemailcheck').text(data['message']);
                        checkemail = false;
                    }

                });
            }
            else
            {
                $('#uniqueemailcheck').css({'color': 'red'});
                $('#uniqueemailcheck').text("Enter email");
                checkemail = false;
            }
        }
    });

    $('#regusername').blur(function()
    {
        if (!validateUsername($('#regusername').val()))
        {
            $('#uniqueusernamecheck').css({'color': 'red'});
            $('#uniqueusernamecheck').text("Enter valid username.username can contain a-z,A-Z,0-9");
            checkusername = false;
        }
        else
        {
            if (checksystemusername($('#regusername').val())) {
                if ($('#regusername').val() !== "")
                {
                    $.ajax(
                            {
                                type: "POST",
                                url: BASE_URL + "user_details/checkusername",
                                data: {username: $('#regusername').val()}

                            }).done(function(data)
                    {
                        console.log(data);
                        if (data['status'] == "FAILURE")
                        {
                            $('#uniqueusernamecheck').css({'color': 'green'});
                            $('#uniqueusernamecheck').text(data['message']);
                            checkusername = true;
                        }
                        else
                        {
                            $('#uniqueusernamecheck').css({'color': 'red'});
                            $('#uniqueusernamecheck').text(data['message']);
                            checkusername = false;
                        }
                    });
                }
                else {
                    $('#uniqueusernamecheck').css({'color': 'red'});
                    $('#uniqueusernamecheck').text("Enter username");
                    checkusername = false;
                }
            } else {
                $('#uniqueusernamecheck').css({'color': 'red'});
                $('#uniqueusernamecheck').text("Username does not exist.please enter another username");
                checkusername = false;
            }
        }
    });

    $('#regpassword').keyup(function()
    {
        if ($('#regpassword').val().length > 7)
        {
            $('#passwordstrength').css({'color': 'green'});
            $('#passwordstrength').text("strong password");
            checkpassword = true;
        }
        else
        {
            $('#passwordstrength').css({'color': 'red'});
            $('#passwordstrength').text("cannot accept weak password");
            checkpassword = false;
        }

    });

    $('#regpassword').blur(function()
    {
        if ($('#regpassword').val() === "")
        {
            $('#passwordstrength').css({'color': 'red'});
            $('#passwordstrength').text("Enter Password");
            checkpassword = false;
        }
    });

    $('#regconfirmpassword').blur(function()
    {
        if ($('#regconfirmpassword').val() === "")
        {
            $('#passwordconfirm').css({'color': 'red'});
            $('#passwordconfirm').text("Enter confirm Password");
            checkconfirmpassword = false;
        }

    });

    $('#regconfirmpassword').keyup(function()
    {
        if ($('#regconfirmpassword').val() === $('#regpassword').val()) {
            if ($('#regconfirmpassword').val() !== "" && $('#regpassword').val() !== "") {
                $('#passwordconfirm').css({'color': 'green'});
                $('#passwordconfirm').text("Password match");
                checkconfirmpassword = true;
            } else {
                $('#passwordconfirm').css({'color': 'red'});
                $('#passwordconfirm').text("");
                checkconfirmpassword = false;
            }
        }
        else
        {
            $('#passwordconfirm').css({'color': 'red'});
            $('#passwordconfirm').text("Password mismatch");
            checkconfirmpassword = false;
        }
    });
    $('#register').click(function(evt) {
        //console.log("hello");
        evt.preventDefault();
        if (checkusername && checkpassword && checkemail && checkfullname && checkconfirmpassword)
        {
            $.ajax({
                type: "POST",
                url: BASE_URL + "user_details/register",
                data: {fullname: $('#regfullname').val(), email: $('#regemail').val(), username: $('#regusername').val(), password: $('#regpassword').val()}
            }).done(function(data) {
                //console.log("hii");
                console.log(data);
                if (data['status'] === "SUCCESS") {
                    /*$('#RegisterModal').modal({
                     show: false
                     });*/
                    $('#RegisterModal').hide();
                    $('#ProfileDetailsModal').modal({show: true});
                    //window.location.assign('home/');
                    //console.log("registered");
                    //console.log(data);

                }
                else {
                    //console.log("failed");
                    $('#regerrormsg').text(data['message']);
                }
            });
        }
        else {
            //console.log("failed");
            $('#regerrormsg').text("Please fill above fields correctly");
        }
    });

    $('#reset').click(function() {
        clear();
        /*$('#RegisterModal').hide();
         window.location.assign('home/');*/
    });

    $('#openBtn').click(function() {
        $('#missingpassword').text("");
        $('#missingusernameemail').text("");
        $('#loginerror').text("");
        $('#RegisterModal').modal({
            show: true
        });
        //$('#ProfileDetailsModal').modal({show: true});
    });

    $('#closemark').click(function() {
        clear();
    });

    $('#closebutton').click(function() {
        clear();
    });


    //forgot password
    $('#sendnewpassword').click(function() {
        if ($('#newpasswordemail').val() === "")
        {
            $('#newpasswordemail').css({'box-shadow': '0px 0px 7px red'});
            $('#newpasswordmessage').css({'color': 'red'});
            $('#newpasswordmessage').text("Enter email address");
        } else {
            if (!validateEmail($('#newpasswordemail').val()))
            {
                $('#newpasswordmessage').css({'color': 'red'});
                $('#newpasswordmessage').text("Enter valid email address");
            }
            else {
                $.ajax({
                    type: "POST",
                    url: BASE_URL + "user_details/forgotpasswordemail",
                    data: {email: $('#newpasswordemail').val()}
                }).done(function(data) {

                    console.log(data);
                    if (data['status'] === "SUCCESS") {
                        $('#newpasswordmessage').css({'color': '#428bca'});
                        $('#newpasswordmessage').text(data['message']);
                    }
                    else {
                        $('#newpasswordmessage').css({'color': 'red'});
                        $('#newpasswordmessage').text(data['message']);
                    }
                });
            }
        }
    });

    $('#newpasswordemail').click(function() {
        $('#newpasswordemail').css({'box-shadow': 'none'});
    });

    $('#forgotpassword').click(function() {
        $('#missingpassword').text("");
        $('#missingusernameemail').text("");
        $('#loginerror').text("");
        $('#ForgotPasswordModal').modal({
            show: true
        });
    });

    $('#closebuttonForgotpassword').click(function() {
        resetforgotpassword();
    });
    $('#closemarkforgotpassword').click(function() {
        resetforgotpassword();
    });



//ProfileDetails
    var bio = false;
    var imgValidated = false;
    var file = null;

    $('#Bio').keyup(function() {
        var msglength = $(this).val().length;
        $(this).parent().siblings('#textcount').text(160 - msglength);
        if (msglength !== 160)
        {
            bio = true;
        }
    });

    $('#uploadimage').change(function() {
        console.log("binding");
        file = $(this)[0].files[0];
        var imgStatus = validateImg(file);
        if (imgStatus === true)
        {
            imgValidated = true;
        }
        else
        {
            if (imgStatus === 1)
                alert('Invalid File Extension! Please choose valid picture file');
            else
                alert('File is too big..Choose file having size less than 5MB');
        }
    });

    $('#save').click(function() {

        var formData = new FormData();
        formData.append("data[Upload][myimage]", $("#uploadimage")[0].files[0]);
        console.log(new FormData(this));
        if (imgValidated === true)
        {
            $.ajax({
                type: 'post',
                url: BASE_URL + 'uploads/index',
                data: formData,
                contentType: false,
                cache: false,
                processData: false
            }).done(function(data) {
                if (data.status === 'SUCCESS')
                {
                    console.log(data.message);
                    console.log("done");
                }
                else
                {
                    console.log(data.message);
                }
            });
        }
        if (bio === true)
        {
            var newBio = $('#Bio').val();
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
        $('#ProfileDetailsClose').trigger('click');
        window.location.assign('home/');
    });

    $('#ProfileDetailsClose').click(function() {
        window.location.assign('home/');
    });

}); //close doument.ready script

function resetforgotpassword() {
    $('#newpasswordmessage').text("");
    $('#newpasswordemail').val("");
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

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires + "; path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ')
            c = c.substring(1);
        if (c.indexOf(name) != -1)
            return c.substring(name.length, c.length);
    }
    return "";
}

function checkCookie(id) {
    var user = getCookie("user_id");

    if (user === "" || user === null) {
        setCookie("user_id", id, 10);
    }

}
function autologin() {
    var user = getCookie("user_id");
    //console.log("inside login");
    //console.log("cookie: "+user);
    if (user !== "")
    {
        $.session.set("user", user);
        window.location.assign('home/');
    }
}

function clear() {
    $('#regfullname').val("");
    $('#regemail').val("");
    $('#regusername').val("");
    $('#regpassword').val("");
    $('#regconfirmpassword').val("");
    $('#missingname').text("");
    $('#uniqueemailcheck').text("");
    $('#uniqueusernamecheck').text("");
    $('#passwordstrength').text("");
    $('#passwordconfirm').text("");
    $('#regerrormsg').text("");
    checkfullname = false;
    checkusername = false;
    checkemail = false;
    checkpassword = false;
    checkconfirmpassword = false;
}

function check() {
    if ($('#usernameemail').val() === "") {
        $('#missingusernameemail').text("Enter username or email");
        checkusernameemail = false
    }
    else {
        $('#missingusernameemail').text("");
        checkusernameemail = true;
    }
    if ($('#loginpassword').val() === "") {
        $('#missingpassword').text("Enter password");
        checkloginpassword = false;
    }
    else {
        $('#missingpassword').text("");
        checkloginpassword = true;
    }

}

function validateEmail(email) {
    var re = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    return re.test(email);
}

function validateFullname(fullname) {
    var re = /^[a-zA-Z]+ [a-zA-Z]+$/;
    return re.test(fullname);
}

function validateUsername(username) {
    var re = /^[a-zA-Z0-9]*$/;
    return re.test(username);
}

function checksystemusername(username){
    if(username==="home" && username==="discover" && username==="notifications"){
        return false;
    }
    return true;
}