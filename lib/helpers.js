//Helpers for various tasks

//Dependencies
let crypto = require('crypto');
let config = require('./config');
//Container for all helpers

let helpers = {}

//Create a SHA256 hash
helpers.hash = (str) => {
  if (typeof(str)=='string' && str.length>0){
    let hash = crypto.createHmac('SHA256',config.hashingSecret).update(str).digest('hex');
    return hash;
  }
  else{
    return hash;
  }
};

//Parse a JSON string to an object in all cases, without throwing
helpers.parseJsonToObject =  function(){
  try{
    let obj = JSON.parse(str);
    return obj;
  }catch(err){
    return {};
  }
};

helpers.kk = ()=>{console.log('whoa')};

//Export the module
module.export = helpers;
