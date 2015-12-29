var WordcountView;
var extend = require('./view-helpers').extend;
var Emitter = require('event-kit').Emitter;

module.exports = LoginView = (function() {
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


    var userName = document.createElement('div');
    var userNameLabel = document.createElement("label");
    userNameLabel.textContent = "Username:"
    userName.appendChild(userNameLabel);
    var userNameInput = document.createElement("input");
    userNameInput.setAttribute('tabIndex', "2");
    userName.appendChild(userNameInput);
    userNameInput.classList.add('native-key-bindings');
    this.element.appendChild(userName);

    var password = document.createElement('div');
    var passwordLabel = document.createElement("label");
    passwordLabel.textContent = "Password:"
    password.appendChild(passwordLabel);

    var passwordInput = document.createElement("input");
    passwordInput.type = "Password";
    passwordInput.setAttribute('tabIndex', "3");
    passwordInput.classList.add('native-key-bindings');
    password.appendChild(passwordInput);

    this.element.appendChild(password);

    var loginDiv = document.createElement("div");
    var login = document.createElement("button");
    login.textContent = "Login";
    loginDiv.appendChild(login);

    var self = this;
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

  LoginView.prototype.serialize = function() {};

  LoginView.prototype.destroy = function() {
    return this.element.remove();
  };

  LoginView.prototype.getElement = function() {
    return this.element;
  };

  return LoginView;

})();
