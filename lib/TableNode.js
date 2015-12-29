
var Q = require('Q');
var FolderView = require('./folderNode');
var ColumnListNode = require('./nodes/ColumnListNode');
var TODONode = require('./nodes/TODONode');

module.exports = TableNode = (function() {
  var TableNode = function(dbConnection, data){
    this.dbConnection = dbConnection;
    this.data = data;
    this.name = this.data.TABLE_SCHEMA + "." + this.data.TABLE_NAME;
    this.icon = 'fa-table';
    this.class = 'sql-table';
    this.canExpand  = true;
  };

  TableNode.prototype.getEntries = function(){
    var d = Q.defer();

    var views = [];
    views.push(new FolderView(new ColumnListNode(this.dbConnection,this.data), "Columns"));
    views.push(new FolderView(new TODONode(), "Constrains"));

    views.push(new FolderView(new TODONode(), "Indexes"));
    views.push(new FolderView(new TODONode(), "Statistics"));
    d.resolve(views);

    return d.promise;
  };

  return TableNode;
})();
