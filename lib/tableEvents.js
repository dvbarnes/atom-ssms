
var instanceCount = 0;
var events = {};
var ColumnNode = require('./nodes/ColumnNode');
events.selectTop1000 = function(node){
  var columnNode =new ColumnNode(node.dbConnection, node.data);
  return columnNode.getEntries().then(function(columns){
    var me = columns.map(function(c){
      return c.COLUMN_NAME;
    }).join('\n\t,');
    var selectString =`SELECT TOP 1000\n\t ${me}\nFROM [${node.data.TABLE_SCHEMA}].[${node.data.TABLE_NAME}]`;
    atom.workspace.open(`SQLQuery-${instanceCount++}-[${node.data.TABLE_SCHEMA}].[${node.data.TABLE_NAME}].sql`).then(function(editor){
      editor.__meta = editor.__meta || {};
      editor.__meta.dbConnection = node.dbConnection;
      editor.insertText(selectString);
    });
  });
};

module.exports = events;
