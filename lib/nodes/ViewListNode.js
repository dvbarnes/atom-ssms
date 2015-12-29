var InMemoryFolderNode = require('./InMemoryFolderNode');
var folderNode = require('../folderNode');
var ViewNode = require('../ViewNode');
require('require-sql');

module.exports = (function() {
  var ViewListNode = function(dbConnection, name){
    this.dbConnection = dbConnection;
    this.name = name;
  };

  ViewListNode.prototype.getName = function(){
    return this.data.TABLE_NAME;
  };
  
  ViewListNode.prototype.getEntries = function(){
    var connection = this.dbConnection;
    return this.dbConnection.execute({
      "sql" : require("../scripts/getViews.sql"),
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
