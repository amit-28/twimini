<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
class TweetsController extends AppController {
    public $helpers=array('Html','Form');
    
    public function index()
    {
        
    }
    
    public function fetchTweets($id = null) {
        if(!$id)
            throw new NotFoundException(__('Invalid User ID'));
        else
        {
            $this->loadModel('TweetDetail');
            $this->TweetDetail->bindModel(array(

              	'belongsTo' => array(
                		'Tweet' => array(
                                            'conditions' => array('Tweet_id = TweetDetail.Tweet_id')
                               	 	)
                                    )
        			)
				);
            $this->set('tweets',$this->TweetDetail->find('all'));
        }
    }
    
}
