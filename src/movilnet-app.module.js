(function(app) {
  app.AppModule =
    ng.core.NgModule({
		imports: [
			ng.platformBrowser.BrowserModule,
			ng.forms.FormsModule,
			ng.router.RouterModule,
			ng.http.HttpModule,
			app.routing	
		],
		declarations: [
			app.LoadingServiceComponent,
			app.MsgComponent,
			app.CustomTableComponent,
			app.SidebarComponent,
			app.LoginComponent,
			app.RegisterComponent,
			app.ActiveComponent,
			app.ResendActivationComponent,
			app.RequestRecoveryPasswordComponent,
			app.RecoveryComponent,
			app.AppsComponent,
			app.ExpiredPasswordComponent,
			app.RegisterWithEmailComponent,
			app.RegisterEandPComponent,
			app.AppComponent
		],
		providers: [
			app.AppCallService,
			app.MsgComponent,
			app.LoadingServiceComponent
		],
		bootstrap: [app.AppComponent]
   }).Class({
      constructor: function() {}
   });
})(window.app || (window.app = {}));