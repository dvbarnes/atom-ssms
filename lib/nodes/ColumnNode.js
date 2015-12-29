
module.exports = (function() {
  var ColumnNode = function(dbConnection, data){
    this.dbConnection = dbConnection;
    this.data = data;
    var type = _getTypeString(this.data);
    this.name = `${this.data.COLUMN_NAME} (${type})`;
    this.icon = 'fa-columns';
    this.class = 'sql-table';
    this.canExpand  = false;
  };

  var _getTypeString = function(row){
    var type = row.DATA_TYPE;
    if(row.DATA_TYPE === "varchar" || row.DATA_TYPE === "nvarchar" || row.DATA_TYPE === "char"){
      var length =row.CHARACTER_MAXIMUM_LENGTH > 0 ?row.CHARACTER_MAXIMUM_LENGTH : "max";
      type = `${row.DATA_TYPE}(${length})`
    }
    var isNull = row.IS_NULLABLE === "YES" ? "null" : "not null"
    return `${type}, ${isNull}`;
  };

  ColumnNode.prototype.getEntries = function(){
  };

  return ColumnNode;
})();
