(function(app) {
    app.AppCallService = ng.core.
    Injectable().Class({
        constructor: [ng.http.Http, app.LoadingServiceComponent, ng.router.Router, function(http, loading,router) {
            this._url =getApi();
            this.http = http;
            this.loading = loading;
			this.timeout="18000";
			this.enlace_auth=getEnlaceAuth();
			this.enlace_deegle=getEnlaceDeegle();
			this.enlace_auth_v2=getEnlaceDeegleAuthV2();
			this.router=router;
        }]
	});
	app.AppCallService.prototype.callServices=function(path, method, parameters, head, auth, format_out,format_in,show,time){
		let url=this._url;
		let headers=new Headers();
		if(!(head==null || head==undefined || head=="")){
			headers=head;
		}
		var parametros="";
		if (path == undefined || path == '' || path == null) {
            url = '';
        } else {
            url = url+path;
        }
		if(!(format_in==null || format_in==undefined || format_in=="")){
			headers['Content-Type']=format_in.trim().toLowerCase();
		}
		if(auth){
			headers['Authorization']='bearer '+this.getAccessToken();
		}
		if(format_in==null && !auth && head==null){
			headers=null;
		}
		if(format_in=="multipart/form-data"){
			delete headers['Content-Type'];
			parametros=parameters;
		}else{
			if (!(parameters == undefined || parameters == null || parameters == '')) {
				if (jQuery.isEmptyObject(parameters)) {
					parametros = parameters;
				}else {
					if(format_in=="application/json"){
						parametros = JSON.stringify(parameters);
					}else{
						parametros = parameters;
					}
				}
			}
		}
		if(show){
			this.loading.showPleaseWait();
		}
		let peticion=null;
        switch (method) {
            case 'GET':{
                if(headers!=null){
					peticion = this.http.get(url,{headers});
				}else{
					peticion = this.http.get(url);
				}
            }break;
            case 'POST':{
				if(headers==null){
					 peticion = this.http.post(url, parametros,null);
				}else{
					 peticion = this.http.post(url, parametros,{headers});
				}
            }break;
            case 'PUT':{
                peticion = this.http.put(url, parametros,{headers});
            }break;
            case 'DELETE':{
				if(headers!=null){
					peticion = this.http.delete(url,{headers});
				}else{
					peticion = this.http.delete(url);
				}
            }break;
            default:{
                return null;
            }
        }
		if(time==null){
			time=this.timeout;
		}
		let resultado = peticion.timeout(time, new Error('TIMEOUT'))
		.map(res => {
            this.loading.hidePleaseWait();
			return this.processResponse(format_out,res);
        });
		return resultado;
	}
	app.AppCallService.prototype.setAccessToken=function(data){
		this.removeKey("access_token");
		this.removeKey("refresh_token");
		this.removeKey("init");
		this.removeKey("role");
		localStorage.setItem('access_token',data);
		localStorage.setItem('realm', getRealm());	
	}

	app.AppCallService.prototype.getAccessToken=function(){
		return localStorage.getItem('access_token');
	}
	app.AppCallService.prototype.setRefreshToken=function(data){
		localStorage.setItem('refresh_token',data);
	}
	app.AppCallService.prototype.getRefreshToken=function(){
		let aux=localStorage.getItem('refresh_token');
		if(aux==null){
			return null;
		}else{
			return aux;
		}
	}
	app.AppCallService.prototype.setRealm=function(data){
		localStorage.setItem('realm', getRealm());	
	}
	app.AppCallService.prototype.removeKey=function(key){
		try{
			localStorage.removeItem(key);
			sessionStorage.removeItem(key);
		}catch(Er){
		}
	}
	app.AppCallService.prototype.setTimeSession=function(data){
		localStorage.setItem('session',data);
	}
	app.AppCallService.prototype.getTimeSession=function(){
		return localStorage.getItem('session');
	}
	app.AppCallService.prototype.getFingerPrint=function(){
		return getCookie("_secPrint");
	}
	app.AppCallService.prototype.setFingerPrint=function(data){
		setCookie("_secPrint",data,3000);
	}
	app.AppCallService.prototype.setDeviceActual=function(data){
		localStorage.setItem('device-actual', data);
	}
	app.AppCallService.prototype.getDeviceActual=function(){
		let aux=localStorage.getItem('device-actual');
		if(aux==null){
			return null
		}else{
			try{
				aux=JSON.parse(aux);
			}catch(er4){
				aux=null;
			}
			return aux;
		}
	}
	app.AppCallService.prototype.processResponse=function(format,res){
		this.loading.hidePleaseWait();
		var status=null;
		if(res.hasOwnProperty('status')){
           status=res.status;
			if(status==202 || status=="202" || status=="403" || status==403){
				var aux = res.json();
				if(aux.hasOwnProperty("message")){
					if(!(aux.message==undefined || aux.message==null || aux.message=="")){
						if(aux.message=="UNAUTHORIZED_SESSION" || aux.message=="SESSION_CLOSED" 
						|| aux.message=="SESSION_EXPIRED" || aux.message=="SESSION_NOT_FOUND" || aux.message=="INVALID_AUTHORIZATION" ){
							doLogout();
							this.router.navigate(["/login"]);
						}
					}
				}	
			}else{
				if(status==401 || status==403){
					this.router.navigate(["/login"]);
				}
			}
        }
		if (format == "JSON") {
            try {
				var status=null;
				if(res.hasOwnProperty('status')){
                    status=res.status;
                }
                res = res.json();
				try{
                    var valor=Array.isArray(res);
					if(valor){
                        var aux=res;
                        res={
                            body:aux,
                            status_http:status
                        };
                    }else{
                        res.status_http=status; 
                    }
                }catch(err1){
                    // console.log('Error al procesar',err1);
                }
                res.status_http=status;
				return res;
			} catch (err) {
                res = {
					status_http:500,
					message:"ERROR",
                    typeSys: 'ERROR',
                    value: 'NOT_JSON'
                };
                return res;
            }
        }else {
			if(format=="CSV"){
				 try {
					res = res._body;
					return res.toString();
				} catch (err) {
					res = "Error";
					return res;
				}
			}else{
				// console.log('res',res);
				res=res._body.blob();
				return res
			}
           
        }
	}
	app.AppCallService.prototype.callServicesHttp=function(ser,querys,param){
		let request=null;
		var headers=new Headers();
		headers['X-Paguetodo-ID']=getPaguetodoId();
		headers['app-id']=getClient();
		switch(ser){
			case 'login':{
				request=this.callServices(this.enlace_auth_v2+'/password_grant'+querys,"POST",param,headers,true,"JSON",null,true,null);
				return request;
			}break;
			case 'logout':{
				request=this.callServices(this.enlace_auth_v2+'/close_session',"PUT",null,headers,true,"JSON",null,true,null);
				return request;
			}break;
			case 'get-questions':{
				request=this.callServices(this.enlace_auth_v2+'/register_security_questions?client_id='+getClient()+querys,"GET",null,headers,false,"JSON",null,true,null);
				return request;
			}break;
			case 'register':{
				request=this.callServices(this.enlace_auth_v2+'/self_sign_up',"POST",param,headers,false,"JSON","application/json",true,null,true,null);
				return request;
			}break;
			case 'register-ufc':{
				request=this.callServices(this.enlace_auth_v2+'/register_user_from_client?country=VE',"POST",param,headers,false,"JSON","application/json",true,null,true,null);
				return request;
			}break;
			case 'resend-activation':{
				request=this.callServices(this.enlace_auth_v2+'/self_sign_up'+querys,"GET",null,headers,false,"JSON",null,true,null);
				return request;
			}break;
			case 'search-question':{
				request=this.callServices(this.enlace_auth_v2+'/recovery_questions?client_id='+getClient()+querys,"GET",null,headers,false,"JSON",null,true,null);
				return request;
			}break;
			case 'reset':{
				request=this.callServices(this.enlace_auth_v2+'/recovery'+querys,"POST",param,headers,false,"JSON","application/json",true,null);
				return request;
			}break;
			case 'active':{
				request=this.callServices(this.enlace_auth_v2+'/self_sign_up',"PUT",param,headers,false,"JSON","text/plain",true,null);
				return request;
			}break;
			case 'recovery':{
				request=this.callServices(this.enlace_auth_v2+'/recovery'+querys,"PUT",param,headers,false,"JSON",null,true,null);
				return request;
			}break;
			case "expired-password":{
				request=this.callServices(this.enlace_auth_v2+'/password_expired'+querys,"PUT",param,headers,false,"JSON","application/json",true,null);
				return request;
			}break;
			case 'login-device':{
				request=this.callServices(this.enlace_auth_v2+'/device',"POST",param,headers,true,"JSON","application/json",true,null);
				return request;
			}break;
			case 'autorize-device':{
				request=this.callServices(this.enlace_auth_v2+"/device","PUT",param,headers,true,"JSON","application/json",true,null);
				return request;
			}break;
			case 'resend-code':{
				request=this.callServices(this.enlace_auth_v2+"/resend_code"+querys,"GET",null,headers,true,"JSON",null,true,null);
				return request;
			}break;
			case 'roles-auth':{
				request=this.callServices(this.enlace_auth_v2+'/roles',"GET",null,headers,true,"JSON",null,true,null);
				return request;
			}break;
			case 'register-with-email':{
				request=this.callServices(this.enlace_auth_v2+'/password_questions?realm='+this.getRealm(),"PUT",param,headers,true,"JSON","application/json",true,null);
				return request;
			}break;
		}
    }
	app.AppCallService.prototype.setRole=function(data){
		data=JSON.stringify(data);
		localStorage.setItem('role', data);
	}
	app.AppCallService.prototype.getRole=function(data){
		var aux=localStorage.getItem("role");
		if(aux==null){
			return null;
		}else{
			try{
				aux=JSON.parse("role");
				return aux;
			}catch(er){
				return null;
			}
		}
	}
	app.AppCallService.prototype.setDataUser=function(data){
		data=JSON.stringify(data);
		localStorage.setItem('user_data',data);
	}
	app.AppCallService.prototype.getDataUser=function(){
		var aux=localStorage.getItem("user_data");
		if(aux==null){
			return null;
		}else{
			try{
				return JSON.parse(aux);
			}catch(er){
				return null;
			}
		}
	}
	app.AppCallService.prototype.setInit=function(data){
		data=JSON.stringify(data);
		localStorage.setItem("init",data);
	}
	app.AppCallService.prototype.getCountry=function(){
		var aux=localStorage.getItem('init');
		if(aux!=null){
			try{
				aux=JSON.parse(aux);
				aux=aux.country.alpha2;
			}catch(er){
				// console.log("er",er);
				aux=null;
			}
			return aux;
		}else{
			return aux;
		}
	}
	app.AppCallService.prototype.setSessionViaje=function(data){
		sessionStorage.setItem('reserva',JSON.stringify(data));
	}
	app.AppCallService.prototype.getSessionViaje=function(){
		var aux=sessionStorage.getItem('reserva');
		try{
			return JSON.parse(aux);
		}catch(er){
			return aux;
		}
		
	}
	app.AppCallService.prototype.setSessionPersonas=function(data){
		var aux=null;
		try{
			aux=this.getSessionViaje();	
		}catch(er){
		}
		if(aux!=null){
			aux.items=data;
		}
		sessionStorage.setItem('reserva',JSON.stringify(aux));
	}
	app.AppCallService.prototype.getRealm=function(){
		return "cuyawa";
	}
	app.AppCallService.prototype.processError=function(err,msg){
		let mensaje=msg;
		this.loading.hidePleaseWait();
		try {
			var status = "";
			if (err.hasOwnProperty('status')) {
				var contexto=this;
				status = err.status + ', ';
				if(err.status==401){
					mensaje="Sesión cerrada";
					setTimeout(function() {
						doLogout();
						contexto.router.navigate(["/login"]);
					}, 2000);
				}else{
					if(err.status==403){
						mensaje="Sesiónn expirada";
						setTimeout(function() {
							doLogout();
							contexto.router.navigate(["/login"]);
					}, 2000);
					}else{
						if (err.hasOwnProperty('_body')) {
							var aux = JSON.parse(err._body);
							if (aux.hasOwnProperty('message')) {
								if(aux.message==null || aux.message==undefined || aux.message==""){
									mensaje=msg;
								}else{
									if(aux.message.toUpperCase()=="FAILED_REQUEST"){
										mensaje=msg;
									}else{
										mensaje= status + translate(aux.message, 'ES').toUpperCase();
									}
								}
							} else {
								if (err.hasOwnProperty('statusText')) {
									mensaje = status + err.statusText;
								} else {
									mensaje = msg;
								}
							}
						} else {
							mensaje = msg;
						}
					}
				}
			}else{
				mensaje=msg;
			}
		} catch (err1) {
			mensaje = msg;
		}
		return mensaje;
	}
	app.AppCallService.prototype.processMessageError=function(data,mensaje){
		if (data.hasOwnProperty('message')) {
			var auxMsg = "";
			var titleMsg = "";
			if (data.message == null || data.message == undefined || data.message == "") {
				titleMsg =mensaje;
			} else {
				data.message=data.message.toLowerCase();
				titleMsg = _(data.message);
			}
			if (data.hasOwnProperty('cause')) {
				if (!(data.cause == null || data.cause == undefined || data.cause == "" || data.cause.length == 0)) {
					for (var i = 0; i < data.cause.length; i++) {
						if(data.cause[i]!=null){
							data.cause[i]=data.cause[i].toLowerCase();
							auxMsg = auxMsg+ " "+ _(data.cause[i]);
						}
					}
					if (auxMsg != "") {
						titleMsg = titleMsg+ ": " + auxMsg;
					}
				}
			}
			mensaje = titleMsg;
			return mensaje;
		} else {
			return mensaje;
		}
	}
})(window.app || (window.app = {}));