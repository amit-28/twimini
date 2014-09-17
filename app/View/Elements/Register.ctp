<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
?>
<div id="RegisterModal" class="modal fade" tabindex="-1" role="dialog">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" id="closemark">×</button>
                    <img src="<?php echo $this->html->url('/img/twitter-bird-2-300x300.png', true); ?>" alt="Twimini" id="reg-bird"/><h3>Register</h3>

                </div>
                <div class="modal-body">
                    <div class="well">
                        <form method="post" class="form-horizontal">
                            <fieldset>

                                <div class="row">
                                    <div class=" col-md-8  col-md-offset-2">
                                        <div class="input-group">
                                            <div class="input-group-addon"><i class="glyphicon glyphicon-user"></i>
                                            </div>
                                            <input type="text" class="form-control" id="regfullname" name="regfullname" placeholder="Firstname Lastname" maxlength="60" required/>    
                                        </div>
                                        <label id="missingname" style="color :red"></label>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class=" col-md-8  col-md-offset-2">
                                        <div class="input-group">
                                            <div class="input-group-addon"><i class="glyphicon glyphicon-envelope"></i>
                                            </div>
                                            <input type="text" class="form-control" placeholder="Enter Email Address" id="regemail" name="regemail" maxlength="50" autocomplete="off" required/>                                       
                                        </div>
                                        <label id="uniqueemailcheck"></label>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class=" col-md-8  col-md-offset-2">
                                        <div class="input-group">
                                            <div class="input-group-addon">@</div>
                                            <input type="text" class="form-control" placeholder="Choose a username" id="regusername" name="regusername" maxlength="30" autocomplete="off" required/>                                        
                                        </div>
                                        <label id="uniqueusernamecheck"></label>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class=" col-md-8  col-md-offset-2">
                                        <div class="input-group">
                                            <div class="input-group-addon"><i class="glyphicon glyphicon-lock"></i>
                                            </div>
                                            <input type="password" class="form-control" id="regpassword" name="regpassword" placeholder="Password with minimum 8 characters" maxlength="32" autocomplete="off" required/>                                      
                                        </div>
                                        <label id="passwordstrength"></label>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class=" col-md-8  col-md-offset-2">
                                        <div class="input-group">
                                            <div class="input-group-addon"><i class="glyphicon glyphicon-ok-sign"></i>
                                            </div>
                                            <input type="password" class="form-control" id="regconfirmpassword" name="regconfirmpassword" placeholder="Confirm Password" maxlength="32" required/>                                      
                                        </div>
                                        <label id="passwordconfirm"></label>
                                    </div>
                                </div>
                                <div></div>
                            </fieldset>

                            <div class="modal-footer">
                                <button type="button" class="btn btn-primary pull-left" id="register">Register</button>
                                <button type="button" class="btn btn-primary " id="reset">Reset</button>
                                <button type="button" class="btn" data-dismiss="modal" id="closebutton">Close</button>
                            </div>
                        </form>

                    </div>
                    <label id="regerrormsg"></label>
                    <!--register ends-->
                </div>
            </div>
        </div>
    </div>
