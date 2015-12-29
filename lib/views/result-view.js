var extend = require('./view-helpers').extend;
var $ = require('atom-space-pen-views').$;
var ResultTable = require('./result-table')
var ResultsView;

module.exports = ResultsView = (function() {
  function ResultsView() {
    this.classList.add("sql-view-result");
  }
  extend(ResultsView,HTMLElement);

  ResultsView.prototype.updateView = function (requestFunc) {
    var self = this;
    requestFunc().then(function(dataSet){
      var result = new ResultTable();
      $(self).empty(); //TODO: cache $(self)
      self.appendChild(result);
      result.init(dataSet);
    }, function(error){
      $(self).empty();
      var span = document.createElement("span");
      span.textContent = error.message;
      self.appendChild(span);
    });
  };

  return ResultsView;
})();

var View =document.registerElement('sql-server-results-view',{
  prototype:ResultsView.prototype,
  extends: 'div'
});

module.exports =  View;
