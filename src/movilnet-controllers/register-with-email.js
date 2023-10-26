(function(app) {
	app.RegisterWithEmailComponent =
		ng.core.Component({
		selector: 'register-with-email',
		templateUrl: 'views/register-with-email-v1.html'
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
	app.RegisterWithEmailComponent.prototype.ngOnInit=function(){
		this.response1=null;
		this.question1=null;
		this.question2=null;
		this.response2=null;
		this.preguntas1=[];
		this.preguntas2=[];
		this.q=null;
		if(this.active.hasOwnProperty('queryParams')){
			if(this.active.queryParams!=null){
				if(this.active.queryParams.hasOwnProperty('_value')){
					if(this.active.queryParams._value!=null){
						if(this.active.queryParams._value.hasOwnProperty('email')){
							this.email=this.active.queryParams._value.email;
						}
						if(this.active.queryParams._value.hasOwnProperty('q')){
							this.q=this.active.queryParams._value.q;
						}
					}
				}
			}
		}
		this.getQuestions(12,null);
	}
	app.RegisterWithEmailComponent.prototype.changeTypeInputShow=function(data){
		if(!(data==null || data==undefined || data=="")){
			try{
				document.getElementById(data).type="text";
			}catch(er){
				console.log("er");
			}
		}
	}
	app.RegisterWithEmailComponent.prototype.changeTypeInputHide=function(data){
		if(!(data==null || data==undefined || data=="")){
			try{
				document.getElementById(data).type="password";
			}catch(er){
				console.log("er");
			}
		}
	}
	app.RegisterWithEmailComponent.prototype.ValidarPassword=function(event){
		const password = document.getElementById("password");
		if(checkPwd(password.value) != null){
			password.classList.add('is-invalid');
			this.message_password = checkPwd(password.value)
		}else{
			password.classList.remove('is-invalid');
		}
	}
	app.RegisterWithEmailComponent.prototype.ValidarPassword2=function(event){
		const password = document.getElementById("confirm_password");
		if(checkPwd(password.value) != null){
			password.classList.add('is-invalid');
			this.message_password = checkPwd(password.value)
		}else{
			password.classList.remove('is-invalid');
		}
	}
	app.RegisterWithEmailComponent.prototype.getQuestions=function(q,indice){
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
	app.RegisterWithEmailComponent.prototype.send=function(){
		var parametros = {};
		parametros.q=this.q;
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
		parametros.questions={};
		if(this.question1==null || this.question1==undefined || this.question1==""){
			this.mensaje="Debe ingresar la primera pregunta de seguridad";
			this.msg.warning();
			return;
		}
		if(this.response1==null || this.response1==undefined || this.response1==""){
			this.mensaje="Debe ingresar la primera respuesta de seguridad";
			this.msg.warning();
			return;
		}
		if(this.question2==null || this.question2==undefined || this.question2==""){
			this.mensaje="Debe ingresar la segunda pregunta de seguridad";
			this.msg.warning();
			return;
		}
		if(this.response2==null || this.response2==undefined || this.response2==""){
			this.mensaje="Debe ingresar la segunda respuesta de seguridad";
			this.msg.warning();
			return;
		}
		if(this.question1==this.question2){
			this.mensaje="Debe seleccionar diferentes preguntas";
			this.msg.warning();
			return;
		}
		
		parametros.questions[this.question1]=this.response1.trim().toLowerCase();
		parametros.questions[this.question2]=this.response2.trim().toLowerCase();
		var mensajeAll="Error al crearle contraseña y preguntas de seguridad al usuario";
		var request=this.ser.callServicesHttp('register-with-email',null,parametros);
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
	app.RegisterWithEmailComponent.prototype.clean=function(){
		this.question1=null;
		this.question2=null;
		this.response1=null;
		this.response2=null;
		this.password=null;
		this.confirm_password=null;
	}
	app.RegisterWithEmailComponent.prototype.keyPressCtrlZ=function(event){
		return disabledCtlZ(event);
	}
	app.RegisterWithEmailComponent.prototype.validarEmail= function(event,data){
		return keypressvalidarEmail(event,data);
	}
	app.RegisterWithEmailComponent.prototype.back=function(){
		var link = ['/login'];
        this.router.navigate(link);
	}
})(window.app || (window.app = {}));
