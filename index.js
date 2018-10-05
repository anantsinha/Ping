/*
*Primary file for the api
*
*/

//Dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const config = require('./config');
const StringDecoder = require('string_decoder').StringDecoder;
const fs = require('fs');

// Instantiating the http server
let httpServer = http.createServer(function (req,res){
  unifiedServer(req,res);
});

// Instantiating the https server options
let httpsServerOptions = {
  'key': fs.readFileSync('./https/key.pem'),
  'cert': fs.readFileSync('./https/cert.pem'),
};
// Instantiating the https server
let httpsServer = https.createServer(httpsServerOptions, function (req,res){
  unifiedServer(req,res);
});

//Start the http server
httpServer.listen(config.httpPort, function (){
  console.log('The server is listening on port '+config.httpPort);

});


//Start the https server
httpsServer.listen(config.httpsPort, function (){
  console.log('The server is listening on port '+config.httpsPort);
});

// All logic for http and https
let unifiedServer = function (req,res){
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

}
// Define handlers
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
