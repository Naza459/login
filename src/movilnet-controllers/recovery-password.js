(function(app) {
	app.RecoveryComponent =
		ng.core.Component({
		selector: 'recovery-password',
		templateUrl: 'views/recovery-password-v1.html',
		})
		.Class({
		  constructor: [app.AppCallService,app.MsgComponent,ng.router.Router,ng.router.ActivatedRoute,
		  function(authentication,msg,router,active) {
	          this.msg=msg;
	          this.ser=authentication;
	          this.active=active;
	          this.mensaje="";
	          this.router=router;  
		  }],
		  	getValueMsg: function() {
				var link = ['/login'];
				this.router.navigate(link);
			}
		});
	app.RecoveryComponent.prototype.keyupsearch=function(data,event){
		try{
			if (event.keyCode == 13) {
			    if(!(data==null || data==undefined || data=="")){
					this.changePass(data);
				}
			}
		}catch(err){
			
		}
	}
	app.RecoveryComponent.prototype.ngOnInit=function(){
		try{
			var g=document.getElementsByClassName('modal-backdrop')[0];
			if(g!=null){
				var padre=g.parentNode;
				padre.removeChild(g);
			}
		}catch(er){
		}
		this.token=null;
		this.email=null;
		this.password=null;
		this.confirm_password=null;
		try {
			this.token=null;
			this.email=null;
			if(this.active.hasOwnProperty('queryParams')){
				if(!(this.active.queryParams==null || this.active.queryParams==undefined || this.active.queryParams=="")){
					if(this.active.queryParams.hasOwnProperty('_value')){
						if(!(this.active.queryParams._value==null || this.active.queryParams._value==undefined || this.active.queryParams._value=="")){
							if(this.active.queryParams._value.hasOwnProperty('email')){
								this.email=this.active.queryParams._value.email;
							}
							if(this.active.queryParams._value.hasOwnProperty('q')){
								this.token=this.active.queryParams._value.q;
							}
						}
					}
				}
			}
		} catch (err) {

		}
	}
	app.RecoveryComponent.prototype.changeTypeInputShow=function(data){
		if(!(data==null || data==undefined || data=="")){
			try{
				document.getElementById(data).type="text";
			}catch(er){
				console.log("er");
			}
		}
	}
	app.RecoveryComponent.prototype.changeTypeInputHide=function(data){
		if(!(data==null || data==undefined || data=="")){
			try{
				document.getElementById(data).type="password";
			}catch(er){
				console.log("er");
			}
		}
	}
	app.RecoveryComponent.prototype.back=function(){
		this.router.navigate(['/login']);
	}
	app.RecoveryComponent.prototype.clean=function(){
		this.password=null;
		this.confirm_password=null;
	}
	app.RecoveryComponent.prototype.changePass=function(data){
		var parametros={};
		var email=null;
		if(this.password==null || this.password==undefined || this.password==""){
			this.mensaje="La contraseña no  puede estar vacía";
			this.msg.warning();
			return;
		}else{
			if(checkPwd(this.password.trim())==null){
				parametros.password=this.password.trim();
			}else{
				this.mensaje=checkPwd(this.password.trim());
				this.msg.warning();
				return;
			}
		}
		if(this.confirm_password==null || this.confirm_password==undefined || this.confirm_password==""){
			this.mensaje="La confirmación de contraseña no  puede estar vacía";
			this.msg.warning();
			return;
		}else{
			parametros.password_repeat=this.confirm_password.trim();
		}
		if(!(parametros.password_repeat==parametros.password)){
			this.mensaje="La contraseña no concuerda con la confirmación";
			this.msg.warning();
			return;
		}
		var $key = RSA.getPublicKey(publicKey());
		var querys="?email="+this.email+"&q="+this.token;
			var mensajeAll="Error al cambiar contraseña";
			var request=this.ser.callServicesHttp('recovery',querys,RSA.encrypt(parametros.password.trim(),$key));
			request.subscribe(data=>{
				if(!(data==null || data==undefined || data=="")){
					if(data.status_http==200){
						delete data['status_http'];
						this.mensaje="Contraseña cambiada con éxito";
						try{
							if(data.hasOwnProperty("expiration_date")){
								if(!(data.expiration_date==null || data.expiration_date==undefined || data.expiration_date=="")){
									data.expiration_date=formattingDate(data.expiration_date);
								}
							}
						}catch(er){
							console.log(er);
						}
						this.mensaje=this.mensaje+" la misma expira el: "+data.expiration_date;
						this.msg.info();
					}else{
						this.mensaje=this.ser.processMessageError(data,mensajeAll);
						this.msg.warning();
						return;
					}
				}
			},err=>{
				this.mensaje=this.ser.processError(err,mensajeAll);
				this.msg.warning();
				return
			});
	}
	app.RecoveryComponent.prototype.keyPressCtrlZ=function(event){
		return disabledCtlZ(event);
	}
})(window.app || (window.app = {}));