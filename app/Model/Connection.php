<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

class Connection extends AppModel {
    
    
    public function follow($follower_id,$following_id) {
        try{
            $db = $this->getDataSource();
            $count = $db ->query("select count(*) as 'count' from connections where follower_id=:follower_id AND following_id=:following_id",array('follower_id'=>$follower_id,'following_id'=>$following_id)); 
            if($count[0][0]['count'] > 0)
            {
                $db->query("update connections set follow_status=1,time_stamp=CURRENT_TIMESTAMP() where follower_id=:follower_id AND following_id=:following_id",array('follower_id'=>$follower_id,'following_id'=>$following_id));
            }
            else
            {
                $db->query("insert into connections (follower_id,following_id) values (:follower_id,:following_id)",array('follower_id'=>$follower_id,'following_id'=>$following_id));
            
            }
            return true;
        }
        catch(Exception $ex)
        {
            return false;
        }
    }
    public function unfollow($follower_id,$following_id) {
        try{
            $db = $this->getDataSource();
            $db->query("update connections set follow_status=0,time_stamp=CURRENT_TIMESTAMP() where follower_id=:follower_id AND following_id=:following_id",array('follower_id'=>$follower_id,'following_id'=>$following_id));
            return true;
        }
        catch(Exception $ex)
        {
            return false;
        }
        
    }
    public function readFollowers($id,$user_id) {
        $db = $this->getDataSource();
        $results=$db->query("select c.follower_id,u.fullname,u.username,u.bio,(SELECT EXISTS(SELECT 1 FROM connections WHERE follower_id = c.follower_id AND following_id = :user_id  AND follow_status=1)) as isFollower,(SELECT EXISTS(SELECT 1 FROM connections WHERE follower_id = :user_id AND following_id = c.follower_id  AND follow_status=1)) as followstatus from connections c JOIN user_details u ON c.follower_id=u.id  AND c.following_id=:id AND c.follow_status=1",array('id'=>$id,'user_id'=>$user_id));
        return $results;
    }
    
    public function readFollowing($id,$user_id) {
        $db = $this->getDataSource();
        $results=$db->query("select c.following_id,u.fullname,u.username,u.bio,(SELECT EXISTS(SELECT 1 FROM connections WHERE follower_id = :user_id AND following_id = c.following_id  AND follow_status=1)) as isFollowing,(SELECT EXISTS(SELECT 1 FROM connections WHERE follower_id = c.following_id AND following_id = :user_id AND follow_status=1)) as followstatus from connections c JOIN user_details u ON c.following_id=u.id  AND c.follower_id=:id AND c.follow_status=1",array('id'=>$id,'user_id'=>$user_id));
        return $results;
        
    }
    
    public function isFollowing($id,$user_id) {
        $db = $this->getDataSource();
        $results=$db->query("SELECT EXISTS(SELECT 1 FROM connections WHERE follower_id = :user_id AND following_id = :id  AND follow_status=1) as isFollowing",array('id'=>$id,'user_id'=>$user_id));
        return $results;
    }
}