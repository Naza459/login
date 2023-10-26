(function(app) {
	app.ActiveComponent =
		ng.core.Component({
		selector: 'active-component',
		templateUrl: 'views/active.html'
		})
		.Class({
		  constructor: [app.AppCallService,ng.router.Router,ng.router.ActivatedRoute,app.LoadingServiceComponent,app.MsgComponent,
		  function(appService,router,active,loading,msg) {
	          this.router=router;
	          this.active=active;
	          this.loading=loading;
	          this.ser=appService;
	          this.mensaje=null;
			  this.msg=msg;
		  }]
		});
	app.ActiveComponent.prototype.ngOnInit=function(){
		this.mensaje=null;
		this.user=null;
		this.activation_code=null;
		if(this.active.hasOwnProperty('queryParams')){
			if(!(this.active.queryParams==null || this.active.queryParams==undefined || this.active.queryParams=="")){
				if(this.active.queryParams.hasOwnProperty('_value')){
					if(!(this.active.queryParams._value==null || this.active.queryParams._value==undefined || this.active.queryParams._value=="")){
						if(this.active.queryParams._value.hasOwnProperty('q')){
							this.activation_code=this.active.queryParams._value.q;
						}
					}
				}
			}
		}
		var mensajeAll="Error al activar cuenta";
		var request=this.ser.callServicesHttp('active',null,this.activation_code);
		request.subscribe(data=>{
			if(!(data==null || data==undefined || data=="")){
				if(data.status_http==200){
					delete data['status_http'];
					this.mensaje="Cuenta activada con éxito";
				}else{
					this.mensaje=this.ser.processMessageError(data,mensajeAll);
				}
			}
		},err=>{
			this.mensaje=this.ser.processError(err,mensajeAll);
		});
	}
	app.ActiveComponent.prototype.back=function(){
		this.router.navigate(['/login']);
	}
})(window.app || (window.app = {}));