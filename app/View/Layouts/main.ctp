<!DOCTYPE html>
<html>
    <head>
	<?php echo $this->Html->charset(); ?>
        <title>
		<?php //echo $title_for_layout; ?>
            Twimini
        </title>
        <meta name=viewport content="width=device-width, initial-scale=1">
	<?php
		echo $this->Html->meta('favicon.ico','favicon.ico',array('type' => 'icon'));
                echo $this->Html->script('../app/webroot/js/jquery.min');
                echo $this->Html->script('../app/webroot/js/jquery-ui.min');
                echo $this->Html->script('../app/webroot/js/bootstrap.min.js');
                //echo $this->Html->script('../app/webroot/js/mainscript');
                              
                echo $this->Html->css('../app/webroot/css/bootstrap.min');
                echo $this->Html->css('../app/webroot/css/main.min');
	?>
        <script>
            var user_id = <?php echo $this->Session->read('user'); ?>;
            var username = "<?php echo $this->Session->read('username'); ?>";
        </script>
        <?php echo $this->element('baseurl'); ?>
    </head>
    <body>

        <div id="container">
            <div id="header">
                <h1><?php echo $this->element('header'); ?></h1>
            </div>
            <div class='container-fluid'>
                <div class="row">
                    <div class="leftbar">
                            <?php echo $this->element('left_sidebar'); ?>
                    </div>

                    <div id="content">
                                <?php
                                //echo $this->element('contents'); 
                                    echo $this->fetch('content'); 
                                ?>
                    </div>
                    <div class="rightbar">
                                <?php echo $this->element('right_sidebar'); ?>
                    </div>
                </div>
            </div>
        </div>
                <?php echo $this->element('postalert'); ?>
                <?php echo $this->element('editmodal'); ?>
                <?php echo $this->element('resetpasswordmodal'); ?>
    </body>
</html>

