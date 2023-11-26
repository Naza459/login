(function(app) {
	app.ResendActivationComponent =
		ng.core.Component({
		selector: 'resend-activation',
		templateUrl: 'views/resend-v2.html'
		})
		.Class({
		  constructor: [ng.router.ActivatedRoute,
		                ng.router.Router, app.AppCallService,app.MsgComponent,
		  function(active,router,ser,msg) {
			  this.active=this.active;
			  this.router=router;
			  this.ser=ser;
			  this.msg=msg;
		  }],
			getValueMsg:function(){
                var link = ['/login'];
                this.router.navigate(link);
			}
		});
	app.ResendActivationComponent.prototype.ngOnInit=function(){
		this.email=null;
	}
	app.ResendActivationComponent.prototype.validarEmail= function(event,data){
		return keypressvalidarEmail(event,data);
	}
	app.ResendActivationComponent.prototype.send=function(){
		if(this.email==null || this.email==undefined || this.email==""){
			this.mensaje="Debe ingresar el correo electrónico";
			this.msg.warning();
			return;
		}else{
			this.email=this.email.toLowerCase().trim();
		}
		var mensajeAll="Error al crear reenviar código de activación";
		var request=this.ser.callServicesHttp('resend-activation',"?email="+this.email,null);
		request.subscribe(data=>{
			if(data==null || data==undefined  || data==""){
				this.mensaje=mensajeAll;
				this.msg.error();
				return;
			}else{
				if(data.status_http==200){
					delete data['status_http'];
					this.mensaje = "Correo enviado con éxito";
					this.msg.info();
				}else{
					this.mensaje=this.ser.processMessageError(data,mensajeAll);
					this.msg.error();
					return;
				}
			}
		},err=>{
			this.mensaje=this.ser.processError(err,mensajeAll);
			this.msg.error();
			return;
		});
	}
	app.ResendActivationComponent.prototype.clean=function(){
		this.email=null;
	}
	app.ResendActivationComponent.prototype.back=function(){
		window.history.back();
	}
})(window.app || (window.app = {}));