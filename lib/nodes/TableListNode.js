var InMemoryFolderNode = require('./InMemoryFolderNode');
var folderNode = require('../folderNode');
var ViewNode = require('../TableNode');

module.exports = (function() {
  var TableListNode = function(dbConnection, name){
    this.dbConnection = dbConnection;
    this.name = name;
  };

  TableListNode.prototype.getEntries = function(){
    var connection = this.dbConnection;
    var self = this;
    return this.dbConnection.execute({
      "sql" : "select OBJECT_SCHEMA_NAME(object_id) as [TABLE_SCHEMA], name as [TABLE_NAME], is_ms_shipped from sys.objects where type in('U','S')",
      db:this.name
    }).then(function(rows){
      var user = [];
      var sys = [];
      rows.forEach(function(row){
        if(row.is_ms_shipped){
          sys.push(new TableNode(connection, row));
        }else{
          user.push(new TableNode(connection, row));
        }
      });
      return [new folderNode(new InMemoryFolderNode(sys), "System Tables")].concat(user);
    });
  };

  return TableListNode;
})();
