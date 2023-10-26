(function(app) {
	app.ExpiredPasswordComponent =
		ng.core.Component({
			selector: 'expired-password',
			templateUrl: 'views/expired-password-v1.html'			
		})
		.Class({
			constructor: [app.AppCallService, app.MsgComponent, ng.router.Router,ng.router.ActivatedRoute,
				function(authentication, msg, router,active) {
					this.msg = msg;
					this.mensaje = "";
					this.router = router;
					this.ser = authentication;
					this.active = active;
				}
			]
		});
		
	app.ExpiredPasswordComponent.prototype.ngOnInit = function() {
		this.data_pass=null;
		this.data_passnew=null;
		this.data_reppass=null;
		if(this.active.hasOwnProperty('queryParams')){
			if(this.active.queryParams!=null){
				if(this.active.queryParams.hasOwnProperty('_value')){
					if(this.active.queryParams._value!=null){
						if(this.active.queryParams._value.hasOwnProperty('email')){
							this.email=this.active.queryParams._value.email;
						}
					}
				}
			}
		}
	}
	app.ExpiredPasswordComponent.prototype.changeTypeInputShow=function(data){
		if(!(data==null || data==undefined || data=="")){
			try{
				document.getElementById(data).type="text";
			}catch(er){
				console.log("er");
			}
		}
	}
	app.ExpiredPasswordComponent.prototype.changeTypeInputHide=function(data){
		if(!(data==null || data==undefined || data=="")){
			try{
				document.getElementById(data).type="password";
			}catch(er){
				console.log("er");
			}
		}
	}
	app.ExpiredPasswordComponent.prototype.getValueMsg=function(data){
		var link = ['/login'];
		this.router.navigate(link);;
	}
	app.ExpiredPasswordComponent.prototype.clean = function() {
		this.data_pass="";
		this.data_passnew="";
		this.data_reppass="";
	}
	app.ExpiredPasswordComponent.prototype.back = function() {
		window.history.back();
	}
	app.ExpiredPasswordComponent.prototype.save = function() {
		var parametros = {};
		if(this.data_pass==null || this.data_pass==undefined || this.data_pass==""){
			this.mensaje="Debe ingresar la contraseña actual";
			this.msg.warning();
			return;
		}
		if(this.data_passnew==null || this.data_passnew==undefined || this.data_passnew==""){
			this.mensaje="Debe ingresar la contraseña nueva";
			this.msg.warning();
			return;
		}
		if(checkPwd(this.data_passnew)!=null){
			this.mensaje=checkPwd(this.data_passnew);
			this.msg.warning();
			return;
		}
		if(this.data_reppass==null || this.data_reppass==undefined || this.data_reppass==""){
			this.mensaje="Debe ingresar la confirmación de la nueva contraseña";
			this.msg.warning();
			return;
		}
		if (this.data_passnew.trim()!= this.data_reppass.trim()) {
			this.mensaje = "La confirmación de la nueva contraseña no concuerda";
			this.msg.warning();
			return;
		}
		var password=this.data_pass.trim();
		var new_password=this.data_passnew.trim();
		if(password==new_password){
			this.mensaje="La contraseña anterior y la nueva no pueden ser la misma";
			this.msg.warning();
			return;
		}
		var $key = RSA.getPublicKey(publicKey());
		var json={
			password:RSA.encrypt(password,$key),
			new_password:RSA.encrypt(new_password,$key)
		};
		let mensajeAll="Error al cambiar clave";
		var querys="?email="+this.email;
		var request=this.ser.callServicesHttp('expired-password',querys,json);
		request.subscribe(data => {
			if(data.status_http==200){
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
				this.msg.error();
			}
		}, err => {
			this.mensaje=this.ser.processError(err,mensajeAll);
			this.msg.error();
		});		
	}
	app.ExpiredPasswordComponent.prototype.keyPressCtrlZ=function(event){
		return disabledCtlZ(event);
	}
})(window.app || (window.app = {}));