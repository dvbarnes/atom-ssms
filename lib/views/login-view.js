var WordcountView;
var extend = require('./view-helpers').extend;
var Emitter = require('event-kit').Emitter;
var Typeahead = require('typeahead');
var servers = require('../server-config');

module.exports = LoginView = (function() {
  var _createServerInput = function(input){
    var data = servers.get().map(function(entry){
      return entry.server;
    });
    var ta = Typeahead(input, {
      source: data,
      hint: true,
      highlight: true,
      minLength: 1
    });
    ta.menu.addClass('server-complete');
  };

  var _fill = function(data){
    this._userNameInput.value = data.userName;
    this._passwordInput.value = data.password;
  };

  function LoginView(serializedState) {

    this.events = new Emitter();
    this.element = document.createElement('div');
    this.element.classList.add('login-view');
    var serverDiv = document.createElement("div");
    var serverLabel = document.createElement("label");
    serverLabel.textContent = "Server:";
    serverLabel.style.width = 200;
    serverDiv.appendChild(serverLabel);

    var serverInput = document.createElement("input");
    serverInput.type = "text";
    serverInput.classList.add('native-key-bindings');
    serverInput.setAttribute('tabIndex', "1");
    serverDiv.appendChild(serverInput);
    this.element.appendChild(serverDiv);

    this._serverInput = serverInput;

    var userName = document.createElement('div');
    var userNameLabel = document.createElement("label");
    userNameLabel.textContent = "Username:"
    userName.appendChild(userNameLabel);
    var userNameInput = document.createElement("input");
    userNameInput.setAttribute('tabIndex', "2");
    userName.appendChild(userNameInput);
    userNameInput.classList.add('native-key-bindings');
    this.element.appendChild(userName);

    this._userNameInput = userNameInput;

    var password = document.createElement('div');
    var passwordLabel = document.createElement("label");
    passwordLabel.textContent = "Password:"
    password.appendChild(passwordLabel);

    var passwordInput = document.createElement("input");
    passwordInput.type = "Password";
    passwordInput.setAttribute('tabIndex', "3");
    passwordInput.classList.add('native-key-bindings');
    password.appendChild(passwordInput);
    this._passwordInput = passwordInput;

    this.element.appendChild(password);

    var loginDiv = document.createElement("div");

    var cancel = document.createElement("button");
    cancel.textContent = "Cancel";
    loginDiv.appendChild(cancel);

    var login = document.createElement("button");
    login.textContent = "Login";
    loginDiv.appendChild(login);

    var self = this;

    cancel.addEventListener("click", function(){
      self.events.emit('did-cancel');
    });
    serverInput.addEventListener('change', function() {
      var entry = servers.get(this.value);
      if(typeof(entry) !== "undefined"){
        _fill.call(self, entry);
      }
    });

    login.addEventListener("click", function(){
      var username = userNameInput.value;
      var password = passwordInput.value;
      var server = serverInput.value;

      var config = {
        userName: username,
        password: password,
        server: server,
        // If you're on Windows Azure, you will need this:
        options: {
          encrypt: true,
          database:"master"
        }
      };
      self.events.emit('did-login',config);
    });

    var el = document.createElement('div');
    el.appendChild(loginDiv);
    this.element.appendChild(el);
  }

  extend(LoginView,HTMLElement);

  LoginView.prototype.postAdd = function(){
    _createServerInput(this._serverInput);
  };

  LoginView.prototype.serialize = function() {};

  LoginView.prototype.destroy = function() {
    return this.element.remove();
  };

  LoginView.prototype.getElement = function() {
    return this.element;
  };

  return LoginView;

})();
