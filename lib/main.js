var CompositeDisposable, Wordcount, WordcountView;

WordcountView = require('./views/debug-view');
var ResultsView = require('./views/result-view');

CompositeDisposable = require('atom').CompositeDisposable;
module.exports = Wordcount = {
  wordcountView: null,
  modalPanel: null,
  subscriptions: null,
  activate: function(state) {
    this.wordcountView = new WordcountView(state.wordcountViewState);
    this.resultView = new ResultsView();
    this.modalPanel = atom.workspace.addLeftPanel({
      item: this.wordcountView.getElement(),
      visible: false
    });
    this.resultPanel = atom.workspace.addBottomPanel({
      item: this.resultView,
      visible: true
    });
    this.subscriptions = new CompositeDisposable;
    return this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-ssms:init': (function(_this) {
        return function() {
          return _this.toggle();
        };
      })(this),
      'atom-ssms:execute-sql': (function(_this) {
        console.log('run')
        return function() {
          var editor=atom.workspace.getActiveTextEditor();
          var text = editor.getSelectedText() || editor.getText();
          _this.resultPanel.show();
          _this.resultView.updateView(function(){
              return editor.__meta.dbConnection.execute({sql: text});
          });
        };
      })(this)
    }));
  },
  deactivate: function() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    return this.wordcountView.destroy();
  },
  serialize: function() {
    console.log("save all the states");
    return {
      wordcountViewState: this.wordcountView.serialize(),
      resultViewState: this.resultViewState.serialize()
    };
  },
  toggle: function() {
    console.log('Wordcount was toggled!');
    if (this.modalPanel.isVisible()) {
      return this.modalPanel.hide();
    } else {
      return this.modalPanel.show();
    }
  }
};
