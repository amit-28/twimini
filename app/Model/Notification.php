<?php

class Notification extends AppModel
{
    public function deleteNotification($notifier_id,$notified_id,$tweet_id) {
         try{
            $db = $this->getDataSource();
            $count =$db ->query("DELETE FROM notifications WHERE notifier_id=:notifier_id AND notified_id=:notified_id AND message='like' AND tweet_id=:tweet_id",array('notifier_id'=>$notifier_id,'notified_id'=>$notified_id,'tweet_id'=>$tweet_id));
            if($count){
                return true;
            }
         }
        catch (Exception $e){
            return false;
        }        
    }
    public function findAllNotifications($id,$start,$type) {
        if ($type == "new") {
            $limit = "";
            $check_notification_status="";
        } else if ($type == "all") {
            $limit = "limit " . $start . ",25";
            $check_notification_status="AND notification_status=0";
        }
        try{
            $db = $this->getDataSource();
            $results =$db ->query("select * from notifications where notified_id=:id {$check_notification_status} {$limit}",array('id'=>$id));
            return $results;
         }
        catch (Exception $e){
            return null;
        } 
    }
}
