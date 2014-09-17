<?php

class UploadsController extends AppController {

    public $uses = array();
    public $helpers = array('Html', 'Form');
    public $components = array('RequestHandler');

    public function index() {
        
        if ($this->request->is('post')) {
            $this->response->type('json');
            $username=$this->Session->read('username');
            $name = $this->request->data['Upload']['myimage']['name'];
            $location = WWW_ROOT . "img/upload/".$username.".jpg";
            if (move_uploaded_file($this->request->data['Upload']['myimage']['tmp_name'], $location))
            {
                $res = "File " . $name . " was successfully uploaded and stored";
                $this->set('status','SUCCESS');
            }
            else
            {
                $res = "Could not move " . $this->request->data['Upload']['myimage']['tmp_name'] . " to " . $location;
                $this->set('status','FAILURE');
            }
            $this->set('message',$res);
        }
    }

}

?>