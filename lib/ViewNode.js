module.exports = ViewNode = (function() {
  var ViewNode = function(dbConnection, data){
    this.dbConnection = dbConnection;
    this.data = data;
    this.name = this.data.TABLE_SCHEMA + "." + this.data.name;
    this.canExpand  = true;
    this.class = 'sql-view';
  };

  ViewNode.prototype.getEntries = function(){
    console.log("??");
  };

  return ViewNode;
})();
