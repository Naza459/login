function formattingIntegerPart(integerPart) {
  var auxCaracter = "";
  var isNegative = false;
  auxCaracter = integerPart.charAt(0);
  var enteroAux = integerPart;
  if (auxCaracter == '-') {
    integerPart = integerPart.substring(1, integerPart.length);
    isNegative = true;
    isNegative = true;
  }
  var cadena = '';
  var posicion = 0;
  if (integerPart.length > 3) {
    for (var i = 0; i < integerPart.length; i++) {
      if (i == 0) {
        posicion = integerPart.length;
      }
      if (posicion <= 3) {
        cadena = integerPart.substring(0, posicion) + cadena;
        if (isNegative) {
          cadena = '-' + cadena;
        }
        return cadena;
      } else {
        cadena = '.' + integerPart.substring(posicion - 3, posicion) + cadena;
        posicion = posicion - 3;
      }
    }
  } else {
    cadena = integerPart;
  }
  if (isNegative) {
    cadena = '-' + cadena;
  }
  return cadena;
}
function checkPwd(str) {
	var t=/[ !#$%&()*+,\-./:;?@[\\\]^_{}]/;
	var excepto=/[ = | ; “ ” ´" '< >~*]/;
	var mayu=/[ABCDEFGHIJKLMNOPQRSTUVWXYZ]/;
    if(str==null || str==undefined || str==""){
		return "Contraseña vacía";
	}else{
		str=str.trim();
		if (str.length < 8) {
           return "Contraseña debe tener minimo 8 digitos";
       } else if (str.length > 20) {
           return "Contraseña no debe ser mayor a 20 digitos";
       } else if (str.search(/\d/) == -1) {
            return "Contraseña debe tener al menos un número";
       }else if (!mayu.test(str)){
		    return "La contraseña debe contener al menos una mayúscula";
	   } else if (str.search(/[a-zA-Z]/) == -1) {
           return "Contraseña debe tener al menos un letra";
       } else if (str.search(/[a-z]/) == -1) {
           return "Contraseña debe tener al menos una letra minúscula";
       }
	   else if (!t.test(str)) {
           return "Contraseña debe tener al menos un caracter especial de los siguientes !#$%&()+/\-.//:?@_{}";
       }else if (excepto.test(str)){
		    return "La contraseña no permite los siguientes caracteres especiales = | ; “ ” ´\" '< >~ *";
	   }
       return null;
	}   
}
function returnBancos(){
	var lista=[
		{value:"BDV", name:"Banco de Venezuela"},
		{value:"SOFITASA", name:"Banco sofitasa"},
		{value:"BNC", name:"Banco nacional de crédito"},
		{value:"BANESCO", name:"Banesco banco universal"},
		{value:"CARONI", name:"Banco caroní"},
		{value:"BANCO_PLAZA", name:"Banco plaza"},
		{value:"BANGENTE", name:"Banco de la gente emprendedora"},
		{value:"BANCO100", name:"100% banco"},
		{value:"DELSUR", name:"Delsur banco universal"},
		{value:"BAV", name:"Banco agrícola de venezuela"},
		{value:"BANCRECER", name:"Bancrecer"},
		{value:"ACTIVO", name:"Banco activo"},
		{value:"BANCAMIGA", name:"Bancamiga"},
		{value:"BANPLUS", name:"Banplus"},
		{value:"BVC", name:"Venezolano de crédito"},
		{value:"MERCANTIL", name:"Banco mercantil"},
		{value:"BBVA", name:"Banco provincial"},
		{value:"EXTERIOR", name:"Banco exterior c.a."},
		{value:"BICENTENARIO", name:"Banco bicentenario"},
		{value:"BANFANB", name:" Banco de la fuerza armada nacional bolivariana"},
		{value:"MIBANCO", name:"Mi banco"},
		{value:"BOD", name:"Banco occidental de descuento"},
		{value:"TESORO", name:"Banco del tesoro"},
		{value:"BANCARIBE", name:"Bancaribe c.a"},
	];
	return lista;
}
function returnBankSelected(data){
	if(data==null || data==undefined || data==""){
		return null;
	}else{
		var aux=null;
		var lista=returnBancos();
		if(lista!=null && lista.length!=0){
			for(var i=0;i<lista.length;i++){
				if(lista[i]!=null){
					if(lista[i].hasOwnProperty("value")){
						if(lista[i].value==data){
							aux=lista[i].name;
							break;
						}
					}
				}
			}
			if(aux==null){
				return data;
			}else{
				return aux;
			}
		}
	}
}
function amountFormattingObject(amount) {
  var retorno = {
    integerPart: '',
    decimalPart: ''
  };
  var monto = amount / 100;
  var parteDecimal = '';
  var parteEntera = '';
  if (monto.toString().indexOf('.') > 0) {
    var array = monto.toString().split('.');
    parteEntera = array[0];
    if (array[1].length < 2) {
      parteDecimal = array[1] + '0';
    } else {
      parteDecimal = array[1];
    }
  } else {
    parteEntera = monto.toString();
    parteDecimal = '00';
  }
  retorno.integerPart = formattingIntegerPart(parteEntera);
  retorno.decimalPart = parteDecimal;
  return retorno;
}
function validarEmail(valor) {
  if (valor.indexOf('&') >= 0) {
    return false;
  }
  if (valor.indexOf('/') >= 0) {
    return false;
  }
  if (/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/.test(valor)) {
    return true;
  } else {
    return false;
  }
}
function utils_keyNumber(data) {
	var patron = /^[0-9]*$/;
	if (patron.test(data))
	    return true;
	  else
	    return false;
}
function keypressNumbersInteger(event) {
  var key = event.keyCode || event.which;
  var tecla = String.fromCharCode(key).toLowerCase();
  var letras = "0123456789";
  var especiales = [8];
  var tecla_especial = false
  for (var i in especiales) {
    if (key == especiales[i]) {
      tecla_especial = true;
      break;
    }
  }
  if (letras.indexOf(tecla) == -1 && !tecla_especial)
    return false;
}
function formattingDate(date) {
  date = replaceAll(date, "T", " ");
  var newDate = new Date(date);
  var hora = "00";
  var minutos = "00";
  if (newDate.getHours() < 10) {
    hora = "0" + newDate.getHours();
  } else {
    hora = newDate.getHours();
  }
  if (newDate.getMinutes() < 10) {
    minutos = "0" + newDate.getMinutes();
  } else {
    minutos = newDate.getMinutes();
  }
  var dia = newDate.getDate();
  if (dia < 10) {
    dia = "0" + newDate.getDate();
  }
  var mes=newDate.getMonth() + 1;
  if (mes < 10) {
    mes = "0" + mes;
  }
  var dateFormatting = dia + '-' + mes + '-' + newDate.getFullYear() + ' ' + hora + ':' + minutos;
  return dateFormatting;
}
function replaceAll(text, busca, reemplaza) {
  if (text == null || text == undefined) {
    return text;
  } else {
    while (text.toString().indexOf(busca) != -1)
      text = text.toString().replace(busca, reemplaza);
    return text;
  }
}
function capitalizeOnly(data) {
  if (data == null || data == undefined) {
    return "";
  } else {
    var aux = data.charAt(0).toUpperCase() + data.slice(1).toLowerCase();
    return aux;
  }
};
function orderList(lista){
	if(lista==null || lista==undefined || lista.length==0){
		return null;
	}else{
		var n=lista.length;
		var n, i, k, aux;
		for (k = 1; k < n; k++) {
			for (i = 0; i < (n - k); i++) {
				if (lista[i].sort > lista[i + 1].sort) {
					aux = lista[i];
					lista[i] = lista[i + 1];
					lista[i + 1] = aux;
				}
			}
		}
		return lista;
	}						
}
function getTimeZone(){
	return Intl.DateTimeFormat().resolvedOptions().timeZone;
}
function keyPressValidarLetrasNumerosSimplesGuionesPisos(event) {
  var key = event.keyCode || event.which;
  var tecla = String.fromCharCode(key).toLowerCase();
  var letras = "abcdefghijklmnopqrstuvwxyz0123456789";
  var especiales = [8, 45, 95];
  var tecla_especial = false
  for (var i in especiales) {
    if (key == especiales[i]) {
      tecla_especial = true;
      break;
    }
  }
  if (letras.indexOf(tecla) == -1 && !tecla_especial)
    return false;
}
function validarLetrasNumerosSimplesGuionesPiso(data) {
  var patron = /^([a-zA-Z-Z]|[0-9]|-|_)*$/;
  if (patron.test(data))
    return true;
  else
    return false;
}
function keypressvalidarEmail(event, data) {
  var key = event.keyCode || event.which;
  var tecla = String.fromCharCode(key).toLowerCase();
  var letras = "abcdefghijklmnopqrstuvwxyz0123456789";
  var especiales = [8, 38, 45, 46, 64, 95];
  var tecla_especial = false
  for (var i in especiales) {
    if (key == especiales[i]) {
      if (key == 64) {
        if (data.indexOf(tecla) > -1) {
          tecla_especial = false;
          break;
        }
      }
      if (key == 46) {
        if (data != null) {
          if (data.charAt(data.length - 1) == tecla) {
            tecla_especial = false;
            break;
          }
        }
      }
      tecla_especial = true;
      break;
    }
  }
  if (letras.indexOf(tecla) == -1 && !tecla_especial)
    return false;
}
function keyPressValidarLetrasyOtrosCaracteres(event) {
  var key = event.keyCode || event.which;
  var tecla = String.fromCharCode(key).toLowerCase();
  var letras = "abcdefghijklmnopqrstuvwxyz0123456789\u00D1\u00F1\u00C1\u00E1\u00C9\u00E9\u00CD\u00ED\u00D3\u00F3\u00DA\u00FA";
  var especiales = [8, 32, 35, 36, 37, 38, 64, 45, 46, 95];
  var tecla_especial = false
  for (var i in especiales) {
    if (key == especiales[i]) {
      tecla_especial = true;
      break;
    }
  }
  if (letras.indexOf(tecla) == -1 && !tecla_especial)
    return false;
}
function checkPwd(str) {
	var t=/[ !#$%&()*+,\-./:;?@[\\\]^_{}]/;
	var excepto=/[ = | ; “ ” ´" '< >~]/;
	var mayu=/[ABCDEFGHIJKLMNOPQRSTUVWXYZ]/;
    if(str==null || str==undefined || str==""){
		return "Contraseña vacía";
	}else{
		str=str.trim();
		if (str.length < 8) {
           return "Contraseña debe tener minimo 8 digitos";
       } else if (str.length > 20) {
           return "Contraseña no debe ser mayor a 20 digitos";
       } else if (str.search(/\d/) == -1) {
            return "Contraseña debe tener al menos un número";
       }else if (!mayu.test(str)){
		    return "La contraseña debe contener al menos una mayúscula";
	   } else if (str.search(/[a-zA-Z]/) == -1) {
           return "Contraseña debe tener al menos un letra";
       } else if (str.search(/[a-z]/) == -1) {
           return "Contraseña debe tener al menos una letra minúscula";
       }
	   else if (!t.test(str)) {
           return "Contraseña debe tener al menos un caracter especial de los siguientes !#$%&()+/\-.//:?@_{}";
       }else if (excepto.test(str)){
		    return "La contraseña no permite los siguientes caracteres especiales = | ; “ ” ´\" '< >~ *";
	   }
       return null;
	}   
}
function validarOnlyLetrasBoolean(data) {
	var patron = /^([a-zA-Z-Z\u00D1\u00F1\u00C1\u00E1\u00C9\u00E9\u00CD\u00ED\u00D3\u00F3\u00DA\u00FAs\s])*$/;
	if (patron.test(data))
	   return true;
	else
	   return false;
}
function disabledCtlZ(e){
	if(e.ctrlKey==true){
		return false;
	}else{
		return true;
	}
}

function create_UUID(){
	var dt = new Date().getTime();
    if(!(dt==null || dt==undefined || dt=="")){
		 var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = (dt + Math.random()*16)%16 | 0;
			dt = Math.floor(dt/16);
			return (c=='x' ? r :(r&0x3|0x8)).toString(16);
		});
		return uuid;
	}else{
		return null;
	}
}
function returnClientjs(){
    var data=null;
    var client = null;
    var browser={};
    browser.app_code_name=navigator.appCodeName ;
    browser.app_name=navigator.appName ;
    browser.app_version=navigator.appVersion ;
    browser.language=navigator.language ;
    browser.platform=navigator.platform ;
    browser.user_agent=navigator.userAgent ;
    browser.onLine=navigator.onLine;
    var aux1=getBrowserInfo();
    browser.name=aux1;
    if(!(aux1==null || aux1==undefined || aux1=="")){
    	aux1=aux1.toUpperCase();
    	if(aux1.indexOf('CHROME')>-1){
    		browser.image_uri='images/chrome.png';
    	}else{
    		if(aux1.indexOf('FIREFOX')>-1){
        		browser.image_uri='images/firefox.png';
        	}else{
        		if(aux1.indexOf('OPERA')>-1){
            		browser.image_uri='images/opera.png';
            	}else{
            		if(aux1.indexOf('INTERNET EXPLORER')>-1){
                		browser.image_uri='images/ie.png';
                	}else{
                		if(aux1.indexOf('SAFARI')>-1){
							browser.image_uri='images/safari.png';
						}else{
							browser.image_uri=null;
						}
                	}
            	}
        	}
    	}
    }
    browser.version=getVersionOs();
    client={};
    client.browser=browser;
    var OSName="UNDEFINED OS";
    if (navigator.appVersion.indexOf("Win")!=-1) OSName="Windows";
    if (navigator.appVersion.indexOf("Mac")!=-1) OSName="MacOS";
    if (navigator.appVersion.indexOf("X11")!=-1) OSName="UNIX";
    if (navigator.appVersion.indexOf("Linux")!=-1) OSName="Linux";
    if (navigator.appVersion.indexOf("Android")!=-1) OSName="Android";
    var device={};
    device.type=getDeviceType();
    device.name=OSName;
    client.device=device;
    return client;
}
function getDeviceType(){
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		return 'MOBILE';
	}else{
		return 'DESKTOP';
	}
}
function getVersionOs(){
	var ua = navigator.userAgent;
	var x = ua.indexOf("MSIE");
	var y = 4;
	if (x == -1){
		x = ua.indexOf("Firefox");
		y = 7;
		if(x == -1) {
			if(x == -1){
				x = ua.indexOf("Chrome");
				y = 6;
				if(x == -1){
					x = ua.indexOf("Opera");
					y = 5;
					if(x == -1){
						x = ua.indexOf("Safari");
						if( x != -1){
							x = ua.indexOf("Version");
							y = 7;
						}
					}
				}
			}
		}
	}
	if(x != -1) {
		y ++;
		ua = ua.substring(x + y);
		x = ua.indexOf(" ");
		var x2 = ua.indexOf("(");
		if(x2 > 0 && x2 < x) 
			x = x2;
	    x2 = ua.indexOf(";");
	    if(x2 > 0 && x2 < x) 
	    	x = x2;
	    if (x == -1)
	    	return null;
	    var v = ua.substring(0, x);
	    return v;
	}
}
var getBrowserInfo = function() {
    var ua= navigator.userAgent, tem, 
    M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if(/trident/i.test(M[1])){
        tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE '+(tem[1] || '');
    }
    if(M[1]=== 'Chrome'){
        tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
        if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }
    M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
    return M.join(' ');
};
function removeCookie(data){
	if(!(data==null || data==undefined || data=="")){
		try{
			setCookie(data, '', -1); 
		}catch(er){
		}
	}
}
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length,c.length);
        }
    }
    return null;
}
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
	var domain="domain="+getDomain();
    document.cookie = cname + "=" + cvalue + "; " + expires+"; "+domain+"; path=/";
}
var tiempo;
var timeout;
var n=0
function asyncSqrt(value,callback) {
	detenerSetInterval1();
    timeout=setTimeout(function() {
		if(!(localStorage.getItem("access_token")==null || localStorage.getItem("access_token")==undefined || localStorage.getItem("access_token")=="")){
			tiempo=setInterval(function(){
				n++;
				if(n>=30){
					detenerSetInterval();
				}
			}, 998);
			app.SidebarComponent.prototype.openModal();
		}
    }, (value-30)*1000);
}
function detenerSetInterval1(){
	n=0;
	clearTimeout(timeout);
	clearInterval(tiempo);
}
function detenerSetInterval(){
	clearTimeout(timeout);
	clearInterval(tiempo);
	doLogout();
	window.location.href="/login";
}
function validarRutaAbsoluta(data){
	var patron = new RegExp('^(?:[a-z]+:)?//', 'i');
	if (patron.test(data))
	   return true;
	else
	   return false;
}