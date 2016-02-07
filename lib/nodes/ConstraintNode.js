
module.exports = (function() {
  var ConstraintNode = function(dbConnection, data){
    this.dbConnection = dbConnection;
    this.data = data;
    this.name = `${this.data.CONSTRAINT_NAME}`;
    this.icon = _getIconType(this.data);
    this.class = 'sql-table';
    this.canExpand  = false;
  };

  var _getIconType = function(row){
    if(row.CONSTRAINT_TYPE === "PRIMARY KEY"){
      return "fa-key pk";
    }else if(row.CONSTRAINT_TYPE === "FOREIGN KEY"){
      return 'fa-key fk';
    }else if(row.CONSTRAINT_TYPE === "UNIQUE"){
      return 'fa-key uk';
    }
  };

  ConstraintNode.prototype.getEntries = function(){
  };

  return ConstraintNode;
})();
