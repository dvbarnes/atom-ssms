
var TableNode = require('./TableNode');
var ViewNode = require('./ViewNode');
var FolderView = require('./folderNode');
var TableListNode = require('./nodes/TableListNode');
var ViewListNode = require('./nodes/ViewListNode');
var TODONode = require('./nodes/TODONode');
var Q = require('Q');

module.exports = DBServerNode = (function() {
  var DBServerNode = function(dbConnection, r){
    this.dbConnection = dbConnection;
    this.r = r;
    this.name = this.r.name;
    this.icon = 'fa-database';
    this.class = 'sql-database';
    this.canExpand = true;
  };
  DBServerNode.prototype.getEntries = function(){
    var d = Q.defer();

    var views = [];
    views.push(new FolderView(new TableListNode(this.dbConnection,this.r.name), "Tables"));
    views.push(new FolderView(new ViewListNode(this.dbConnection,this.r.name), "Views"));

    views.push(new FolderView(new TODONode(), "Programmability"));
    views.push(new FolderView(new TODONode(), "Replication"));
    d.resolve(views);

    return d.promise;
  };
  return DBServerNode;
})();
