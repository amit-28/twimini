<?php
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

class TweetDetailsController extends AppController
{
    public $components = array('RequestHandler');
    
    public function retrievetweets() 
    {
        $this->response->type('json');
        $data = $this->request->data;
        $id = $data['id'];
        $start = $data['start'];
        $count = $data['count'];
        $display = $data['display'];
        $type = $data['type'];
        if ($id != null) {

            if ($display === "initial") {
                $tweets = $this->TweetDetail->findTweetsByID($id, $start, $count, $display, null, $type);
                if ($tweets != null) {
                    $last_index = count($tweets) - 1;
                    $top_id = $tweets[0]['TD']['id'];
                    $bottom_id = $tweets[$last_index]['TD']['id'];
                    $this->Session->write('top', $top_id);
                    $this->Session->write('bottom', $bottom_id);
                }
            } else if ($display === "bottom") {
                $last = $this->Session->read('bottom');
                $tweets = $this->TweetDetail->findTweetsByID($id, 0 , $count, $display, $last, $type);
                if (count($tweets) > 0) {
                    $last_index = count($tweets) - 1;
                    $bottom_id = $tweets[$last_index]['TD']['id'];
                    $this->Session->delete('bottom');
                    $this->Session->write('bottom', $bottom_id);
                    //printf($this->Session->read('bottom'));
                }
            } else if ($display === "top") {
                $first = $this->Session->read('top');
                $tweets = $this->TweetDetail->findTweetsByID($id, null , null, $display, $first, $type);
                if (count($tweets) > 0) {
                    $top_id = $tweets[0]['TD']['id'];
                    $this->Session->delete('top');
                    $this->Session->write('top', $top_id);
                }
            }
            //print_r($tweets);
            $this->set('data',$tweets);
            $this->set('status',"SUCCESS");
            $this->set('message','tweets retrieved successfully');
        }
        else{
            $this->set('status',"FAILURE");
            $this->set('message','error in retreiving tweets');
        }
    }
    
    public function posttweet() {
        $this->layout = 'ajax';
        $this->response->type('json');
        $this->set('message', "inital");
        $this->set('status', "initial");
        try
        {
            if($this->request->is('post')) //tocheck is form is of post type
            {
                $responsedata=array();
                $this->set('datastatus',false);
                $id=$this->Session->read('user');
                $this->loadModel('Tweet');
                $tweetsdata=$this->request->data;
                //$tweetsdata=htmlspecialchars($this->request->data, ENT_QUOTES);
                //$tweetsdata=htmlspecialchars($this->request->data);
                //var_dump(mysql_real_escape_string($tweetsdata));
                //var_dump(htmlspecialchars($tweetsdata));
                if($this->Tweet->save($tweetsdata))
                {
                    $responsedata['tweet_id']=$this->Tweet->id;
                    $tweetdetailsdata=array();
                    $tweetdetailsdata['user_detail_id']=$id;
                    $tweetdetailsdata['tweet_id']=$this->Tweet->id;
                    
                    if($this->TweetDetail->save($tweetdetailsdata))
                    {
                        $this->loadModel('UserDetail');
                        $this->UserDetail->id=$id;
                        $responsedata['fullname']=$this->UserDetail->field('fullname');
                        $responsedata['username']=$this->UserDetail->field('username');
                        if($this->UserDetail->saveField('no_of_tweets',($this->UserDetail->field('no_of_tweets'))+1)){
                            $message = "Your tweet posted successfully";
                            $this->set('message', $message);
                            $this->set('status',"SUCCESS");
                            $this->set('data',$responsedata);
                            $this->set('datastatus',true);
                            $this->Session->write('display',$message);
                        }else{
                            $this->set('message', "failure in updating tweet count");
                            $this->set('status',"FAILURE");
                        }
                    }else{
                        $this->set('message', "failure in posting tweet");
                        $this->set('status',"FAILURE");
                    }
                }else{
                    $this->set('message', "failure in posting tweet 1");
                    $this->set('status',"FAILURE");
                }
            }
        }
        catch (Exception $ex) 
        {
            $this->set('message',"Exception in posting tweet");
            $this->set('status',"FAILURE");
        }
    }
    
    public function postretweet() 
    {
        
            $this->response->type('json');
            $user_id=  $this->request->data('userid');
            
            $id=$this->Session->read('user');
            if($user_id===$id){
                $data=array();
                $data['user_detail_id']=$id;
                $data['tweet_id']=$this->request->data('tweet_id');
                $data['RStatus']=1;
                $data['OrgID']=$this->request->data('orgid');
                $data['InterID']=$this->request->data('InterID');
                $data['fullname']=  $this->request->data('fullname');
                $data['username']=  $this->request->data('username');
                if($this->TweetDetail->save($data)){
                    $this->loadModel('Tweet');
                    $this->loadModel('UserDetail');
                    $this->UserDetail->id=$id;
                    $this->Tweet->id = $data['tweet_id'];
                    if(($this->Tweet->saveField('retweetcount',($this->Tweet->field('retweetcount'))+1)) && ($this->UserDetail->saveField('no_of_tweets',($this->UserDetail->field('no_of_tweets'))+1))){
                        $this->notify($user_id,$data['OrgID'],$data['tweet_id'],$data['fullname'],$data['username']);
                        $this->set('message', "tweet posted successfully");
                        $this->set('status',"SUCCESS");
                        
                    }else
                    {
                        $this->set('message', "failure in updating retweet count");
                        $this->set('status',"FAILURE");
                    }

                }else{
                    $this->set('message', "failure in posting retweet");
                    $this->set('status',"FAILURE");
                }
            }else{
                $this->set('message', "please login again");
                $this->set('status',"FAILURE");
            }
        
    }

    public function notify($notifier_id,$notified_id,$tweet_id,$fullname,$username){
        
        if($notifier_id!==null && $notified_id!==null && $tweet_id!==null)
        {
            if($notifier_id!=$notified_id){
                $data= array();
                $data['notifier_id']=$notifier_id;
                $data['notified_id']=$notified_id;
                $data['message']="retweet";
                $data['tweet_id']=$tweet_id;
                $data['notifier_fullname']=  $fullname;
                $data['notifier_username']=  $username;
                $this->loadModel('Notification');
                if($this->Notification->save($data))
                {
                    $this->success("notification added");
                }
                else{
                    $this->failure("error in retweet notification");
                }
            }
        }else{
            $this->failure("Insufficient parameters");
        }
    }    
    
    public function poll() {
        $this->response->type('json');
        $id = $this->Session->read('user');
        $type = $this->request->data['type'];
        if ($id != null) {
            $first = $this->Session->read('top');
            //$type = $this->request->data['type'];
            $tweets = $this->TweetDetail->findTweetsByID($id, null, null, "top", $first,$type);
            $tweet_count= count($tweets);
            if ($tweet_count > 0)
            {
                    $this->set('status', "NEW");
                    if($tweet_count > 1)
                        $this->set('message', "{$tweet_count} new tweets");
                    else
                        $this->set('message', '1 new tweet');
            } 
            else
            {
                $this->set('status', "OLD");
                $this->set('message', 'No new tweets to display');
            }
        } else {
            $this->set('status', "FAILURE");
            $this->set('message', 'error in polling');
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
    /*
    public function discovertweets($id) {
        
    }
     * 
     */
}
