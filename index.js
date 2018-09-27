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
      //Log the request path
      console.log('Payload: ',buffer+ ' came in ' + i + ' pieces');
    //Get the query string as an object
    let queryStringObject = parsedUrl.query;
    //Send the response
    res.end('Hello World\n');
  })
});

//Start the server, and have it listen on port 3000
server.listen(3000, function (){
  console.log('The server is listening on port 3000');
});
