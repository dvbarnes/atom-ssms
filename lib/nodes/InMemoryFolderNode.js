var Q = require('Q');
module.exports = (function() {
  var InMemoryFolderNode = function(data, name){
    this.data = data;
  };

  InMemoryFolderNode.prototype.getName = function(){
    return this.data.TABLE_NAME;
  }
  InMemoryFolderNode.prototype.getEntries = function(){
    var d = Q.defer();
    d.resolve(this.data);
    return d.promise;
  };
  return InMemoryFolderNode;
})();
