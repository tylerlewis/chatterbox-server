/* You should implement your request handler function in this file.
 * And hey! This is already getting passed to http.createServer()
 * in basic-server.js. But it won't work as is.
 * You'll have to figure out a way to export this function from
 * this file and include it in basic-server.js so that it actually works.
 * *Hint* Check out the node module documentation at http://nodejs.org/api/modules.html. */
var url = require('url');
var messages = require('./database');
requestHandeler = {};

requestHandeler.handleRequest = function(request, response) {
  /* the 'request' argument comes from nodes http module. It includes info about the
  request - such as what URL the browser is requesting. */

  /* Documentation for both request and response can be found at
   * http://nodemanual.org/0.8.14/nodejs_ref_guide/http.html */

  console.log("Serving request type " + request.method + " for url " + request.url);

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
  var respond = function(){
    var messagesFromServer = messages.get()
    if(messagesFromServer){
      var messageObject = {results: messagesFromServer};
      var results = JSON.stringify(messageObject);
      console.log(results);
      response.write(results);
    } else{
      response.write('{results: []}');
    }
    response.writeHead(201, {'Content-Type': 'application/json'});
    response.end();
  };

  var onEnd = function(){
    console.log("onEnd");
    messages.set(messageIn, respond());
  };

  var messageIn= '';

  var onData = function(data){
    messageIn += data;
    console.log(messageIn);
  };

  //is this a GET or POST request?
  if(request.url === '/classes/messages'){
    if (request.method === 'POST') {
      request.on('data', function(){
        console.log("POST data in");
      });
      request.on('end', onEnd());
    } else {
      response.writeHead(200, {'Content-Type': 'application/json'});
      response.write(JSON.stringify({results: messages.get()}));
      response.end();
    }
  }
  if(request.url === '/classes/room'){
    response.writeHead(200, {'Content-Type': 'application/json'});
    response.end();
  }
  /* .writeHead() tells our server what HTTP status code to send back */
  response.writeHead(404, headers);
  /* Make sure to always call response.end() - Node will not send
   * anything back to the client until you do. The string you pass to
   * response.end() will be the body of the response - i.e. what shows
   * up in the browser.*/
  response.end("Hello, World!");
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
