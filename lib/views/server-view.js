var SV;
var extend = require('./view-helpers').extend;

var tableEvents = require('../tableEvents');
module.exports = SV = (function() {

  function ServerView(){
    this.expanded = false;
  }

  function _createListItem(node){
    this._container = document.createElement("li");
    this._container.classList.add(node.class);
    if(node.canExpand){
      this._expand = document.createElement("i");
      this._expand.classList.add('icon','fa', 'fa-plus');
      this._container.appendChild(this._expand);
    }
    this._label = document.createElement("span");
    this._label.classList.add("node-text");
    var icon = document.createElement("i");

    icon.classList.add('icon','fa');
    node.icon.split(" ").forEach(function(i){
      icon.classList.add(i);
    });
    this._label.appendChild(icon);
    var text = document.createElement("span");
    text.textContent = node.name;
    this._label.appendChild(text);
    this._expandingLabel = document.createElement("span");
    this._expandingLabel.classList.add("hidden");
    this._expandingLabel.textContent = "  (expanding...)";
    this._label.appendChild(this._expandingLabel);
    this._container.appendChild(this._label);
    var self = this;
    this.classList.add('list-item');
    atom.commands.add(this._container, {
      'sql-tree-view:new-table': function(e){
        node.getEntries().then(function(test){
          console.log(test);
        });
      },
      'atom-ssms:select-top-1000': function(e){
        tableEvents.selectTop1000(node);
      },
      'atom-ssms:disconnect' : function(e){
        tableEvents.disconnect(self);
      }
    });
    this.appendChild(this._container);
  };

  extend(ServerView,HTMLElement);
  ServerView.prototype.initialize = function(node){
    this.node = node;
    this._loaded = false;
    this.classList.add('server-list');
    var self = this;
    _createListItem.call(this,node,node);
    this._container.addEventListener('click', function(e){
      if(!e.currentTarget.parentElement._loaded){_load.call(self);}
      self.toggle();
    });
  };

  function _load(){
    this._loaded = true;
    var self = this;
    this._expandingLabel.classList.remove("hidden");
    this.node.getEntries().then(function(a){
      a.forEach(function(entry){
          var element = new View();
          element.initialize(entry);
          self.appendChild(element);
      });
    }).finally(function(f){
      self._expandingLabel.classList.add("hidden");
    });
  }

  ServerView.prototype.toggle = function(){
    if(this.expanded){
      this.collapse();
    }
    this._expand.classList.toggle('fa-plus');
    this._expand.classList.toggle('fa-minus');
    this.expanded = !this.expanded;
  };

  ServerView.prototype.collapse = function(){
    var list = [];
    for(var i=0;i<this.childNodes.length;i++){
      var item = this.childNodes[i];
      if(item instanceof View){
        list.push(item);
      }
    }
    list.forEach(function(item){
      item.remove();
    });
    this._loaded = false;
  };

  ServerView.prototype.serialize = function() {};
  ServerView.prototype.destroy = function() {
    return this.remove();
  };

return ServerView;
})();

var View =document.registerElement('sql-server-view',{
  prototype:SV.prototype,
  extends: 'ul'
});

module.exports =  View;
