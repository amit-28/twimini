<?php

class NotificationsController extends AppController {

    public function showNotifications() {
        $sessionid = $this->Session->read('user');
        $id = $this->request->data('id');
        $start = intval($this->request->data('start'));
        $type = $this->request->data('type');
        //$range = $start + "," + $limit;
        $this->response->type('json');
        $this->layout = 'ajax';
        if ($id != NULL) {
            if ($sessionid == $id) {
                if ($type == "new") {
                    $data = $this->Notification->find('all', array('conditions' => array('Notification.notified_id' => $id, 'Notification.notification_status' => 0),
                        'order' => 'Notification.notify_time DESC'));
                } else if ($type == "all") {
                    if ($start > 0) {
                        $last_id = $this->Session->read("last_notification");
                        $conditions = array('Notification.notified_id' => $id, 'Notification.id' => '> $last_id');
                    } else {
                        $conditions = array('Notification.notified_id' => $id);
                    }

                    $data = $this->Notification->find('all', array('conditions' => $conditions,
                        'order' => 'Notification.notify_time DESC',
                        'limit' => $start, 20));

                    if (count($data) > 0) {
                        $last_index = count($data) - 1;
                        //var_dump($data);
                        $last_id = intval($data[$last_index]['Notification']['id']);
                        //var_dump($last_id);
                        $this->Session->write('last_notification', $last_id);
                    }
                }
                if (count($data) > 0) {
                    $this->set('data', $data);
                    $this->success("Notification received");
                } else {
                    $this->set('data', NULL);
                    $this->failure("No new notifications");
                }
            } else {
                $this->failure("please login again");
                $this->set('data', NULL);
            }
        } else {
            $this->failure("Parameter missing");
            $this->set('data', NULL);
        }
    }

    public function markreadnotifications() {
        try {
            $sessionid = $this->Session->read('user');
            $id = $this->request->data('id');
            $notification_ids = $this->request->data('readnotificationsids');
            var_dump($notification_ids);
            $this->response->type('json');
            $this->layout = 'ajax';
            if ($id != NULL) {
                if ($sessionid == $id) {
                    foreach ($notification_ids as $value) {
                        $this->Notification->updateAll(array('Notification.notification_status' => true), array('Notification.id' => $value));
                    }
                    $this->success("Notification received");
                } else {
                    $this->failure("please login again");
                }
            } else {
                $this->failure("Parameter missing");
            }
        } catch (Exception $e) {
            $this->failure("Exception");
        }
    }

    public function countnotifications() {
        try {
            $sessionid = $this->Session->read('user');
            $id = $this->request->data('id');
            $this->response->type('json');
            $this->layout = 'ajax';
            if ($id != NULL) {
                if ($sessionid == $id) {


                    $options = array('conditions' => array('notified_id' => $id), 'fields' => array('count(Notification.id) as total','Notification.notification_status'), 'group' => '`Notification`.`notification_status`','order' => 'Notification.notification_status DESC');
                    $total = $this->Notification->find('all', $options);
                    //$data = $this->Notification->find('count', array('conditions' => array('Notification.notification_status' => false, 'notified_id' => $id)))->groupBy(['Notification.notification_status']);
                    if (count($total) > 0) {
                        $this->success("Notification count received");
                        $this->set('data', $total);
                    } else {
                        $this->failure("No notifications yet");
                        $this->set('data', NULL);
                    }
                } else {
                    $this->failure("please login again");
                    $this->set('data', NULL);
                }
            } else {
                $this->failure("Parameter missing");
                $this->set('data', NULL);
            }
        } catch (Exception $e) {
            $this->failure("Exception");
            $this->set('data', NULL);
        }
    }

    public function failure($message) {
        $this->set('message', $message);
        $this->set('status', "FAILURE");
    }

    public function success($message) {
        $this->set('message', $message);
        $this->set('status', "SUCCESS");
    }

}
