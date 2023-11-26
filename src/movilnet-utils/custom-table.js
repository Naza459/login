(function (app) {
    'use strict';
    app.CustomTableComponent = ng.core
        .Component({
            selector: 'custom-table',
            templateUrl: 'views/custom-table.html',
            inputs: ['size','labelSize','alignSize','totalPage','totalPageRecords','pageSelected','listOffice',"ocultarCantidad"],
            outputs: ["cantidadTransaccionesTabla","valueFirst","valuePrevious","valueNext","valueLast","valueChangeRecords"]
        })
        .Class({
           constructor: [
                function () {
                    this.cantidadTransaccionesTabla = new ng.core.EventEmitter();  
                    this.valueFirst=new ng.core.EventEmitter();
                    this.valuePrevious=new ng.core.EventEmitter();
                    this.valueNext=new ng.core.EventEmitter(); 
                    this.valueLast=new ng.core.EventEmitter();
                    this.valueChangeRecords=new ng.core.EventEmitter();
                }            
            ]
        });
    app.CustomTableComponent.prototype.acciones=function(){
        if(this.size<=this.totalPage){
            this.mostrarAcciones=false;
        }else{
            this.mostrarAcciones=true;
        }
    }  
    app.CustomTableComponent.prototype.ngOnInit = function () {
        if(this.pageSelected==1){
             this.firstPage="first-page-disabled";
             this.previousPage="previous-page-disabled";
             this.lastPage="last-page-enabled";
             this.nextPage="next-page-enabled";   
         }else{
         	if(this.pageSelected==this.totalPageRecords){
                 this.lastPage="last-page-disabled";
                 this.nextPage="next-page-disabled";
                 this.firstPage="first-page-enabled";
                 this.previousPage="previous-page-enabled";
             }else{
             	 this.firstPage="first-page-enabled";
                 this.previousPage="previous-page-enabled";
                 this.lastPage="last-page-enabled";
                 this.nextPage="next-page-enabled";
             }
         }
        this.mostrarHeader=false;
        this.mostrarAcciones=false;
        if(this.header==null || this.header==undefined || this.header==''){
            this.mostrarHeader=false;
        }else{
            this.mostrarHeader=true;
        }
        this.listPageRecord=[10,20,25,50,100];  
        this.acciones();   
    }
    app.CustomTableComponent.prototype.ngOnChanges=function(){
    	 if(this.pageSelected==1){
             this.firstPage="first-page-disabled";
             this.previousPage="previous-page-disabled";
             this.lastPage="last-page-enabled";
             this.nextPage="next-page-enabled";   
         }else{
         	if(this.pageSelected==this.totalPageRecords){
                 this.lastPage="last-page-disabled";
                 this.nextPage="next-page-disabled";
                 this.firstPage="first-page-enabled";
                 this.previousPage="previous-page-enabled";
             }else{
             	 this.firstPage="first-page-enabled";
                 this.previousPage="previous-page-enabled";
                 this.lastPage="last-page-enabled";
                 this.nextPage="next-page-enabled";
             }
         }
        this.acciones();  
    }
    app.CustomTableComponent.prototype.selectedPageShow=function(item){
        this.totalPage=item;
        this.pageSelected=1;
        var auxP = Math.floor(this.size/this.totalPage);
        var restoAux=((this.size)%this.totalPage);
        if(restoAux==0){
            this.totalPageRecords=auxP;
        }else{
            this.totalPageRecords=auxP+1;
        }
        this.lastPage="last-page-enabled";
        this.nextPage="next-page-enabled";
        this.firstPage="first-page-disabled";
        this.previousPage="previous-page-disabled";
        var datos={
            detalles:this.totalPage,
            pagina:this.totalPageRecords   
        };
        this.valueChangeRecords.emit(this.pageSelected);
        this.acciones();
        this.cantidadTransaccionesTabla.emit(datos);
    }
    app.CustomTableComponent.prototype.firstPageFunction=function(){
		if(this.firstPage=="first-page-enabled"){
			this.pageSelected=1;
			this.firstPage="first-page-disabled";
			this.previousPage="previous-page-disabled";
			this.lastPage="last-page-enabled";
			this.nextPage="next-page-enabled";
			this.valueFirst.emit(this.pageSelected);
		}
    }
    app.CustomTableComponent.prototype.previousPageFunction=function(){
		if(this.previousPage=="previous-page-enabled"){
			this.pageSelected=this.pageSelected-1;
			this.lastPage="last-page-enabled";
			this.nextPage="next-page-enabled";
			if(this.pageSelected==1){
				this.firstPage="first-page-disabled";
				this.previousPage="previous-page-disabled";
			}else{
				this.firstPage="first-page-enabled";
				this.previousPage="previous-page-enabled";
			}
			this.valuePrevious.emit(this.pageSelected);
		}
    }
    app.CustomTableComponent.prototype.nextPageFunction=function(){
		if(this.nextPage=="next-page-enabled"){
			this.pageSelected=this.pageSelected+1;
			this.firstPage="first-page-enabled";
			this.previousPage="previous-page-enabled";
			if(this.pageSelected==this.totalPageRecords){
				this.lastPage="last-page-disabled";
				this.nextPage="next-page-disabled";
			}
			this.valueNext.emit(this.pageSelected);
		}
    }
    app.CustomTableComponent.prototype.lastPageFunction=function(){
		if(this.lastPage=="last-page-enabled"){
			this.pageSelected=this.totalPageRecords;
			this.lastPage="last-page-disabled";
			this.nextPage="next-page-disabled";
			this.firstPage="first-page-enabled";
			this.previousPage="previous-page-enabled";
			this.valueLast.emit(this.pageSelected);
		}
    }
})(window.app || (window.app = {}));
