function _(s) {
	if(s!=null){
		s=s.toLowerCase();
		if (typeof(i18n)!='undefined' && i18n[s]) {
			return i18n[s];
		}
	}
 	return s;
}