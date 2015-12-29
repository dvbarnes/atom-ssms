var ColumnNode = require('./ColumnNode');
require('require-sql');
module.exports = ColumnListNode = (function() {
  var ColumnListNode = function(dbConnection, data){
    this.dbConnection = dbConnection;
    this.data = data;
    this.name = this.data.TABLE_SCHEMA + "." + this.data.TABLE_NAME;
    this.icon = 'icon-browswer';
    this.class = 'sql-table';
    this.canExpand  = true;
  };

  ColumnListNode.prototype.getEntries = function(){
    var dbConnection = this.dbConnection;
    var sql =require('../scripts/getColumns.sql');
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
    }).then(function(rows) {
      return rows.map(function(row){
        return new ColumnNode(dbConnection,row);
      });
    });
  };

  return ColumnListNode;
})();
