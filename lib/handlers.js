/*
*Request handlers
*/

//Dependencies
let _data = require('./data');
let helpers = require('./helpers');

// Define all the handlers
let handlers = {};

//users
handlers.users = (data,callback) => {
  let acceptableMethods = ['post','get','put','delete'];
  if (acceptableMethods.indexOf(data.method)>-1){
    handlers._users[data.method](data,callback);
  }
  else{
    callback(405);
  }
};

//Container for the users
handlers._users = {};

//Users - post
//Required data: firstname, lastname, phone, password, tosAgreement
//Optional data: none
handlers._post = (data,callback)=>{
  //Check that all required fields are filled out
  let firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
  let lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
  let phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
  let password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.phone.trim() : false;
  let tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false;

  if (firstName && lastName && phone && tosAgreement){
    //Make sure user does not already exist
    _data.read('users', phone, (data,err)=>{
      if (err){
        //hash the password
        let hashedPassword = helpers.hash(password);
        if(hashedPassword){
          //Create user object
          let userObject = {
            'firstName': firstName,
            'lastName' : lastName,
            'phone' : phone,
            'hashedPassword' : hashedPassword,
            'tosAgreement' : true,
          };

          //Store the user
          _data.create('users',phone,userObject,(err)=>{
            if (!err){
              callback(200);
            }
            else{
              console.log(err);
              callback(500,{'Error': 'Could not add a new user'});
            }
          });
        }
        else{
          callback(500,{'Error':'Could not hash the user\'s password'});
        }
      }

      else{
        callback(400,{'Error' : 'A user with tha phone number already exists'});
      }
    });

  }
  else{
    callback(400, {'Error' : 'Missing required fields'});
  }
};

//Users - get
handlers._get = (data,callback) =>{

}
//Users - post
handlers._post = (data,callback)=>{

}
//Users - delete
handlers._delete = (data,callback)=>{

}

// Sample handler
handlers.sample = (data,callback)=>{
    callback(406,{'name':'sample handler'});
};

// Not found handler
handlers.notFound = (data,callback)=>{
  callback(404);
};


// Define the request router
let router = {
  'sample' : handlers.sample
};

//Export thd handlers
module.export = handlers;
