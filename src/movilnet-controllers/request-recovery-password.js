(function(app) {
	app.RequestRecoveryPasswordComponent =
		ng.core.Component({
			selector: 'request-recovery-password',
			templateUrl: 'views/request-recovery-password-v2.html',
			outputs: ['salida']
			
		})
		.Class({
			constructor: [app.AppCallService, ng.router.ActivatedRoute,app.MsgComponent, ng.router.Router,
				function(ser,active, msg, router) {
					this.msg = msg;
					this.mensaje = "";
					this.router = router;
					this.active = active;
					this.ser=ser;
				} 
			],
			getValueMsg: function() {
				this.router.navigate(['/login']);
			}
		});
	app.RequestRecoveryPasswordComponent.prototype.ngOnInit = function() {
		this.email=null;
		this.listQuestion=[];
	}
	app.RequestRecoveryPasswordComponent.prototype.keyupsearch=function(data,event){
		try{
			if (event.keyCode == 13) {
			    if(this.listQuestion==null || this.listQuestion.length==0){
					if(!(data==null || data==undefined || data=="")){
						this.searchQuestion(data);
					}
				}else{
					if(this.listQuestion!=null && this.listQuestion.length!=0){
						this.reset();
					}
				}
			}
		}catch(err){
			
		}
	}
	app.RequestRecoveryPasswordComponent.prototype.clean = function() {
		this.email=null;
		this.listQuestion=[];
	}
	app.RequestRecoveryPasswordComponent.prototype.changeTypeInputShow=function(data){
		if(!(data==null || data==undefined || data=="")){
			try{
				document.getElementById(data).type="text";
			}catch(er){
				console.log("er");
			}
		}
	}
	app.RequestRecoveryPasswordComponent.prototype.changeTypeInputHide=function(data){
		if(!(data==null || data==undefined || data=="")){
			try{
				document.getElementById(data).type="password";
			}catch(er){
				console.log("er");
			}
		}
	}
	app.RequestRecoveryPasswordComponent.prototype.searchQuestion=function(data){
		if(data==null || data==undefined || data==""){
			this.mensaje="Debe ingresar el correo electrónico";
			this.msg.warning();
			return;
		}else{
			if (!(validarEmail(data))) {
				this.mensaje = "Formato de correo electrónico inválido";
				this.msg.warning();
				return;
			}
			var querys="&email="+data.toLowerCase().trim();
			var mensajeAll="Error al consultar preguntas asociadas";
			var request=this.ser.callServicesHttp('search-question',querys,null);
			request.subscribe(data=>{
				if(!(data==null || data==undefined || data=="")){
					if(data.status_http==200){
						delete data['status_http'];
						this.listQuestion=[];
						var objeto={};
						if(data.hasOwnProperty("body")){
							if(!(data.body==null || data.body==undefined || data.body.length==0)){
								for(var i=0; i<data.body.length;i++){
									objeto={};
									objeto.name=data.body[i];
									objeto.value=null;
									this.listQuestion.push(objeto);
								}
							}else{
								this.mensaje="Se envió un correo electrónico para continuar";
								this.msg.info();
							}
						}else{
							this.mensaje="Se envió un correo electrónico para continuar";
							this.msg.info();
						}
					}else{
						this.mensaje=this.ser.processMessageError(data,mensajeAll);
						if(data.hasOwnProperty("message")){
							if(data.message==null){
								this.mensaje="Se envió un correo electrónico para continuar";
							}else{
								if(data.message.toUpperCase()=="USER_IS_BLOCKED"){
									this.mensaje="Usuario bloqueado";
								}else{
									this.mensaje="Se envió un correo electrónico para continuar";
								}
							}
						}else{
							this.mensaje="Se envió un correo electrónico para continuar";
						}
						this.msg.info();
					}
				}
			},err=>{
				this.mensaje=this.ser.processError(err,mensajeAll);
				this.mensaje="Se envió un correo electrónico para continuar";
				this.msg.info();
			});
		}
	}
	app.RequestRecoveryPasswordComponent.prototype.reset = function() {
		var parametros = [];
		var question = {};
		let body = {}; 
		if (this.email == null || this.email == undefined || this.email == "") {
			this.email=this.email.trim();
			this.mensaje = "Para recuperar la contraseña debe ingresar el correo electrónico";
			this.msg.warning();
			return;
		} else {
			if (!(validarEmail(this.email))) {
					this.mensaje = "Formato de correo electrónico inválido";
					this.msg.warning();
					return;
				}
			}
			if(this.listQuestion==null || this.listQuestion==undefined || this.listQuestion.length==0){
				this.mensaje="Debe ingresar las preguntas de seguridad";
				this.msg.warning();
				return;
			}else{
				var listAux=[];
				var aux0={};
				for(var i=0; i<this.listQuestion.length;i++){
					if(this.listQuestion[i]!=null){
						aux0={};
						if(this.listQuestion[i].hasOwnProperty('name')){
							aux0.question=this.listQuestion[i].name;
						}
						if(this.listQuestion[i].hasOwnProperty('value')){
							if(this.listQuestion[i].value==null || this.listQuestion[i].value==undefined || this.listQuestion[i].value=="" || this.listQuestion[i].value=="null"){
								this.mensaje="Debe ingresar la respuesta "+(i+1);
								this.msg.warning();
								return;
							}else{
								this.listQuestion[i].value=this.listQuestion[i].value.toLowerCase().trim();
							}
							aux0.answer=this.listQuestion[i].value;
						}
						listAux.push(aux0);
					}
				}
				body.email = this.email;
				body.email_to_send_url = [this.email];
				body.security_questions = listAux;
				parametros = listAux;
			}
			var querys="?email="+this.email.toLowerCase().trim();
			var mensajeAll="Error al enviar solicitud de recuperación de contraseña";
			var request=this.ser.callServicesHttp('reset',querys,body);
			request.subscribe(data=>{
				if(!(data==null || data==undefined || data=="")){
					if(data.status_http==200){
						this.email=null;
						this.listQuestion=[];
						delete data['status_http'];
						this.mensaje = "Correo de recuperación enviado";
						this.msg.info();
					}else{
						this.mensaje=this.ser.processMessageError(data,mensajeAll);
						this.msg.error();
					}
				}
			},err=>{
				this.mensaje=this.ser.processError(err,mensajeAll);
				this.msg.error();
			});
	}
	app.RequestRecoveryPasswordComponent.prototype.validarEmail= function(event,data){
		return keypressvalidarEmail(event,data);
	}
	app.RequestRecoveryPasswordComponent.prototype.back = function() {
		window.history.back();
	}
})(window.app || (window.app = {}));