<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

class TweetDetail extends AppModel {
    public $belongsTo = 'Tweet';
    
    public function findTweetsByID($id,$start,$count,$display,$time_stamp,$type) {
        $db = $this->getDataSource();
        $own = "TD.user_detail_id=:id";
        if($display==="bottom")
        {
            $top_condition = "";
            $bottom_condition = "AND TD.TweetTime < '{$time_stamp}'";
        }
        else if($display==="top")
        {
            $top_condition = "AND TweetTime > '{$time_stamp}'";
            $bottom_condition = "";
        }
        else if($display==="initial")
        {
            $top_condition = "";
            $bottom_condition = "";
        }
        if($type == "home")
        {
            $home="(TD.user_detail_id IN ( select following_id from connections where follower_id=:id AND ((follow_status=0 AND TD.TweetTime<time_stamp) OR follow_status=1 ))";
            $home_condition = $home." OR ".$own.")"; 
            $own = "";
        }
        else if ($type == "profile")
        {
            $home_condition = "";
        }
        if($start===null && $count==null)
            $limit="";
        else
            $limit="limit {$start},{$count}";
        
        $result=$db->query("select UD.fullname as 'Tweeter/Retweeter',UD.username,T.id,T.tweet_text,TD.TweetTime,TD.user_detail_id as 'tweetorgid',TD.OrgID as 'retweetorgid',T.retweetcount,T.likecount,TD.RStatus,(select FullName from user_details where id=TD.OrgID) as 'Orginator name',(select username from user_details where id=TD.OrgID) as 'Orginator username',(SELECT EXISTS(SELECT 1 FROM likes WHERE tweet_id = T.id AND user_detail_id = :id)) as likestatus
        from tweet_details TD
        Join tweets T
        on TD.tweet_id=T.id

        Join user_details UD
        on UD.id=TD.user_detail_id 

        where {$home_condition} {$own}  {$top_condition} {$bottom_condition}     
        order by TweetTime desc
       {$limit}",array('id'=>$id));
        //print_r($result);
        return $result;
    }
    public function findOriginalid($tid) {
        $db = $this->getDataSource();
        $result=$db->query("select user_detail_id,OrgID from tweet_details where tweet_id=:tid LIMIT 1",array('tid'=>$tid));
        return $result;
    }
   
}