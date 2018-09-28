/*
*Primary file for the api
*
*/

//Dependencies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
// The server should respond to all requests with a string
let server = http.createServer(function (req,res){
  //Get the url and parse it
  let parsedUrl = url.parse(req.url, true);
  //Get the path
  let path = parsedUrl.pathname;
  let trimmedPath = path.replace(/^\/+|\/+$/g,'');
  //Get the HTTP method
  let method = req.method.toLowerCase();
  //Get the headers
  let headers = req.headers;
  let i = 0;
  //Get the payload as an object
  let decoder = new StringDecoder('utf-8');
  let buffer = '';
  req.on('data',data => {
    i++;
    buffer+=decoder.write(data);
  });

  req.on('end',()=>{
    buffer+=decoder.end();
    //Chose the handler this request should go to, if one is not found go to 404
    let chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;
    //Construct the data object to send to the handler
    let queryStringObject = parsedUrl.query;
    let data = {
      'trimmedPath': trimmedPath,
      'queryStringObject': queryStringObject,
      'headers': headers,
      'payload': buffer,
    };
    //Route the request to the hanlder specified in the router
    chosenHandler(data,(statusCode, payload) => {
      //use the status code called back by the handler or default to 200
      //Use the payload called back by the handler or defailt to an empty object
      statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
      payload = typeof(payload) == 'object' ? payload : {};
      // Convert payload to string
      let payloadString = JSON.stringify(payload);
      res.setHeader('content-type','application/json');      
      res.writeHead(statusCode);
      res.end(payloadString);
      //Log the requset path
      console.log('Returning this response: ',statusCode, payloadString);
    });
  })

});

//Define handlers
let handlers = {}

//Sample handler
handlers.sample = function (data,callback){
  //Callback a http status code and a Payload object
  callback(406, {'name': 'sample-handler'});
};
//Not found handler
handlers.notFound = function(data,callback){
  callback(404);
};
// Define a request router
let router = {
  'sample': handlers.sample
};

//Start the server, and have it listen on port 3000
server.listen(3000, function (){
  console.log('The server is listening on port 3000');
});
