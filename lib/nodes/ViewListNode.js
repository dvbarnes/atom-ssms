var InMemoryFolderNode = require('./InMemoryFolderNode');
var folderNode = require('../folderNode');
var ViewNode = require('../ViewNode');

module.exports = (function() {
  var ViewListNode = function(dbConnection, name){
    this.dbConnection = dbConnection;
    this.name = name;
  };

  ViewListNode.prototype.getName = function(){
    return this.data.TABLE_NAME;
  }
  ViewListNode.prototype.getEntries = function(){
    var connection = this.dbConnection;
    return this.dbConnection.execute({
      "sql" : "select OBJECT_SCHEMA_NAME(object_id) as [TABLE_SCHEMA], * from sys.objects where type='V'",
      db:this.name
    }).then(function(rows){
      var user = [];
      var sys = [];
      rows.forEach(function(row){
        if(row.is_ms_shipped){
          sys.push(new ViewNode(connection, row));
        }else{
          user.push(new ViewNode(connection, row));
        }
      });
      return [new folderNode(new InMemoryFolderNode(sys), "System Views")].concat(user);
    });
  };

  return ViewListNode;
})();
