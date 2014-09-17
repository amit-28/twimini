<div class="col-md-6">
    <div class="well">
        <?php if(isset($keyword)) { 
            echo '<legend id="title" class="search_page"> Results for "<span id="keyword">'.$keyword.'</span>"</legend>';
            echo '<div id="searchPageOutput" class="searchPageOutput row">
                    
                 </div>';
        } 
        else{
            echo '<legend id="title" class="suggestion_page">People to follow</legend>
                        <div id="suggestion-box" class="row">
                            
                        </div>
                        <div id="progress">
                      
                        </div>';//'<legend id="title" class="suggestion_page">People to follow</legend>';
        }?>
    </div>
</div>
<?php echo $this->Html->script('../app/webroot/js/scripts/commonscript');?>
<?php echo $this->Html->script('../app/webroot/js/scripts/discoverscript');?>
<?php //echo $this->Html->script('../app/webroot/js/mainscript');?>
<!--<ul class="searchpageresult">
                     Search results 
                    <div class="pageResults"></div>
                     Loading... 
                    <li class="pagemore"></li>
                </ul>-->