<?php
?>
<div class="row">
            <div class="col-md-6 col-md-offset-3">
                <img src="<?php echo $this->html->url('/img/twitter-bird-3.png', true); ?>" alt="Twimini" id="birdlogo"/>
                <img src="<?php echo $this->html->url('/img/59ab1bcb0ea0231474c1602e183a4b4e.png', true); ?>" alt="Twimini" id="mainlogo" />
                <div class="well">
                    <form method="post" class="form-horizontal ">
                        
                            <h3>Login</h3><hr>
                            <div class="row">
                                <div class=" col-md-8 col-md-offset-2">
                                    <div class="input-group">
                                            <div class="input-group-addon"><i class="glyphicon glyphicon-user"></i>
                                            </div>
                                            <input type="text" id="usernameemail" name="usernameemail" class="form-control" placeholder="Email/Username" required />
                                        </div>
                                    <label id="missingusernameemail" style="color:red"></label>
                                </div>
                            </div>
                            <div class="row">
                                <div class=" col-md-8  col-md-offset-2">
                                    <div class="input-group">
                                        <div class="input-group-addon"><i class="glyphicon glyphicon-lock"></i>
                                        </div>
                                        <input type="password" class="form-control" name="loginpassword" id="loginpassword" placeholder="Password" autocomplete="off" required/>
                                    </div>
                                    <label id="missingpassword" style="color:red"></label>
                                </div>
                            </div>
<!--                            <div class="row">
                                <div class="col-md-4 col-md-offset-2 ">
                                    <div class="checkbox">
                                        <label><input type="checkbox" id="rememberme"/>Remember Me</label>
                                    </div>
                                </div>
                            </div>-->
                             <label id="loginerror" style="color:red"></label>
                            <hr>
                            <div>
                                <button type="button" class="btn btn-primary pull-left" id="signin" >Sign In</button>
                                <a href="#" class="btn btn-default pull-right" id="openBtn">Register</a><a href="#" class="btn" id="forgotpassword">Forgot Password?</a>
                            </div>
                            
                                          
                    </form>
                    
                </div>
            </div>
        </div>