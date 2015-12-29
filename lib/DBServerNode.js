
var DBNode = require('./DBDbNode');
var InMemoryFolderNode = require('./nodes/InMemoryFolderNode');
var folderNode = require('./folderNode');
module.exports = DBServerNode = (function() {
  var DBServerNode = function(dbConnection){
    this.dbConnection = dbConnection;
    this.name = dbConnection.options.server;
    this.icon = "fa-server";
    this.class = 'sql-db-server';
    this.canExpand =true;
  };
  DBServerNode.prototype.getEntries = function(){
    var connection = this.dbConnection;
    return this.dbConnection.execute({
      sql:"SELECT * FROM dbo.sysdatabases",
      db:"master"
    }).then(function(rows){
      var sys = [];
      var userDbs = [];
      rows.forEach(function(row){
        var con = connection.clone();
        con.options.options.database = row.name;
        if(row.dbid > 4){
          userDbs.push(new DBNode(con, row));
        }else{
          sys.push(new DBNode(con, row));
        }
      });
      return [new folderNode(new InMemoryFolderNode(sys),"System Databases")].concat(userDbs);
    });
  };

  return DBServerNode;
})();
