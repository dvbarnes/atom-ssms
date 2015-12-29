var Q = require('Q');
var Connection = require('tedious').Connection;

module.exports = DBConnectionNode = (function() {
  var DBConnectionNode = function(options){
    this.options = options;
    this.TYPES = require('tedious').TYPES;
  };

  function _copy(obj){
    return JSON.parse(JSON.stringify(obj));
  };

  DBConnectionNode.prototype.clone = function(){
    var copy = _copy(this.options);
    return new DBConnectionNode(copy);
  };

  DBConnectionNode.prototype.execute = function(options){
    var defer = Q.defer();
    if(typeof(options) === "string"){
      options = {sql:options};
    }
    var o = _copy(this.options);
    if(typeof(options.db) !== "undefined"){
      o.options.database = options.db;
    }
    var connection = new Connection(o);

    connection.on('connect', function(err) {
      if(err){
        defer.reject(err);
      }
      var rows = [];
      var Request = require('tedious').Request;
      request = new Request(options.sql, function(err, rowCount, r) {
        if(err){
          defer.reject(err);
        }
        defer.resolve(rows);
        connection.close();
      });
      if(typeof(options.parameters) !== 'undefined'){
        options.parameters.forEach(function(p){
          request.addParameter(p.name, p.type, p.value);
        });
      }

      request.on('row', function (columns) {
          var row = {};
          for(var k in columns){
            var c = columns[k];
            row[c.metadata.colName] = c.value;
          }
          rows.push(row);
       });
      connection.execSql(request);
      }
    );
    return defer.promise;
  };

  return DBConnectionNode;
})();
