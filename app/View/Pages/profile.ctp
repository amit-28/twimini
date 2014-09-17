<div class="col-md-6 ">
    <div class="well">
      
      <div class="tabbable" >
        <ul class="nav nav-pills nav-justified">
          <li class="active"><a href="#tweets-tab" data-toggle="tab" >Tweets</a></li>
          <li><a href="#following-tab" data-toggle="tab">Following</a></li>
          <li><a href="#followers-tab" data-toggle="tab" id="followertablink">Followers</a></li>
        </ul>
        <div class="tab-content">
          <div class="tab-pane active" id="tweets-tab">

            <div class="tweet-container" id="tweet-wall">
                <div class="pollresult"></div>
            </div>
              <center>
                  <div id="progress">
                      
                  </div>
              </center> 
          </div>
          <div class="tab-pane" id="following-tab">
            	
            <div class="row">
            
      
       	    </div><!--Row ends-->
            
            
          </div>
        
          <div class="tab-pane" id="followers-tab">
            <div class="row">
          
		</div><!--Row ends-->
          </div>
          
        </div>
      </div>
      
    </div>
  </div>
<script>
    var visitor_id =<?php echo $data;?>;
    var user_id =<?php echo $this->Session->read('user');?>;
</script>
<?php echo $this->Html->script('../app/webroot/js/scripts/profilescript');?>
<?php echo $this->Html->script('../app/webroot/js/scripts/commonscript');?>
