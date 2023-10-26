(function(app) {
  app.MsgComponent =
    ng.core.Component({
    	selector:  'msg-component',
     	templateUrl: 'views/msg1.html',
      inputs:['mensaje'],
      outputs:['valueChanged','valueChangedError']
    })
    .Class({
      constructor: [function() {
        this.valueChanged = new ng.core.EventEmitter();
        this.valueChangedError= new ng.core.EventEmitter();
      }]
    });

    app.MsgComponent.prototype.info=function(){
        $("#msgInfo").modal("show");
    }
    app.MsgComponent.prototype.error=function(){
      $("#msgError").modal("show");
    }
    app.MsgComponent.prototype.error2=function(){
      $("#msgErrorRedirect").modal("show");
    }
    app.MsgComponent.prototype.warning=function(){
      $("#msgWarning").modal("show");
    }
    app.MsgComponent.prototype.sendMsg=function(){
      this.valueChanged.emit(); 
    }
    app.MsgComponent.prototype.sendMsg2=function(){
      this.valueChangedError.emit();   
    }
})(window.app || (window.app = {}));