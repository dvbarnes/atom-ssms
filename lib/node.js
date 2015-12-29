var CompositeDisposable, Directory, Emitter, File, PathWatcher, _, fs, path, realpathCache, ref, repoForPath;

path = require('path');

_ = require('underscore-plus');

ref = require('event-kit'), CompositeDisposable = ref.CompositeDisposable, Emitter = ref.Emitter;

var Connection = require('tedious').Connection;

PathWatcher = require('pathwatcher');

File = require('./file');

repoForPath = require('./helpers').repoForPath;

realpathCache = {};
//A NODE a base class that looks like a tree

module.exports = Node = (function() {
  function Node() {
    this.destroyed = false;
    this.emitter = new Emitter();
    this.subscriptions = new CompositeDisposable();
    this.isRoot = true;
  }

  Node.prototype.destroy = function() {
    this.destroyed = true;
    this.unwatch();
    this.subscriptions.dispose();
    return this.emitter.emit('did-destroy');
  };

  Node.prototype.onDidDestroy = function(callback) {
    return this.emitter.on('did-destroy', callback);
  };

  Node.prototype.onDidStatusChange = function(callback) {
    return this.emitter.on('did-status-change', callback);
  };

  Node.prototype.onDidAddEntries = function(callback) {
    return this.emitter.on('did-add-entries', callback);
  };

  Node.prototype.onDidRemoveEntries = function(callback) {
    return this.emitter.on('did-remove-entries', callback);
  };

  //make abstract
  Node.prototype.getEntries = function() {
    var directories, error, expansionState, files, fullPath, i, len, name, names, stat, symlink;
    try {
      names = fs.readdirSync(this.path);
    } catch (_error) {
      error = _error;
      names = [];
    }
    names.sort(new Intl.Collator(void 0, {
      numeric: true,
      sensitivity: "base"
    }).compare);
    files = [];
    directories = [];
    for (i = 0, len = names.length; i < len; i++) {
      name = names[i];
      fullPath = path.join(this.path, name);
      if (this.isPathIgnored(fullPath)) {
        continue;
      }
      stat = fs.lstatSyncNoException(fullPath);
      symlink = typeof stat.isSymbolicLink === "function" ? stat.isSymbolicLink() : void 0;
      if (symlink) {
        stat = fs.statSyncNoException(fullPath);
      }
      if (typeof stat.isDirectory === "function" ? stat.isDirectory() : void 0) {
        if (this.entries.hasOwnProperty(name)) {
          directories.push(name);
        } else {
          expansionState = this.expansionState.entries[name];
          directories.push(new Directory({
            name: name,
            fullPath: fullPath,
            symlink: symlink,
            expansionState: expansionState,
            ignoredPatterns: this.ignoredPatterns
          }));
        }
      } else if (typeof stat.isFile === "function" ? stat.isFile() : void 0) {
        if (this.entries.hasOwnProperty(name)) {
          files.push(name);
        } else {
          files.push(new File({
            name: name,
            fullPath: fullPath,
            symlink: symlink,
            realpathCache: realpathCache
          }));
        }
      }
    }
    return this.sortEntries(directories.concat(files));
  };

  //??
  Node.prototype.normalizeEntryName = function(value) {
    var normalizedValue;
    normalizedValue = value.name;
    if (normalizedValue == null) {
      normalizedValue = value;
    }
    if (normalizedValue != null) {
      normalizedValue = normalizedValue.toLowerCase();
    }
    return normalizedValue;
  };

  //rewrite
  Node.prototype.sortEntries = function(combinedEntries) {
    if (atom.config.get('tree-view.sortFoldersBeforeFiles')) {
      return combinedEntries;
    } else {
      return combinedEntries.sort((function(_this) {
        return function(first, second) {
          var firstName, secondName;
          firstName = _this.normalizeEntryName(first);
          secondName = _this.normalizeEntryName(second);
          return firstName.localeCompare(secondName);
        };
      })(this));
    }
  };

  //TODO
  Node.prototype.reload = function() {
    var entriesRemoved, entry, i, index, j, len, len1, name, newEntries, ref1, removedEntries;
    newEntries = [];
    removedEntries = _.clone(this.entries);
    index = 0;
    ref1 = this.getEntries();
    for (i = 0, len = ref1.length; i < len; i++) {
      entry = ref1[i];
      if (this.entries.hasOwnProperty(entry)) {
        delete removedEntries[entry];
        index++;
        continue;
      }
      entry.indexInParentDirectory = index;
      index++;
      newEntries.push(entry);
    }
    entriesRemoved = false;
    for (name in removedEntries) {
      entry = removedEntries[name];
      entriesRemoved = true;
      entry.destroy();
      if (this.entries.hasOwnProperty(name)) {
        delete this.entries[name];
      }
      if (this.expansionState.entries.hasOwnProperty(name)) {
        delete this.expansionState.entries[name];
      }
    }
    if (entriesRemoved) {
      this.emitter.emit('did-remove-entries', removedEntries);
    }
    if (newEntries.length > 0) {
      for (j = 0, len1 = newEntries.length; j < len1; j++) {
        entry = newEntries[j];
        this.entries[entry.name] = entry;
      }
      return this.emitter.emit('did-add-entries', newEntries);
    }
  };

  //TODO
  Node.prototype.collapse = function() {
    this.expansionState.isExpanded = false;
    this.expansionState = this.serializeExpansionState();
    return this.unwatch();
  };

  //TODO: make abstract
  Node.prototype.expand = function() {
    this.expansionState.isExpanded = true;
    this.reload();
    return this.watch();
  };

  //??
  Node.prototype.serializeExpansionState = function() {
    var entry, expansionState, name, ref1;
    expansionState = {};
    expansionState.isExpanded = this.expansionState.isExpanded;
    expansionState.entries = {};
    ref1 = this.entries;
    for (name in ref1) {
      entry = ref1[name];
      if (entry.expansionState != null) {
        expansionState.entries[name] = entry.serializeExpansionState();
      }
    }
    return expansionState;
  };

  //??
  Node.prototype.squashDirectoryNames = function(fullPath) {
    var contents, relativeDir, squashedDirs;
    squashedDirs = [this.name];
    while (true) {
      contents = fs.listSync(fullPath);
      if (contents.length !== 1) {
        break;
      }
      if (!fs.isDirectorySync(contents[0])) {
        break;
      }
      relativeDir = path.relative(fullPath, contents[0]);
      squashedDirs.push(relativeDir);
      fullPath = path.join(fullPath, relativeDir);
    }
    if (squashedDirs.length > 1) {
      this.squashedName = squashedDirs.slice(0, +(squashedDirs.length - 2) + 1 || 9e9).join(path.sep) + path.sep;
    }
    this.name = squashedDirs[squashedDirs.length - 1];
    return fullPath;
  };

  return Node;

})();
