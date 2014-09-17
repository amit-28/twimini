<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

?>

    <?php //print_r($user_detail);?>

<div class="col-md-3">
    <div class="well">

        <div class="profileupper text-center">
            <div class="profilepic" id="avatar">
                
                <button type='button' class='btn btn-link' id='changeAvatar'>Change Avatar</button>
            </div>
            <?php   
                    $options = array(
                        'label' => 'Update',
                        'value' => 'Update Avatar',
                        'id' => 'uploadsubmit',
                        'div' => false
                    );
                    echo $this->Form->create('Upload', 
                                            array('type' => 'file','id'=>'uploadAvatarForm'),
                                            array('defaults' => false));
                    echo $this->Form->input('myimage',array('type'=>'file'),
                                            array('inputDefaults' => array(
                                                    'label' => false,
                                                    'div' => false
                                                )));
                    echo $this->Form->end($options); ?>
            <div class="profiledesc">
                <a href="#" id="prof-fullname"><b> </b></a><br>
                <p id="prof-username"> </p><br>
                <p id="prof-bio"><i></i></p>
            </div>
        </div>

        <div class="profilestats" align="center">
            <ul class="nav nav-pills nav-stacked" style="max-width:260px;" align="left">
                <li>
                    <a href="#" id="tweetlink">
                        <span class="badge pull-right" id="prof-tweets-count"></span>
                        Tweets
                    </a>
                </li>
                <li>
                    <a href="#" id="followinglink">
                        <span class="badge pull-right" id="prof-following-count"></span>
                        Following
                    </a>
                </li>
                <li>
                    <a href="#" id="followerslink">
                        <span class="badge pull-right" id="prof-followers-count"></span>
                        Followers
                    </a>
                </li>
            </ul>
        </div>

        <div id="new-tweetbox">
            <div id="tweettext">
                <textarea rows="3" placeholder="New tweet" maxlength="160" id="new-tweetmsg"></textarea>
            </div>
            <span id="textcount">160</span>        
            <button class="btn btn-primary" id="new-tweetbtn">Compose Tweet</button>
        </div>

    </div>
</div>
