
module.exports = (function() {
  var FolderNode = function(node, name){
    this.node = node;
    this.name = name;
    this.icon = "fa-folder";
    this.canExpand = true;
  };
  FolderNode.prototype.getEntries = function(){
    return this.node.getEntries();
  };
  return FolderNode;
})();
