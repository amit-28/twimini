<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

class TweetDetail extends AppModel {
    public $belongsTo = 'Tweet';
    
    public function findTweetsByID($id,$start,$count,$display,$tid,$type) {
        $db = $this->getDataSource();
        $own = "TD.user_detail_id=:id";
        if($display==="initial")
        {
            $top_condition = "";
            $bottom_condition = "";
        }
	else if($display==="bottom")
        {
            $top_condition = "";
            $bottom_condition = "AND TD.id < {$tid}";
        }
        else if($display==="top")
        {
            $top_condition = "AND TD.id > {$tid}";
            $bottom_condition = "";
        }

        
        
        $followings_user_id = $db->query("SELECT `following_id` FROM `connections` WHERE `follower_id` = ".$id." AND follow_status=1");
        $ids = array();
        for($i=0; $i<count($followings_user_id); $i++){
            array_push($ids, $followings_user_id[$i]['connections']['following_id']);
        }
        array_push($ids, $id);
        
        if($type == "home")
        {
            $home_condition="(TD.user_detail_id IN  (".implode(',', $ids)."))";
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
        
        $result=$db->query("select UD.fullname as 'Tweeter/Retweeter',UD.username,T.id,T.tweet_text,TD.id,TD.TweetTime,TD.user_detail_id as 'tweetorgid',TD.OrgID as 'retweetorgid',T.retweetcount,T.likecount,TD.RStatus,(select FullName from user_details where id=TD.OrgID) as 'Orginator name',(select username from user_details where id=TD.OrgID) as 'Orginator username',(SELECT EXISTS(SELECT 1 FROM likes WHERE tweet_id = T.id AND user_detail_id = :id)) as likestatus
        from tweet_details TD
        Join tweets T
        on TD.tweet_id=T.id

        Join user_details UD
        on UD.id=TD.user_detail_id 

        where {$home_condition} {$own}  {$top_condition} {$bottom_condition}     
        order by TD.id desc
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
