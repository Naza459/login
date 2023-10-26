(function (app) {
    'use strict';
    app.LoadingServiceComponent = ng.core
        .Component({
            selector: 'loading-service',
			template: '<div class="modal" tabindex="-1" role="dialog" style="text-align:center;margin-top:180px;" scroll="no" id="pleaseWaitDialog" data-bs-backdrop="static"  data-backdrop="static" data-keyboard="false">'+
						'<div class="modal-dialog" role="document">'+
							'<img style="width:70px;height:70px;"src="assets/images/loading.gif">'+
						'</div>'+
					'</div>'
        })
        .Class({
           constructor: [
                function () {
                  
                }            
            ]
        });
    app.LoadingServiceComponent.prototype.showPleaseWait=function(){
        $("#pleaseWaitDialog").modal('show');
    }  
    app.LoadingServiceComponent.prototype.hidePleaseWait=function () {
        $("#pleaseWaitDialog").modal('hide');
    }
})(window.app || (window.app = {}));
