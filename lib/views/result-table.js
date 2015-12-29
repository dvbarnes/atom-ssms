var extend = require('./view-helpers').extend;
var $ = require('atom-space-pen-views').$;
var table = require('datatables');

module.exports = ResultsTable = (function() {
  function ResultsTable() {
    this.classList.add("sql-view-result");
  }
  extend(ResultsTable,HTMLElement);

  var _getTableColumns = function(dataTable){
    var row = dataTable[0]; //not a good idea
    var columns = [{title: ''}];
    for(var k in row){
      if(row.hasOwnProperty(k)){
        columns.push({title: k});
      }
    }
    return columns;
  };

  var _getTableData = function(dataTable){
    var resultSet=dataTable.map(function(row, idx){
      var transformRow = [idx+1];
      for(var k in row){
        if(row.hasOwnProperty(k)){
          var value = row[k];
          if(value === null){
            value = "NULL";
          }
          transformRow.push(value);
        }
      }
      return transformRow;
    });
    return resultSet;
  };

  ResultsTable.prototype.init = function (dataSet) {

    var options = {
        data: _getTableData(dataSet),
        columns: _getTableColumns(dataSet),
        paging:false,
        searching:false,
        scrollX: true,
        scrollY: true,
        ordering:false

    };
    var $this = $(this);
    table.call($this,options);
  };

  return ResultsTable;
})();

var View =document.registerElement('sql-server-results-table',{
  prototype:ResultsTable.prototype,
  extends: 'table'
});

module.exports =  View;
