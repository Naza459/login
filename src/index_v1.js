//var domain="localhost";
var domain="demo.paguetodo.com";
var base="https://"+domain+"/";
function getDomain(){
	return domain;
}
function doLogout(){
	localStorage.clear();
	sessionStorage.clear();
}
function getRealm(){
	return "movistar";
}
function getApi(){
	return "https://apid.paguetodo.com/demo/";
}
function getEnlaceAuth(){
	return "deegle_auth";
}
function getEnlaceDeegle(){
	return "deegle";
}
function getEnlaceDeegleAuthV2(){
	return "deeglev2_auth";
}
function getStatic(){
	return "https://staticd.paguetodo.com/"
}
function redirectUri(){
	return encodeURIComponent(redirectUriBase());
}
function redirectUriBase(){
	return base+"movilnet-login/login";
}
function getClient(){
	return "99475e85-9623-40b5-8f45-0dfbc78adb77";
}
function getPaguetodoId(){
	return "dfb8aca9-5259-4582-ad81-9ffe0ae75ad3"
}
function publicKey(){
	return "-----BEGIN PUBLIC KEY-----MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAo2R/WgKI1Bn1gshmmPbNeblJl1ya9vnKW+txqKbnFi7q4SvO+EMubbIwbpnszMceDTJkLgvybXAjxIzurGArHpykQ/2+L3NWJAxm2u46BwpTIExaZNjj8mKwuQlPu3ewLBhNNc2mdZxWeDqPSIvtw0L13D8zcvS2sX4liHJZnycb5E7fIVThDo75TGZtDna/TI9CZS/dVuKimNks8ouHBOdfm7H0Bqf695Uc4spd7Xh49FoU2gAFUZ//bzLiS8fSFkvdUUzPaOAd5FKKAYfObyMEz31FzIicJLTIAmTTT4q1L0lUuqkWpwkIkeCdfBNwrWDPormsDDdgPThkbiOj5sXulODCsc7rNzk6QDXA0zRSd8Lqemx7Os/m18dax8MiU6KOfT2hU90FnTcenngHyCmecYQEgAWyCPgWsb5dd8631BnY/6iHMjFyfrLxNljU/ZJpgqjNOme2VqNsF2wxzbajcOk6BsbS+15CwlHf179100NojF22UHq+ZNK87xqZJyStJ6hq7tKpiI32icX7oiK+nbHzsLFScQsz+u82aNBaad+BMMc/Xdx+3BkZGz1LgOcZTLuV1vbw1fJLSAQcKZRf9HKIP9+nSZ9IwK/Gt3InlpyUSgVPlWTh5PZVah7zsAT7uAzLXC+BibjaW8elRs8FZpZ/eK5KMH8clzdVGG0CAwEAAQ==-----END PUBLIC KEY-----";
}
function getScopes(){
	let json={
		"PYME_B":{
			"app_name":"CLIENT",
			"app_owner_id":"3606bce0-0d0c-11e8-bf0a-6b5a224d7afd",
			"status":"TEST",
			"id":"18623490-2fa2-11ed-aec1-3525a8aa3a32"
		},
		"PYME_A":{
			"app_name":"CLIENT",
			"app_owner_id":"3606bce0-0d0c-11e8-bf0a-6b5a224d7afd",
			"status":"TEST",
			"id":"18623490-2fa2-11ed-aec1-3525a8aa3a32"
		},
		"BIG_ENTERPRISE":{
			"app_name":"CLIENT",
			"app_owner_id":"3606bce0-0d0c-11e8-bf0a-6b5a224d7afd",
			"status":"TEST",
			"id":"18623490-2fa2-11ed-aec1-3525a8aa3a32"
		}
	}
	return json;
}