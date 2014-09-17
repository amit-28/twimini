<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

class LikesController extends AppController{
    public $components = array('RequestHandler');
    
    public function tweetlike() 
    {   
        $this->layout= 'ajax';
        $this->response->type('json');
        $user_id=  $this->request->data('userid');  //userid passed by javascript
        $id=$this->Session->read('user');           //userid from session
        if($user_id===$id)
        {            
            $tweet_id=$this->request->data('tweet_id');
            $originator_id=$this->request->data('notified_id');
            $retweeter_id=$this->request->data('retweeter_id');
            $fullname=$this->request->data('fullname');
            $username=$this->request->data('username');

            if($user_id!=NULL && $tweet_id!=NULL){
                $data=array();
                $data['tweet_id']=$tweet_id;            
                $data['user_detail_id']=$user_id;
                
                if($this->Like->save($data))
                {
                    $this->loadModel('Tweet');
                    $this->Tweet->id=$tweet_id;
                    if($this->Tweet->saveField('likecount',($this->Tweet->field('likecount'))+1)){
                        //var_dump($user_id." ".$notified_id." ".$tweet_id);
                        //$this->notify($user_id,$notified_id,$tweet_id);
                        if($user_id!=$originator_id){
                        $multinotification = Array();
                        $notification1=Array ('notifier_id' => $user_id,'notifier_fullname'=>$fullname,'notifier_username'=>$username,'notified_id'=>$originator_id,'message'=>'like','tweet_id'=>$tweet_id);
                        array_push( $multinotification,$notification1);
                        }
                        if(($retweeter_id!=="-1" && $retweeter_id!==NULL) && $originator_id!==$retweeter_id)
                        {
                            if($user_id!=$retweeter_id){
                            $notification2=Array ('notifier_id' => $user_id,'notifier_fullname'=>$fullname,'notifier_username'=>$username,'notified_id'=>$retweeter_id,'message'=>'like','tweet_id'=>$tweet_id);
                            array_push( $multinotification,$notification2);
                            }
                        }
                        $this->notify($multinotification);
                        $this->success("tweet liked successfully");
                    }else{
                        $this->failure("failure in updating tweet like");
                    }
                }else{
                     $this->failure("failure in saving tweet like");
                }  
            }else{
                $this->failure("failure in saving tweet like");
            }    
        }
        else{
            $this->failure("please login again");
        }
    }
    public function notify($multinotification){
        
        if($multinotification!=null)
        {            
            
            $this->loadModel('Notification');
            if($this->Notification->saveAll($multinotification))
            {
                $this->success("notification added");
            }
            else{
                $this->failure("error in like tweet notification");
            }
        }else{
            $this->failure("Insufficient parameters");
        }
    }
    
    public function tweetunlike() 
    {   
        $this->response->type('json');
        $user_id=  $this->request->data('userid');
        $id=$this->Session->read('user');
        if($user_id===$id)
        {            
            $tweet_id=$this->request->data('tweet_id');
            $originator_id=$this->request->data('notified_id');
            $retweeter_id=$this->request->data('retweeter_id');
            if($user_id!=NULL && $tweet_id!=NULL){
                if($this->Like->deleteAll(array('tweet_id' => $tweet_id,'user_detail_id'=>$user_id), false))
                {
                    $this->loadModel('Tweet');
                    $this->Tweet->id=$tweet_id;
                    if($this->Tweet->saveField('likecount',($this->Tweet->field('likecount'))-1)){
                        //$multinotification = Array();
                        $notification1=Array ('notifier_id' => $user_id,'notified_id'=>$originator_id,'message'=>'like','tweet_id'=>$tweet_id);
                        $this->deleteNotification($notification1);
                        //array_push( $multinotification,$notification1);
                        if($retweeter_id!=="-1" && $originator_id!==$retweeter_id)
                        {
                            $notification2=Array ('notifier_id' => $user_id,'notified_id'=>$retweeter_id,'message'=>'like','tweet_id'=>$tweet_id);
                            $this->deleteNotification($notification2);
                            //array_push( $multinotification,$notification1);
                        }
                        
                        $this->success("tweet unliked successfully");
                    }else{
                        $this->failure("failure in updating likecount");
                    }
                }else{
                     $this->failure("failure in deleting tweet like");
                }  
            }else{
                $this->failure("Incorrect parameter");
            }    
        }
        else{
            $this->failure("please login again");
        }
    }
    
    public function deleteNotification($notification){
        
        if($notification!==null)
        {            
            $this->loadModel('Notification');
            if($this->Notification->deleteAll($notification,false))
            {
                $this->success("notification deleted");
            }
            else{
                $this->failure("error in like tweet notification");
            }
        }else{
            $this->failure("Insufficient parameters");
        }
    }
    public function failure($message) 
    {
        $this->set('message',$message);
        $this->set('status',"FAILURE");
    }
    public function success($message) 
    {
        $this->set('message',$message);
        $this->set('status',"SUCCESS");
    }
}