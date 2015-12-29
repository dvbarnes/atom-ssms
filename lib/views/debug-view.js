var MainView;
var extend = require('./view-helpers').extend;

var LoginView = require('./login-view');
var Emitter = require('event-kit').Emitter;
var ServerNode = require('../DBServerNode');
var DbConnection = require('../DBConnection');
var ServerView = require('./server-view');
var config = require('../server-config');


module.exports = MainView = (function() {
  function MainView(serializedState) {

    var header;
    this.element = document.createElement('div');
    this.element.classList.add('sql-view-scroller');
    header = document.createElement('div');
    header.classList.add('header',"sql-view-header");
    header.textContent = "Connect";
    this.body = document.createElement("div");
    this.body.classList.add('sql-view-body');
    var self = this;
    header.addEventListener('click', function(){
      var el = new LoginView();
      var el2 = atom.workspace.addModalPanel({
        item: el.getElement(),
        visible: true
      });
      el.postAdd();
      el.events.on('did-cancel', function(){
        el2.hide();
      })
      el.events.on('did-login', function(a){
        el2.hide();
        config.addOrUpdate(a);
        var element = new ServerView();
        element.initialize(new ServerNode(new DbConnection(a)));
        element.classList.add('sql-root');
        self.body.appendChild(element);
      });
    });
    this.element.appendChild(header);
    this.element.appendChild(this.body);
  }

  extend(MainView,HTMLElement);

  MainView.prototype.serialize = function() {};

  MainView.prototype.destroy = function() {
    return this.element.remove();
  };

  MainView.prototype.getElement = function() {
    return this.element;
  };

  return MainView;

})();
