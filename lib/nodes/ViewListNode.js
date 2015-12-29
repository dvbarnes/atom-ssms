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
      "sql" : "SELECT * FROM information_schema.tables where TABLE_TYPE = 'VIEW' order by TABLE_NAME",
      db:this.name
    }).then(function(rows){
      return rows.map(function(row){
          return new ViewNode(connection, row);
      });
    });
  };

  return ViewListNode;
})();
