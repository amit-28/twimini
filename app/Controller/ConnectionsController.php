<?php

class ConnectionsController extends AppController {

    public $components = array('RequestHandler');

    public function follow() {
        $this->response->type('json');
        $following_id = $this->request->data['followingid'];
        $follower_id = $this->Session->read('user');
        $fullname = $this->request->data['fullname'];
        $username = $this->request->data['username'];
        if (!is_null($follower_id) && !is_null($following_id)) {
            $data['follower_id'] = $follower_id;
            $data['following_id'] = $following_id;
            if ($this->Connection->follow($follower_id, $following_id)) {
                $this->loadModel('UserDetail');
                $this->UserDetail->id = $follower_id;
                if ($this->UserDetail->saveField('no_of_following', ($this->UserDetail->field('no_of_following')) + 1)) {
                    $this->UserDetail->id = $following_id;
                    if ($this->UserDetail->saveField('no_of_followers', ($this->UserDetail->field('no_of_followers')) + 1)) {
                        $this->notify($follower_id, $following_id, $fullname, $username);
                        $this->success(" follow successfully");
                    } else {
                        $this->failure("failure in updating follower count");
                    }
                } else {
                    $this->failure("failure in updating following count");
                }
            } else {
                $this->failure("error in following");
            }
        } else {
            $this->failure("missing parameter");
        }
    }

    public function notify($notifier_id, $notified_id, $fullname, $username) {

        if ($notifier_id !== null && $notified_id !== null) {
            $data = array();
            $data['notifier_id'] = $notifier_id;
            $data['notifier_fullname'] = $fullname;
            $data['notifier_username'] = $username;
            $data['notified_id'] = $notified_id;
            $data['message'] = "follow";
            $this->loadModel('Notification');
            if ($this->Notification->save($data)) {
                $this->success("notification added");
            } else {
                $this->failure("error in retweet notification");
            }
        } else {
            $this->failure("Insufficient parameters");
        }
    }

    public function unfollow() {
        $following_id = $this->request->data['followerid'];
        $follower_id = $this->Session->read('user');
        $this->response->type('json');
        if ($follower_id != NULL && $following_id != NULL) {

            if ($this->Connection->unfollow($follower_id, $following_id)) {
                $this->loadModel('UserDetail');
                $this->UserDetail->id = $follower_id;
                if ($this->UserDetail->saveField('no_of_following', ($this->UserDetail->field('no_of_following')) - 1)) {
                    $this->UserDetail->id = $following_id;
                    if ($this->UserDetail->saveField('no_of_followers', ($this->UserDetail->field('no_of_followers')) - 1)) {
                        $this->success(" unfollow successfully");
                    } else {
                        $this->failure("failure in updating follower count");
                    }
                } else {
                    $this->failure("failure in updating following count");
                }
            } else {
                $this->failure("error in saving unfollow");
            }
        } else {
            $this->failure("error in unfollowing");
        }
    }

    public function fetchusers() {
        $this->response->type('json');
        $this->layout = 'ajax';
        $user_id = $this->Session->read('user');
        $id = $this->request->data['id'];
        $option = $this->request->data['option'];
        switch ($option) {
            case 0:                     //followers
                $data = $this->Connection->readFollowers($id, $user_id);
                $this->set('data', $data);
                $this->success("Followers successfully returned");
                break;
            case 1:                     //following
                $data = $this->Connection->readFollowing($id, $user_id);
                $this->set('data', $data);
                $this->success("Following successfully returned");
                break;

            default:
                $this->failure("error in fetching users");
                break;
        }
    }

    public function checkFollowingStatus() {
        $this->response->type('json');
        $user_id = $this->Session->read('user');
        $id = $this->request->query['id'];
        if(!is_null($user_id)) {
            
            //var_dump($id);
            $data = $this->Connection->isFollowing($id, $user_id);
            if(!is_null($data)) {
                $this->set('followstatus', $data);
                $this->success("Following status successfully returned");
            }
            else {
                $this->failure("Error in fetching following status");
            }
        } 
        else {
            $this->failure("User session has expired login again");
        }
    }

    public function failure($message) {
        $this->set('message', $message);
        $this->set('data', NULL);
        $this->set('status', "FAILURE");
    }

    public function success($message) {
        $this->set('message', $message);
        $this->set('status', "SUCCESS");
    }

}
