var ConstraintNode = require('./ConstraintNode');
require('require-sql');
module.exports = ConstraintListNode = (function() {
  var ConstraintListNode = function(dbConnection, data){
    this.dbConnection = dbConnection;
    this.data = data;
    this.name = this.data.TABLE_SCHEMA + "." + this.data.TABLE_NAME;
    this.icon = 'icon-browswer';
    this.class = 'sql-table';
    this.canExpand  = true;
  };

  ConstraintListNode.prototype.getEntries = function(){
    var dbConnection = this.dbConnection;
    var sql =require('../scripts/getConstraints.sql');
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
      console.log(rows);
      return rows.map(function(row){
        return new ConstraintNode(dbConnection,row);
      });
    });
  };

  return ConstraintListNode;
})();
