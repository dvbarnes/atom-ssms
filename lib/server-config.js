module.exports = {
  addOrUpdate: function(data){
    var servers = this.get();
    var shouldInsert = true;
    for(var i=0;i<servers.length;i++){
      var entry = servers[i];
      if(entry.server === data.server){
        //update
        console.log("updating server information");
        shouldInsert = false;
      }
    }
    if(shouldInsert){
      console.log("adding new server information");
      servers.push(data);
    }
    atom.config.set('atom-ssms:servers', JSON.stringify(servers));
  },
  get: function(name){
    var json = atom.config.get('atom-ssms:servers') || "[]";
    var servers = JSON.parse(json) || [];
    if(typeof(name) === "undefined"){
      return servers;
    }
    return servers.find(function(n){
      return n.server === name;
    });
  }
};
