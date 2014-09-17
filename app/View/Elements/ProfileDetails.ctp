<?php
?>
<div id="ProfileDetailsModal" class="modal fade" tabindex="-1" role="dialog">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" id="ProfileDetailsCrossMark">×</button>
                        <h3>Profile</h3>
                    </div>
                    <div class="modal-body">
                        <p>Avatar :</p>
                        <form id="ProfileDetailsForm" enctype="multipart/form-data" method="post" accept-charset="utf-8" style="display: block;">
                            <div style="display:none;">
                                <input type="hidden" name="_method" value="POST">
                            </div>
                            <div class="input file"><input type="file" name="data[Upload][myimage]" id="uploadimage"></div>
                        </form>
                        <hr>
                        <p>Bio :</p>
                        <div class="ProfileDetailsBio">
                            <textarea class="bio-textarea form-control input-xxlarge" id="Bio" cols="20" rows="3" maxlength="160"></textarea>
                        </div>
                        <span id="textcount">160</span>
                        <p class="info pull-right">About yourself in <strong>160</strong> characters or less.</p>  


                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-success pull-left" id="save">Save Changes</button>
                        <button class="btn" data-dismiss="modal" id="ProfileDetailsClose">Close</button>
                    </div>
                </div>
            </div>
        </div>