module.exports = (function() {
  var ColumnNode = function(dbConnection, data){
    this.dbConnection = dbConnection;
    this.data = data;
    this.name = this.data.COLUMN_NAME;
    this.icon = 'fa-columns';
    this.class = 'sql-table';
    this.canExpand  = false;
  };

  ColumnNode.prototype.getEntries = function(){
    var sql ="SELECT * FROM INFORMATION_SCHEMA.COLUMNS where TABLE_NAME=@tableName AND TABLE_SCHEMA=@tableSchema"
    return this.dbConnection.execute({
      sql:sql,
      parameters:[{
        name: 'tableName',
        type: this.dbConnection.TYPES.VarChar,
        value:this.data.TABLE_NAME
      },
      {
        name: 'tableSchema',
        type: this.dbConnection.TYPES.VarChar,
        value:this.data.TABLE_SCHEMA
      }]
    });
  };

  return ColumnNode;
})();
