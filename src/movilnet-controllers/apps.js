(function(app) {
	app.AppsComponent =
		ng.core.Component({
		selector: 'apps',
		templateUrl: 'views/apps-v3.html',
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
	app.AppsComponent.prototype.ngOnInit=function(){
		this.title="";
		this.mensajeError=null;
		this.dispositivo_nuevo=false;
		this.showMessageResend=false;
		this.apps=[];
		if(this.ser.getAccessToken()==null){
			doLogout();
			this.router.navigate(['/login']);
		}else{
			this.getLoginDevice();
		}
	}
	app.AppsComponent.prototype.getLoginDevice=function() {
		this.mensajeError=null;
		var parametros={};
		parametros.fingerprint=this.ser.getFingerPrint();
		this.fingerprint=this.ser.getFingerPrint();
		var aux9=returnClientjs();
		if(aux9!=null){
			parametros.features={};
			if(aux9.hasOwnProperty("device")){
				parametros.features.device=JSON.stringify(aux9.device);
				if(!(aux9.device==null || aux9.device==undefined || aux9.device=="")){
					if(aux9.device.hasOwnProperty("type")){
						this.device_type=aux9.device.type;
						parametros.type=aux9.device.type;
					}
				}
			}
			if(aux9.hasOwnProperty("browser")){
				if(!(aux9.browser==null || aux9.browser==undefined || aux9.browser=="")){
					parametros.features.browser=JSON.stringify(aux9.browser);
					if(aux9.browser.hasOwnProperty("name")){
						this.so=aux9.browser.name;
					}
					if(aux9.browser.hasOwnProperty("image_uri")){
						this.imageUrl=getStatic()+aux9.browser.image_uri;
					}
				}
			}
		}
		this.dataShow = "Obteniendo información del dispositivo";
		if(this.ser.getFingerPrint()==null || this.ser.getFingerPrint()==undefined || this.ser.getFingerPrint()==""){
			doLogout();
			this.router.navigate(['/login']);
		}else{
			parametros.fingerprint=this.ser.getFingerPrint();
			this.fingerprint=parametros.fingerprint;
			this.iniciarSesionDevice(parametros);
		}
	}
	app.AppsComponent.prototype.iniciarSesionDevice=function(parametros){
		var mensajeAll="Error al iniciar en el dispositivo";
		var contexto=this;
		var request = this.ser.callServicesHttp("login-device",null, parametros);
		request.subscribe(data=>{
			if(data==null || data==undefined || data==""){
				this.mensajeError=mensajeAll;
				setTimeout(function() {
						doLogout();
						contexto.router.navigate(['/login']);
				}, 3000);
			}else{
				if(data.status_http==200){
					this.dispositivo_nuevo=false;
					delete data['status_http'];
					var aux8=JSON.stringify(data);
					this.ser.setDeviceActual(aux8);
					this.ser.setFingerPrint(this.fingerprint);
					this.getRoles();
				}else{
					if(data.hasOwnProperty("message")){
						if(data.message==null || data.message==""  || data.message==undefined){
							this.mensajeError=mensajeAll;
							setTimeout(function() {
								doLogout();
								contexto.router.navigate(['/login']);
							}, 2000);
						}else{
							if(data.message.toUpperCase()=="DEVICE NOT AUTHORIZED" || data.message.toUpperCase()=="AUTHORIZATION_EMAIL_SENDED"){
								this.dispositivo_nuevo=true;
								this.nombre_new=null;
								this.codigo=null;
								}else{
									this.mensajeError=this.ser.processMessageError(data,mensajeAll);
									setTimeout(function() {
										doLogout();
										contexto.router.navigate(['/init']);
									}, 3000);
								}
							}
						}else{
							this.mensajeError=mensajeAll;
							setTimeout(function() {
								doLogout();
								contexto.router.navigate(['/init']);
							}, 3000);
						}
					}
				}
			},err=>{
				this.mensajeError=this.ser.processError(err,mensajeAll);
					setTimeout(function() {
						doLogout();
						contexto.router.navigate(['/init']);
					}, 3000);
			}
		);
	}
	app.AppsComponent.prototype.autorizate=function(){
		var querys=null;
		var contexto=this;
		let json = {}
		if(this.codigo==null || this.codigo==undefined || this.codigo==""){
			this.mensaje="Debe ingresar el código de seguridad";
			this.msg.warning();
			return;
		}
		
		json.fingerprint = this.fingerprint;
		// json.auth_code = this.codigo.toUpperCase().trim();
		json.auth_code = this.codigo;

		// querys="?fingerprint="+this.fingerprint+"&auth_code="+this.codigo.toUpperCase().trim();
		querys="?fingerprint="+this.fingerprint+"&auth_code="+this.codigo;
		
		if(!(this.nombre_new==null || this.nombre_new==undefined || this.nombre_new=="")){
			querys=querys+"&name="+this.nombre_new.trim().toUpperCase();
			json.name=this.nombre_new.trim().toUpperCase();
		}
		var mensajeAll="Error al obtener estatus de la autorización del dispositivo";
		var request=this.ser.callServicesHttp('autorize-device',querys,json);
		request.subscribe(data=>{
			if(!(data==null || data==undefined || data=="")){
				if(data.status_http==200){
					this.dispositivo_nuevo=false;
					delete data['status_http'];
					var aux8=JSON.stringify(data);
					this.ser.setDeviceActual(aux8);
					this.ser.setFingerPrint(this.fingerprint);
					this.getRoles();
				}else{
					this.mensaje=this.ser.processMessageError(data,mensajeAll);
					this.msg.error();
					setTimeout(function() {
						doLogout();
						contexto.router.navigate(['/login']);
					}, 3000);
				}
			}
		},err=>{
			this.mensaje=this.ser.processError(err,mensajeAll);
			setTimeout(function() {
				doLogout();
				contexto.router.navigate(['/login']);
			}, 3000);
		});
	}
	app.AppsComponent.prototype.reenviarCorreo=function(){
		var mensajeAll="Error al enviar correo electrónico de autorización";
		var querys="?fingerprint="+this.fingerprint;
		var request=this.ser.callServicesHttp('resend-code',querys,null);
		request.subscribe(data2=>{
			if(!(data2==null || data2==undefined || data2=="")){
				if(data2.status_http==200){
					delete data2['status_http'];
					this.mensaje = "Correo electrónico enviado con éxito";
					this.msg.info();
				}else{
					this.mensaje=this.ser.processMessageError(data2,mensajeAll)
					this.msg.info();
				}
			}
		},err=>{
			this.mensaje=this.ser.processError(err,mensajeAll);
			this.msg.info();
		});
	}
	app.AppsComponent.prototype.formattedRole=function(data){
		if(data==null || data==undefined  || data==""){
			return null;
		}else{
			var user={};
			if(data.hasOwnProperty("user_email")){
				if(!(data.user_email==null || data.user_email==undefined || data.user_email=="")){
					this.email_usuario=data.user_email;
					user.email=data.user_email;
				}
				if(!(data.user_name==null || data.user_name==undefined || data.user_name=="")){
					this.nombre_usuario=data.user_name;
					user.name=data.user_name;
				}
				this.ser.setDataUser(user);
			}
			if(data.hasOwnProperty("owner_name")){
				if(!(data.owner_name==null || data.owner_name==undefined || data.owner_name=="")){
					data.formatted_owner_name=data.owner_name;
				}
			}
			if(data.hasOwnProperty('app_name')){
				if(!(data.app_name==null || data.app_name==undefined || data.app_name=="")){
					data.formatted_app_name=_(data.app_name).toUpperCase();
				}
			}
			if(data.hasOwnProperty("app_icon")){
				if(!(data.app_icon==null || data.app_icon==""|| data.app_icon==undefined)){
					if(validarRutaAbsoluta(data.app_icon)){
						data.imagen=data.app_icon;
					}else{
						data.imagen=getStatic()+data.app_icon;
					}
				}
			}
			return data;
		}
	}	
	app.AppsComponent.prototype.getRoles=function(){
		let mensajeAll = "Error al obtener roles";
		var contexto=this;
		let request = this.ser.callServicesHttp("roles-auth", null, null);
		request.subscribe(data => {
			if (data == null || data == undefined || data == "") {
				this.mensajeError = mensajeAll;
			} else {
				if (data.status_http == 200) {
					delete data['status_http'];
					if(data.hasOwnProperty("profile")){
						if(!(data.profile==null || data.profile==undefined || data.profile=="")){
							init=data.profile;
							if(data.hasOwnProperty("country")){
								if(!(data.country==null || data.country==undefined || data.country=="")){
									init.country=data.country;
								}
							}
							this.ser.setInit(init);
						}
					}
					if(data.hasOwnProperty("roles")){
						if(!(data.roles==null || data.roles==undefined || data.roles=="" || data.roles.length==0)){
							let aux1=null;
							try{
								aux1=data.roles;
							}catch(er){
								aux1=null;
							}
							if(aux1!=null){
								if(aux1.length==1){
									this.title="Opción disponible";
								}else{
									this.title="Opciones disponibles";
								}
								for(var i=0;i<aux1.length;i++){
									objeto=this.formattedRole(aux1[i]);
									if(objeto!=null){
										this.apps.push(objeto);
									}
								}
							}
						}else{
							this.title="No tienes módulos asignados";
						}
					}else{
						this.title="No tienes módulos asignados";
					}
				} else {
					this.mensajeError = this.ser.processMessageError(data, mensajeAll);
					setTimeout(function() {
						doLogout();
						contexto.router.navigate(['/login']);
					}, 3000);
				}
			}
		}, err => {
			this.mensajeError = this.ser.processMessageError(err, mensajeAll);
			setTimeout(function() {
				doLogout();
				contexto.router.navigate(['/login']);
			}, 3000);
		});
	}
    app.AppsComponent.prototype.openEnlace=function(data){	
		this.ser.removeKey('role');
		this.ser.removeKey('menu_formatted');
		this.ser.setRole(data);
		window.location.href = data.app_url;
		//window.open(data.app_url, '_blank');
    }
})(window.app || (window.app = {}));