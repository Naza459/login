(function(app) {
	app.RegisterComponent =
		ng.core.Component({
		selector: 'register',
		templateUrl: 'views/register-v3.html'
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
	app.RegisterComponent.prototype.keypressNumeros=function(event){
		return keypressNumbersInteger(event);
	}
	app.RegisterComponent.prototype.completeDoc=function(data){
		if(!(data==null || data==undefined || data=="")){
			if(!utils_keyNumber(data.trim())){
				this.mensaje="El formato del número de identificación es inválido";
				this.msg.warning();
				return;
			}
			if(data.trim().length<9){
				var numero=9-data.trim().length;
				var texto="";
				for(var i=0;i<numero;i++){
					texto=texto+"0";
				}
				this.doc=texto+this.doc;
			}else{
				this.doc=data;
			}
		}
	}
	app.RegisterComponent.prototype.ngOnInit=function(){
		this.tipoPersona=null;
		this.listDocs=["V","E","G","J"];
		this.doc=null;
		this.response1=null;
		this.question1="EN QUE CIUDAD NACISTE";
		this.getQuestions(2,null);
		this.tipoPersona="NATURAL";
		this.name=null;
		this.lastName=null;
		this.business_name=null;
		this.question2="CUAL ES EL NOMBRE DE SU ABUELA MATERNA";
		this.response2=null;
		this.country="VE"
		this.listCountry = [ {
			value : 'VE',
			name : 'VENEZUELA'
		} ];
		$(document).ready(function() {
			$('.phone').mask('(000) 000-0000', {
				placeholder : "(000) 000-0000"
			});
		});
	}
	app.RegisterComponent.prototype.changeTypeInputShow=function(data){
		if(!(data==null || data==undefined || data=="")){
			try{
				document.getElementById(data).type="text";
			}catch(er){
				console.log("er");
			}
		}
	}
	app.RegisterComponent.prototype.changeTypeInputHide=function(data){
		if(!(data==null || data==undefined || data=="")){
			try{
				document.getElementById(data).type="password";
			}catch(er){
				console.log("er");
			}
		}
	}
	app.RegisterComponent.prototype.getQuestions=function(q,indice){
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
							if(data.body.length==2){
								try{
									this.question1=data.body[0].question;
									this.question2=data.body[1].question;
								}catch(err){
								}
							}else{
								if(data.body.length==1){
									try{
										if(indice==1){
											this.question1=data.body[0].question;
										}else{
											this.question2=data.body[0].question;
										}
									}catch(err){
									}
								}
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
	app.RegisterComponent.prototype.send=function(){
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
		if(this.doc==null || this.doc==undefined || this.doc==""){
			this.mensaje="El número de documento no puede estar vacío";
			this.msg.warning();
			return;
		}else{
			if(utils_keyNumber(this.doc.trim())){
				var texto1="";
				if(this.type_id_doc==null || this.type_id_doc==undefined || this.type_id_doc==""){
					this.mensaje="El tipo de documento no puede estar vacío";
					this.msg.warning();
					return;
				}else{
					var texto=this.type_id_doc.trim();
					this.completeDoc(this.doc);
					parametros.id_doc=texto+this.doc;
				}
			}else{
				this.mensaje="El número de documento, sólo acepta números";
				this.msg.warning()
				return;
			}
		}
		if(this.tipoPersona=="NATURAL"){
			parametros.type="NATURAL_PERSON";
			parametros.id_doc_type="CI";
			if(this.name==null || this.name==undefined || this.name==""){
				this.mensaje="El campo nombre de la persona no puede estar vacío";
				this.msg.warning();
				return;
			}else{
				if(validarOnlyLetrasBoolean(this.name.trim())){
					parametros.first_name=this.name.trim().toUpperCase();
				}else{
					this.mensaje="El formato del nombre de la persona es incorrecto";
					this.msg.warning();
					return;
				}
			}
			if(this.lastName==null || this.lastName==undefined || this.lastName==""){
				this.mensaje="El campo apellido no puede estar vacío";
				this.msg.warning();
				return;
			}else{
				if(validarOnlyLetrasBoolean(this.lastName.trim())){
					parametros.last_name=this.lastName.trim().toUpperCase();
				}else{
					this.mensaje="El formato del apellido es incorrecto";
					this.msg.warning();
					return;
				}
			}
		}else{
			parametros.type="LEGAL_PERSON";
			parametros.id_doc_type="RIF";
			if(this.business_name==null || this.business_name==undefined || this.business_name==""){
				this.mensaje="La razón social no puede estar vacía";
				this.msg.warning();
				return;
			}else{
				parametros.business_name=this.business_name.trim().toUpperCase();
			}
		}
		if(!(this.phone==null || this.phone==undefined || this.phone=="")){
			var telefono = null;
			try {
				telefono = $("#phone").unmask();
				if (telefono != null) {
					telefono = telefono[0].value;
				}
			} catch (err) {
				telefono = this.phone;
			}
			if(telefono<10){
				this.mensaje="El número de teléfono esta incompleto";
				this.msg.warning();
				return;
			}
			parametros.phone= telefono;
		}
		if(this.country==null || this.country==undefined || this.country==""){
			this.mensaje="Debe ingresar el país";
			this.msg.warning();
			return;
		}else{
			parametros.country=this.country;
		}
		var mensajeAll="Error al crear usuario";
		var request=this.ser.callServicesHttp('register',null,parametros);
		request.subscribe(data=>{
			if(data==null || data==undefined  || data==""){
				this.mensaje=mensajeAll;
				this.msg.error();
			}else{
				if(data.status_http==200){
					delete data['status_http'];
					this.mensaje = "Usuario creado con exito. Fue enviado un correo electrónico, tiene 48 horas para realizar la activación, de lo contrario tendra que realizar de nuevo el registro";
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
	app.RegisterComponent.prototype.clean=function(){
		this.country=null;
		this.email=null;
		this.tipoPersona="NATURAL";
		this.password=null;
		this.confirm_password=null;
		this.type_id_doc=null;
		this.doc=null;
		this.response1=null;
		this.name=null;
		this.lastName=null;
		this.business_name=null;
		this.response2=null;
		this.phone=null;
	}
	app.RegisterComponent.prototype.keyPressCtrlZ=function(event){
		return disabledCtlZ(event);
	}
	app.RegisterComponent.prototype.validarEmail= function(event,data){
		return keypressvalidarEmail(event,data);
	}
	app.RegisterComponent.prototype.back=function(){
		window.history.back();
	}
})(window.app || (window.app = {}));