<?php

class UserDetail extends AppModel {
    /* public function addUser($username,$email,$password,$fullname,$bio)
      {
      try
      {
      //working
      $db = $this->getDataSource();
      //$db->query("insert into user_details (username,email,password,fullname,bio) values (:username,:email,:password,:fullname,:bio)",array('username'=>$username,'email'=>$email,'password'=>$password,'fullname'=>$fullname,'bio'=>$bio));
      $db->query("insert into user_details (username,email,password,fullname,bio) values ('$username','$email','$password','$fullname','$bio')");
      /*
      $db = $this->getDataSource();
      $this->loadModel('TwiminiDatabase');
      $this->TwiminiDatabase->addUser($db);
     * 


      }
      catch (Exception $ex)
      {
      return false;
      }
      return true;
      }
     */

//    public function findByUsername($name) 
//    {
//            $db = $this->getDataSource();
//            $count=$db->query("select Username from user_details where username= :username",array('username'=>$name));
//            $exists = ($db->lastNumRows($count))?TRUE:FALSE;
//            return $exists;
//    }
//    public function findByEmail($email) 
//    {
//            $db = $this->getDataSource();
//            $count=$db->query("select username from user_details where email= :email",array('email'=>$email));
//            $exists = ($db->lastNumRows($count))?TRUE:FALSE;
//            return $exists;
//    }
    public function findByUsernamePassword($name, $pass) {
        $db = $this->getDataSource();
        $result = $db->query("select id,username from user_details where username= :username and password= :password", array('username' => $name, 'password' => $pass));
        return $result;
    }

    public function findByEmailPassword($name, $pass) {
        $db = $this->getDataSource();
        $result = $db->query("select id,username from user_details where email= :email and password= :password", array('email' => $name, 'password' => $pass));
        return $result;
    }

    public function readBio($id) {
        $db = $this->getDataSource();
        $result = $db->query("select bio from user_details where id= :id", array('id' => $id));
        return $result;
    }

    public function getSuggestions($id, $limit, $present_id) {
        $db = $this->getDataSource();
        $condition = "";
//        if ($present_id !== "") {
//            $condition = "AND id NOT IN (" . implode(",", array_map('trim', $present_id)) . ")";
//        }
        if ($limit !== "1" && $limit !== "3") {
            $limit_span = "LIMIT $limit,10";
        } else {
            $limit_span = "LIMIT 0, $limit";
        }
        $followings_user_id = $db->query("SELECT `following_id` AS id FROM `connections` WHERE `follower_id` = ".$id." UNION SELECT follower_id AS id
                                FROM connections
                                WHERE following_id = ".$id);
        $ids = array();
        $all_ids = array();
        for($i=0; $i<count($followings_user_id); $i++){
            array_push($ids, $followings_user_id[$i][0]['id']);
        }
        
        if ($present_id !== "") {
            $all_ids=array_merge($ids,$present_id);
        }
        else
            $all_ids = $ids;
        array_push($all_ids, $id);
        
        $result = $db->query("SELECT id,fullname,username,bio
                                FROM user_details
                                WHERE id NOT 
                                IN (".implode(",",array_map('trim', $all_ids)).") order by no_of_followers desc {$limit_span}");

        return $result;
    }

    public function search($user_id,$keyword, $display) {        
        if ($display == "bar") {
            $limit = "LIMIT 10";
        } else {
            $limit = "";
        }
        $db = $this->getDataSource();
        $result = $db->query("SELECT id,fullname,username,bio,(SELECT EXISTS(SELECT 1 FROM connections WHERE follower_id = id AND following_id = :user_id  AND follow_status=1)) as isFollower,(SELECT EXISTS(SELECT 1 FROM connections WHERE follower_id = :user_id AND following_id = id  AND follow_status=1)) as followstatus FROM user_details where fullname like '{$keyword}%' order by followstatus desc {$limit}",array('user_id'=>$user_id));
        return $result;
    }

}
