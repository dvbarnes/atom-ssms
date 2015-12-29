var Q = require('Q');

module.exports = (function() {
  var TODONode = function(dbConnection, name){
    this.dbConnection = dbConnection;
    this.name = name;
    this.canExpand = false;
  };

  TODONode.prototype.getName = function(){
    return this.data.TABLE_NAME;
  };

  TODONode.prototype.getEntries = function(){
    var d = Q.defer();
    d.resolve([{name:"todo"}])
    return d.promise;
  };

  return TODONode;
})();
