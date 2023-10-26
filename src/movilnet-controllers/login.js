(function(app) {
	app.LoginComponent =
		ng.core.Component({
		selector: 'login',
		templateUrl: 'views/login-v4.html'		
	})
	.Class({
		constructor: [ng.router.ActivatedRoute,ng.router.Router,app.AppCallService,app.MsgComponent,
			function(active,router,service,msg) {
				this.active=active;
				this.router=router;
				this.ser=service;
				this.msg=msg;
			}
		]
	});
	app.LoginComponent.prototype.keyupsearch=function(event){
		try{
			if (event.keyCode == 13) {
				this.authPasswordGrant();
			}
		}catch(err){
			
		}
	}		
	app.LoginComponent.prototype.ngOnInit=function(){
		this.email=null;
		this.password=null;
		try{
			var g=document.getElementsByClassName('modal-backdrop')[0];
			if(g!=null){
				var padre=g.parentNode;
				padre.removeChild(g);
			}
		}catch(y){
		}
		try{
			var g=document.getElementById('sidenav-overlay');
			if(g!=null){
				var padre=g.parentNode;
				padre.removeChild(g);
			}
		}catch(r4){
		}
		if(this.ser.getAccessToken()==null){
			this.ser.setRealm(null);
		}else{
			this.router.navigate(['/apps']);
		}
	}
	app.LoginComponent.prototype.validarEmail= function(event,data){
		return keypressvalidarEmail(event,data);
	}
	app.LoginComponent.prototype.keyPressCtrlZ=function(event){
		return disabledCtlZ(event);
	}
	app.LoginComponent.prototype.changeTypeInputShow=function(data){
		if(!(data==null || data==undefined || data=="")){
			try{
				document.getElementById(data).type="text";
			}catch(er){
				console.log("er");
			}
		}
	}
	app.LoginComponent.prototype.changeTypeInputHide=function(data){
		if(!(data==null || data==undefined || data=="")){
			try{
				document.getElementById(data).type="password";
			}catch(er){
				console.log("er");
			}
		}
	}
    app.LoginComponent.prototype.authPasswordGrant=function(){
		this.fingerprint=null;
		var gran_type="password";
		var client_id=getClient();
		var redirect_uri=redirectUri();
		var scope=null;
		var username=null;
		var password=null;
		if (this.email == null || this.email == undefined || this.email == "") {
			this.mensaje = "Debe ingresar el correo electrónico";
			this.msg.warning();
			return;
		} else {
			const emailRegex = /^[-\w._-]{2,64}@(?:[A-Z]{1,63}\.){1,125}[A-Z]{2,63}$/i;

			if(!emailRegex.test(this.email)){
				this.mensaje = "Debe ingresar un correo electrónico válido";
				this.msg.warning();
				return;
			}else{
				username=this.email.trim().toLowerCase();
			}
		}
		if (this.hasOwnProperty('password')) {
			if (this.password == null || this.password == undefined || this.password == "") {
				this.mensaje = "Debe ingresar la contraseña.";
				this.msg.warning();
				return;
			}else{
				password=this.password.trim();
			}
		} else {
			this.mensaje = "Debe ingresar la contraseña.";
			this.msg.warning();
			return;
		}
		this.user=username;
		var $key = RSA.getPublicKey(publicKey());
		var h=RSA.encrypt(password,$key);
		var parametros=null;
		let request=null;
		parametros={
			client_id: client_id,
			redirect_uri: redirect_uri,
			username: username,
			password: h,
			scopes: scope
		};
		if(this.ser.getFingerPrint()==null || this.ser.getFingerPrint()==undefined || this.ser.getFingerPrint()==""){
			this.fingerprint=create_UUID();
			parametros.fingerprint=this.fingerprint;
			this.ser.setFingerPrint(this.fingerprint);
			this.iniciarSesion(parametros);
		}else{
			parametros.fingerprint=this.ser.getFingerPrint();
			this.fingerprint=parametros.fingerprint;
			this.iniciarSesion(parametros);
		}
	}
	app.LoginComponent.prototype.iniciarSesion=function(parametros){
		var mensajeAll="Error al iniciar sesión";
		request=this.ser.callServicesHttp('login',"?grant_type=password",parametros);
		request.subscribe(data=>{
			if(data==null || data==undefined || data==""){
				this.mensaje=mensajeAll;
				this.msg.error();
			}else{
				if(data.status_http==200){
					delete data['status_http'];
					if(data.hasOwnProperty("access_token")){
						if(!(data.access_token==null || data.access_token==undefined || data.access_token=="")){
							this.ser.setAccessToken(data.access_token);
						}
					}
					if(data.hasOwnProperty("refresh_token")){
						if(!(data.refresh_token==null || data.refresh_token==undefined || data.refresh_token=="")){
							this.ser.setRefreshToken(data.refresh_token);
						}
					}
					if(data.hasOwnProperty("expires_in")){
						if(!(data.expires_in==null || data.expires_in==undefined || data.expires_in=="" || data.expires_in==0)){
							var tiempo=data.expires_in;
							this.ser.setTimeSession(tiempo);
							asyncSqrt(tiempo,function(value, result) {});
						}
					}
					this.router.navigate(['/apps']);
				}else{
					if(data.message=="MORE_THAN_ACTIVE_SESSION"){
						this.mensaje="Tienes un sesión activa";
						this.msg.warning();
						return;
					}else{
						try{
							if(data.message.toUpperCase()=="PASSWORD_EXPIRED"){
								this.router.navigate(['/expired-password'], { queryParams: { email: parametros.username} });
							}else{
								this.mensaje=this.ser.processMessageError(data,mensajeAll);
								this.msg.error();
							}
						}catch(Er){
							// console.log("Er",Er);
							this.mensaje=this.ser.processMessageError(data,mensajeAll);
							this.msg.error();
						}
					}
				}
			}
		},err=>{
			// console.log('err',err);
			this.mensaje=this.ser.processError(err,mensajeAll);
			this.msg.error();
		});
	}
})(window.app || (window.app = {}));