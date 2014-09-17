<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

class Tweet extends AppModel {

    public $hasMany = array(
        'TweetDetail' => array(
            'className' => 'TweetDetail',
            'conditions' => array('Tweet.id' => 'TweetDetail.Tweet_id'),
            'order' => 'TweetDetail.TweetTime DESC'
        )
    );
    
   
    
}