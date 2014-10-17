/* You should implement your request handler function in this file.
 * And hey! This is already getting passed to http.createServer()
 * in basic-server.js. But it won't work as is.
 * You'll have to figure out a way to export this function from
 * this file and include it in basic-server.js so that it actually works.
 * *Hint* Check out the node module documentation at http://nodejs.org/api/modules.html. */
var url = require('url');
var fs = require('fs');
var messages = require('./database');
requestHandeler = {};

requestHandeler.handleRequest = function(request, response) {
  /* the 'request' argument comes from nodes http module. It includes info about the
  request - such as what URL the browser is requesting. */

  /* Documentation for both request and response can be found at
   * http://nodemanual.org/0.8.14/nodejs_ref_guide/http.html */

  var statusCode = 200;

  /* Without this line, this server wouldn't work. See the note
   * below about CORS. */
  var headers = requestHandeler.defaultCorsHeaders;

  headers['Content-Type'] = "text/plain";



  /*var message = {
    roomname: "lobby",
    username: "Brain",
    text: "I will rule the world!",
    createdAt: "Today"
  }

  var results = {
    results: [message]
  };
  var messageString =  JSON.stringify(results);*/

  var pathname = url.parse(request.url).pathname;

  var respond = function(){
    response.writeHead(201, {'Content-Type': 'application/json'});
    var messagesFromServer = messages.get();
    if(messagesFromServer){
      var messageObject = {};
      messageObject.results = messagesFromServer;
      var results = JSON.stringify(messageObject);
      response.end('{results: [' + results + ']}');

    } else{
      response.end('{results: []}');
    }
  };

  var onEnd = function(){
    messages.set(JSON.parse(messageIn), respond());
  };

  var messageIn= '';

  var onData = function(data){
    messageIn += data;
  };

  // var router {
  //   '/client':
  //   '/styles/styles.css':
  //   '/scripts/app.js':
  //   '/scripts/config.js':
  //   '/bower_components/jquery/jquery.min.js':
  //   '/bower_components/jquery/jquery.min.map':
  //   '/bower_components/underscore/underscore.js':
  //   '/classes/messages':
  //   '/classes/room1':
  // }

  //is this a GET or POST request?
  if(pathname === '/client'){
    response.writeHead(200, {'Content-Type': 'text/html'});
    fs.readFile('../client/client/index.html', function (err, html) {
      if (err) {
          throw err;
      }
      response.write(html);
      response.end();
    });
  }  else if(pathname === '/styles/styles.css') {
    response.writeHead(200, {'Content-Type': 'text/css'});
    fs.readFile('../client/client/styles/styles.css', function(err, css) {
      if(err) {
        throw err;
      }
      response.write(css);
      response.end();
    });
  } else if(pathname === '/scripts/app.js') {
    response.writeHead(200, {'Content-Type': 'application/json'});
    fs.readFile('../client/client/scripts/app.js', function(err, app) {
      if(err) {
        throw err;
      }
      response.write(app);
      response.end();
    });
  } else if(pathname === '/scripts/config.js') {
    response.writeHead(200, {'Content-Type': 'application/json'});
    fs.readFile('../client/client/scripts/config.js', function(err, config) {
      if(err) {
        throw err;
      }
      response.write(config);
      response.end();
    });
  } else if(pathname === '/bower_components/jquery/jquery.min.js') {
    response.writeHead(200, {'Content-Type': 'application/json'});
    fs.readFile('../client/client/bower_components/jquery/jquery.min.js', function(err, jquery) {
      if(err) {
        throw err;
      }
      response.write(jquery);
      response.end();
    });
  }else if(pathname === '/bower_components/jquery/jquery.min.map') {
    response.writeHead(200, {'Content-Type': 'application/json'});
    fs.readFile('../client/client/bower_components/jquery/jquery.min.map', function(err, jquery) {
      if(err) {
        throw err;
      }
      response.write(jquery);
      response.end();
    });
  } else if(pathname === '/bower_components/underscore/underscore.js') {
    response.writeHead(200, {'Content-Type': 'application/json'});
    fs.readFile('../client/client/bower_components/underscore/underscore.js', function(err, underscore) {
      if(err) {
        throw err;
      }
      response.write(underscore);
      response.end();
    });
  }
  else if(pathname === '/classes/messages' || pathname === '/send'){
    if (request.method === 'POST') {
      request.on('data', onData);
      request.on('end', onEnd);
      response.writeHead(201, {'Content-Type': 'application/json'});
      response.end(JSON.stringify({results: messages.get()}));
    } else {
      response.writeHead(200, {'Content-Type': 'application/json'});
      response.end(JSON.stringify({results: messages.get()}));
    }
  }
  else if(pathname === '/classes/room1'){
    if (request.method === 'POST') {
      request.on('data', onData);
      request.on('end', onEnd);
      response.writeHead(201, {'Content-Type': 'application/json'});
      response.end(JSON.stringify({results: messages.get()}));
    } else {
      response.writeHead(200, {'Content-Type': 'application/json'});
      response.end(JSON.stringify({results: messages.get()}));
    }
  } else{
    /* .writeHead() tells our server what HTTP status code to send back */
    response.writeHead(404, headers);
    /* Make sure to always call response.end() - Node will not send
     * anything back to the client until you do. The string you pass to
     * response.end() will be the body of the response - i.e. what shows
     * up in the browser.*/
    response.end("Hello, World!");
  }

};

/* These headers will allow Cross-Origin Resource Sharing (CORS).
 * This CRUCIAL code allows this server to talk to websites that
 * are on different domains. (Your chat client is running from a url
 * like file://your/chat/client/index.html, which is considered a
 * different domain.) */
requestHandeler.defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};


module.exports = requestHandeler;
