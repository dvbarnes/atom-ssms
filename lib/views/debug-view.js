var WordcountView;
var extend = require('./view-helpers').extend;

var LoginView = require('./login-view');
var Emitter = require('event-kit').Emitter;
var ServerNode = require('../DBServerNode');
var DbConnection = require('../DBConnection');
var ServerView = require('./server-view')
module.exports = WordcountView = (function() {
  function WordcountView(serializedState) {

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
      el.events.on('did-login', function(a){
        el2.hide();
        var element = new ServerView();
        element.initialize(new ServerNode(new DbConnection(a)));
        element.classList.add('sql-root');
        self.body.appendChild(element);
      });
    });
    this.element.appendChild(header);
    this.element.appendChild(this.body);
  }

  extend(WordcountView,HTMLElement);

  WordcountView.prototype.serialize = function() {};

  WordcountView.prototype.destroy = function() {
    return this.element.remove();
  };

  WordcountView.prototype.getElement = function() {
    return this.element;
  };

  return WordcountView;

})();
