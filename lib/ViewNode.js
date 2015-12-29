
var ColumnListNode = require('./nodes/ColumnListNode');
var FolderView = require('./folderNode');
var TODONode = require('./nodes/TODONode');
var Q = require('Q');

module.exports = ViewNode = (function() {
  var ViewNode = function(dbConnection, data){
    this.dbConnection = dbConnection;
    this.data = data;
    this.name = this.data.TABLE_SCHEMA + "." + this.data.TABLE_NAME;
    this.canExpand  = true;
    this.icon = 'fa-object-group';
  };

  ViewNode.prototype.getEntries = function(){
    var d = Q.defer();

    var views = [];
    views.push(new FolderView(new ColumnListNode(this.dbConnection,this.data), "Columns"));
    views.push(new FolderView(new TODONode(), "Constrains"));

    views.push(new FolderView(new TODONode(), "Indexes"));
    views.push(new FolderView(new TODONode(), "Statistics"));
    d.resolve(views);

    return d.promise;
  };

  return ViewNode;
})();
