(function(app) {
	app.SidebarComponent =
		ng.core.Component({
		selector: 'sidebar',
		templateUrl: 'views/sidebar-v1.html'
		})
		.Class({
		  constructor: [ng.router.ActivatedRoute,ng.router.Router,app.AppCallService,
			function(active,router,ser) {
				this.active=this.active;
				this.router=router;
				this.ser=ser;
			}
		]
		});
	app.SidebarComponent.prototype.ngOnInit=function(){  
			
	}
	app.SidebarComponent.prototype.salir=function(){
		let mensajeAll="Error al cerrar sesion";
		let request=this.ser.callServicesHttp('logout',null,null);
		request.subscribe(data=>{
			if(!(data==null || data==undefined || data=="")){
				if(data.status_http!=200){
					this.mensaje=this.ser.processMessageError(data,mensajeAll)
				}
			}
			doLogout();
			this.router.navigate(['/login']);
		},err=>{
			this.mensaje=this.ser.processError(err,mensajeAll);
			doLogout();
			this.router.navigate(['/login']);
		});
	}
})(window.app || (window.app = {}));