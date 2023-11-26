(function(app) {
	app.RegisterEandPComponent =
		ng.core.Component({
		selector: 'register-with-email',
		templateUrl: 'views/register-eap-v1.html'
		})
		.Class({
		  constructor: [ng.router.ActivatedRoute,
		                ng.router.Router, app.AppCallService,app.MsgComponent,
		  function(active,router,ser,msg) {
			  this.active=active;
			  this.router=router;
			  this.ser=ser;
			  this.msg=msg;
		  }],
			getValueMsg:function(){
                var link = ['/login'];
                this.router.navigate(link);
			}
		});
	app.RegisterEandPComponent.prototype.ngOnInit=function(){
		this.response1=null;
		this.question1=null;
		this.question2=null
		this.preguntas1=[];
		this.preguntas2=[];
		this.response2=null;
		this.special_taxpayer=false;
		this.getQuestions(12,null);
	}
	app.RegisterEandPComponent.prototype.changeTypeInputShow=function(data){
		if(!(data==null || data==undefined || data=="")){
			try{
				document.getElementById(data).type="text";
			}catch(er){
				console.log("er");
			}
		}
	}
	app.RegisterEandPComponent.prototype.changeTypeInputHide=function(data){
		if(!(data==null || data==undefined || data=="")){
			try{
				document.getElementById(data).type="password";
			}catch(er){
				console.log("er");
			}
		}
	}
	app.RegisterEandPComponent.prototype.ValidarPassword=function(event){
		const password = document.getElementById("pass");
		if(checkPwd(password.value) != null){
			password.classList.add('is-invalid');
			this.message_password = checkPwd(password.value)
		}else{
			password.classList.remove('is-invalid');
		}
	}
	app.RegisterEandPComponent.prototype.ValidarPassword2=function(event){
		const password = document.getElementById("confirm_password");
		if(checkPwd(password.value) != null){
			password.classList.add('is-invalid');
			this.message_password = checkPwd(password.value)
		}else{
			password.classList.remove('is-invalid');
		}
	}
	app.RegisterEandPComponent.prototype.getQuestions=function(q,indice){
		var mensajeAll="Error al obtener preguntas de seguridad";
		var request=this.ser.callServicesHttp('get-questions',"&amount="+q,null);
		request.subscribe(data=>{
			if(data==null || data==undefined  || data==""){
				this.mensaje=mensajeAll;
				this.msg.error();
			}else{
				if(data.status_http==200){
					delete data['status_http'];
					if(data.hasOwnProperty("body")){
						if(!(data.body==null || data.body==undefined || data.body.length==0)){
							this.questionList=[];
							this.questionList=data.body;
							try{
								this.preguntas1=this.questionList.slice(0,6);
								this.preguntas2=this.questionList.slice(6,12);
							}catch(er1){

							}
						}
					}
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
	app.RegisterEandPComponent.prototype.validarEmail= function(event,data){
		return keypressvalidarEmail(event,data);
	}
	app.RegisterEandPComponent.prototype.send=function(){
		var parametros = {};
		if(this.email==null || this.email==undefined || this.email==""){
			this.mensaje="Debe ingresar el correo electrónico";
			this.msg.warning();
			return;
		}else{
			if(!validarEmail(this.email.trim())){
				this.mensaje = "El correo electrónico ingresado es inválido";
				this.msg.warning();
				return;
			}else{
				parametros.email=this.email.trim().toLowerCase();
			}
		}
		if(this.password==null || this.password==undefined || this.password==""){
			this.mensaje="Debe ingresar la contraseña";
			this.msg.warning();
			return;
		}else{
			if(checkPwd(this.password)==null){
				var $key = RSA.getPublicKey(publicKey());
				parametros.password=RSA.encrypt(this.password.trim(),$key);
			}else{
				this.mensaje=checkPwd(this.password);
				this.msg.warning();
				return;
			}
		}
		if(this.confirm_password==null || this.confirm_password==undefined || this.confirm_password==""){
			this.mensaje="Debe repetir la contraseña";
			this.msg.warning();
			return;
		}
		if (this.password.trim() != this.confirm_password.trim()) {
			this.mensaje = "La confirmación de la contraseña no concuerda";
			this.msg.warning();
			return;
		}
		var questions=[];
		var objeto={};
		if(this.question1==null || this.question1==undefined || this.question1==""){
			this.mensaje="Debe ingresar la primera pregunta de seguridad";
			this.msg.warning();
			return;
		}else{
			objeto.question=this.question1;
		}
		if(this.response1==null || this.response1==undefined || this.response1==""){
			this.mensaje="Debe ingresar la primera respuesta de seguridad";
			this.msg.warning();
			return;
		}else{
			objeto.answer=this.response1.trim().toLowerCase();
		}
		questions.push(objeto);
		objeto={};
		if(this.question2==null || this.question2==undefined || this.question2==""){
			this.mensaje="Debe ingresar la segunda pregunta de seguridad";
			this.msg.warning();
			return;
		}else{
			objeto.question=this.question2;
		}
		if(this.response2==null || this.response2==undefined || this.response2==""){
			this.mensaje="Debe ingresar la segunda respuesta de seguridad";
			this.msg.warning();
			return;
		}else{
			objeto.answer=this.response2.trim().toLowerCase();
		}
		if(this.question1==this.question2){
			this.mensaje="Debe seleccionar diferentes preguntas";
			this.msg.warning();
			return;
		}
		questions.push(objeto);
		if(questions==null || questions.length==0){
			this.mensaje="Debe ingresar las preguntas de seguridad";
			this.msg.warning();
			return;
		}else{
			parametros.security_questions=questions;
		}
		if(Boolean(getScopes())){
			parametros.scope=JSON.stringify(getScopes());
		}
		parametros.special_tax_payer = this.special_taxpayer;
		parametros.country="VE";
		var mensajeAll="Error al crearle contraseña y preguntas de seguridad al usuario";
		var request=this.ser.callServicesHttp('register-ufc',null,parametros);
		request.subscribe(data=>{
			if(data==null || data==undefined  || data==""){
				this.mensaje=mensajeAll;
				this.msg.error();
			}else{
				if(data.status_http==200){
					delete data['status_http'];
					this.mensaje = "Usuario creado con exito";
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
	app.RegisterEandPComponent.prototype.clean=function(){
		this.question1=null;
		this.question2=null;
		this.response1=null;
		this.response2=null;
		this.password=null;
		this.email=null;
		this.confirm_password=null;
		this.special_taxpayer=false;
	}
	app.RegisterEandPComponent.prototype.keyPressCtrlZ=function(event){
		return disabledCtlZ(event);
	}
	app.RegisterEandPComponent.prototype.validarEmail= function(event,data){
		return keypressvalidarEmail(event,data);
	}
	app.RegisterEandPComponent.prototype.back=function(){
		var link = ['/login'];
        this.router.navigate(link);
	}
})(window.app || (window.app = {}));