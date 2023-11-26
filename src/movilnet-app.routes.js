(function(app) {
  app.routing = ng.router.RouterModule.forRoot([
		{path: '', redirectTo: 'login', pathMatch: 'full'},
		{path:'login',component:app.LoginComponent},
		{path:'register_password_and_questions',component:app.RegisterWithEmailComponent},
		{path:'active',component:app.ActiveComponent},
		{path: 'resend',component:app.ResendActivationComponent},
		{path:'request',component:app.RequestRecoveryPasswordComponent},
		{path:'recovery',component:app.RecoveryComponent},
		{path:'register',component:app.RegisterComponent},
		{path:'register-with-email',component:app.RegisterEandPComponent},
		{path:'expired-password',component:app.ExpiredPasswordComponent},
		{path:'apps',component:app.AppsComponent}
  ],{useHash: true});
})(window.app || (window.app = {}));