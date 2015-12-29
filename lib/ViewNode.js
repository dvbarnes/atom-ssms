//args will look like the options from
//http://pekim.github.io/tedious/api-connection.html#function_newConnection

//this class is to trace connection data from each type of dbNode

module.exports = ViewNode = (function() {
  var ViewNode = function(dbConnection, data){
    this.dbConnection = dbConnection;
    this.data = data;
    console.log(data);
    this.name = this.data.TABLE_SCHEMA + "." + this.data.name;
    this.canExpand  = true;
    this.class = 'sql-view';
  };

  ViewNode.prototype.getEntries = function(){
    console.log("??");
  };

  return ViewNode;
})();
