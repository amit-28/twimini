<?php

// 
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 *///$this->layout='home'; ?>

<div class="navbar navbar-default navbar-fixed-top" align="center">
    <div class="navbar-header"><a class="navbar-brand" href="/"><i class="glyphicon glyphicon-comment icon-large"></i>Twimini</a>
    </div>
    <div class="navigation">
        <ul class="nav navbar-nav ">
            <li class="active" id="home"><a href="<?php echo $this->html->url('/',true); ?>"><i class="glyphicon glyphicon-home"></i>Home</a></li>
            <li id="discover"><a href="<?php echo $this->html->url('/discover',true); ?>"><i class="glyphicon glyphicon-globe"></i>Discover</a></li>
            <li id="me"><a href="<?php echo $this->html->url('/'.$this->Session->read('username'), true); ?>" id="me_link"><i class="glyphicon glyphicon-user"></i>Me</a></li>

        </ul>

        <ul class="nav navbar-nav pull-right">
            <li><a href="<?php echo $this->html->url('/'.$this->Session->read('username'), true); ?>" data-toggle="tooltip" data-placement="right" title="Notifications"><i class="glyphicon glyphicon-user"></i><?php echo $this->Session->read('username');?></a></li>
            <li><a href="#" data-toggle="tooltip" data-placement="right" title="Notifications"><i class="glyphicon glyphicon-bell" id="notifybell"></i></a><span class="badge badge-notify" id="noofnotifications"></span>
            </li>    
            <div id="notificationOutput" class="notificationOutput" style="display:none;">
                    <ul class="notifyresult">
                        <!-- Search results -->
                        <div class="NotifyResults"></div>
                        <!-- Loading... -->
                        <li class="seemore"></li>
                    </ul>
                </div>
            <li><a href="#" data-toggle="tooltip" data-placement="right" title="Edit Profile" id="editProfile"><i class="glyphicon glyphicon-edit"></i></a></li>
            <li><a href="#" data-toggle="tooltip" data-placement="left" title="Log out"><i class="glyphicon glyphicon-off" id="logout"></i></a></li>
        </ul>
        
        <form class="navbar-search pull-right">
            <input class="form-control" placeholder="Search for people.." autocomplete="off" tabindex="0" id="SearchBar" type="text">
            <div id="searchOutput" class="searchOutput" style="display:none;">
                <ul class="searchresult">
                    <!-- Search results -->
                    <div class="Results"></div>
                    <!-- Loading... -->
                    <li class="more"></li>
                </ul>
            </div>
        </form> 

    </div>
</div>