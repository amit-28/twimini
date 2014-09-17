<?php

/**
 * Static content controller.
 *
 * This file will render views from views/pages/
 *
 * CakePHP(tm) : Rapid Development Framework (http://cakephp.org)
 * Copyright (c) Cake Software Foundation, Inc. (http://cakefoundation.org)
 *
 * Licensed under The MIT License
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) Cake Software Foundation, Inc. (http://cakefoundation.org)
 * @link          http://cakephp.org CakePHP(tm) Project
 * @package       app.Controller
 * @since         CakePHP(tm) v 0.2.9
 * @license       http://www.opensource.org/licenses/mit-license.php MIT License
 */
App::uses('AppController', 'Controller');

/**
 * Static content controller
 *
 * Override this controller by placing a copy in controllers directory of an application
 *
 * @package       app.Controller
 * @link http://book.cakephp.org/2.0/en/controllers/pages-controller.html
 */
class PagesController extends AppController {

    /**
     * This controller does not use a model
     *
     * @var array
     */
    public $uses = array();

    /**
     * Displays a view
     *
     * @param mixed What page to display
     * @return void
     * @throws NotFoundException When the view file could not be found
     * 	or MissingViewException in debug mode.
     */
    public function display() {
        $path = func_get_args();

        $count = count($path);
        if (!$count) {
            return $this->redirect('/');
        }
        $page = $subpage = $title_for_layout = null;

        if (!empty($path[0])) {
            $page = $path[0];
        }
        if (!empty($path[1])) {
            $subpage = $path[1];
        }
        if (!empty($path[$count - 1])) {
            $title_for_layout = Inflector::humanize($path[$count - 1]);
        }
        $this->set(compact('page', 'subpage', 'title_for_layout'));

        try {
            $this->render(implode('/', $path));
        } catch (MissingViewException $e) {
            if (Configure::read('debug')) {
                throw $e;
            }
            throw new NotFoundException();
        }
    }

    public function base() {

        $sessionid = $this->Session->read('user');
        if ($sessionid != null) {
            $this->redirect(array('controller' => 'Pages', 'action' => 'main'));
        }
        $this->layout = 'base';
    }

    public function main() {
        $sessionid = $this->Session->read('user');
        if ($sessionid != null) {
            //$this->loadModel('UserDetail');
            //$this->set("user_detail", $this->UserDetail->findById($sessionid));
            $this->layout = 'main';
            //$this->redirect(array('controller'=>'UserDetails','action'=>'getProfile','main'));
        } else {
            $this->redirect(array('controller' => 'Pages', 'action' => 'base'));
        }
    }

    public function profile() {
        //$this->layout='main';

        $sessionid = $this->Session->read('user');
        if ($sessionid != null) {
            $this->set("status", "SUCCESS");
            $this->set("message", "All working");
            //$data=array();
            $username = $this->request->params['username'];
            $this->loadModel('UserDetail');
            $array = $this->UserDetail->findByusername($username);
            $id = $array['UserDetail']['id'];
//                if($sessionid===$id)
//                {
//                    $this->redirect(array('controller'=>'Pages','action'=>'main'));
//                }
            $this->set("data", $id);
            $this->layout = 'main';
        } else {
            $this->redirect(array('controller' => 'Pages', 'action' => 'base'));
        }
    }

    public function discover($key = null) {
        $sessionid = $this->Session->read('user');
        if ($sessionid != null) {
            if (isset($key)) {
                $this->set('keyword', $key);
            }
            $this->layout = 'main';
        } else {
            $this->redirect(array('controller' => 'Pages', 'action' => 'base'));
        }
    }

    public function notifications() {
        $sessionid = $this->Session->read('user');
        if ($sessionid != null) {
            $this->layout = 'main';
        } else {
            $this->redirect(array('controller' => 'Pages', 'action' => 'base'));
        }
    }

}
