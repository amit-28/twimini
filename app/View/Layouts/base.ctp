<!DOCTYPE html>
<!--
To change this license header, choose License Headers in Project Properties.
To change this template file, choose Tools | Templates
and open the template in the editor.
-->
<html>
    <head>
        <title>Twimini</title>
        <link rel="shortcut icon" href= "/img/twitter_logo.jpg" />
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        
        <?php echo $this->Html->css('../app/webroot/css/bootstrap.min'); ?>
        <?php echo $this->Html->css('../app/webroot/css/base.min'); ?>

        <?php echo $this->Html->script('../app/webroot/js/jquery.min'); ?>
        <?php echo $this->Html->script('../app/webroot/js/bootstrap.min'); ?>
        <?php echo $this->Html->script('../app/webroot/js/jquery-ui.min'); ?>
        <?php echo $this->Html->script('../app/webroot/js/BaseScript.min'); ?>
        <?php echo $this->element('baseurl'); ?>
    </head>



    <div class="container">
        <?php
            echo $this->element('Login');
            //echo $this->element('ExtraProfileDetails');
        ?>

    </div>
         <?php
            echo $this->element('Register'); 
                
            echo $this->element('ForgotPassword'); 
        
            echo $this->element('ProfileDetails'); 
        ?>
    

</body>
</html>
