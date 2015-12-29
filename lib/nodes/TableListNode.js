module.exports = (function() {
  var TableListNode = function(dbConnection, name){
    this.dbConnection = dbConnection;
    this.name = name;
  };

  TableListNode.prototype.getName = function(){
    return this.data.TABLE_NAME;
  };

  var _copy = function(obj){
    return JSON.parse(JSON.stringify(obj));
  }
  TableListNode.prototype.getEntries = function(){

    var connection = this.dbConnection;
    var self = this;
    return this.dbConnection.execute({
      "sql" : "SELECT * FROM information_schema.tables where TABLE_TYPE = 'BASE TABLE' order by TABLE_NAME",
      db:this.name
    }).then(function(rows){
      return rows.map(function(row){
          var con = connection.clone();
          con.options.options.database = self.name;
          return new TableNode(con, row);
      });
    });
  };

  return TableListNode;
})();
