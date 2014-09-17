<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

?>
<div id="resetPasswordModal" class="modal fade" tabindex="-1" role="dialog">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Reset Password</h3>
            </div>
            <div class="modal-body">
                <form>
                    <div class="form-group">
                        <input type="password" class="form-control input-sm" placeholder="Enter new password" maxlength="32" id="resetPassword" style="width:250px">
                        <label id="resetPasswordMissing"></label>
                        <input type="password" class="form-control input-sm" placeholder="Confirm password" maxlength="32" id="resetPasswordConfirm" style="width:250px">
                        <label id="resetPasswordConfirmMissing"></label>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn btn-success pull-left" id="savePassword">Save</button>
                <label class="pull-left" id="resetPasswordError"></label>
            </div>
        </div>
    </div>
</div>