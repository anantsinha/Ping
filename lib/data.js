// Library for storign and editing data

//Dependencies

let fs = require('fs');
let path = require('path');


//Container for the module to be exported
let lib = {}

//Base directory of the data folder
lib.baseDir = path.join(__dirname,'/../.data/');
//Write data to a file
lib.create = (dir,file,data,callback) => {
  console.log('path: ',lib.baseDir);

  fs.open (lib.baseDir+dir+'/'+file+'.json', 'wx',(err,fileDescriptor) => {
    if (!err && fileDescriptor){
      //Convert data to string
      let stringData = JSON.stringify(data);

      //Write to file and close file
      fs.writeFile(fileDescriptor,stringData,(err)=>{
          if (!err){
            //close the file
            fs.close(fileDescriptor, (err)=>{
              if(!err){
                callback(false);
              }
              else{
                callback('Error closing the file');
              }
            });
          }
          else{
            callback('Error writing to new file');
          }
      });
    }
    else{
      callback('Could not create new file, it may already exist');
    }
  });
}

//Read data from a file
lib.read = (dir,filename, callback) => {
  fs.readFile(lib.baseDir+dir+'/'+filename+'.json','utf8', (err,data)=>{
    callback(err,data);
  });
}

//Update data inside a file
lib.update = (dir,file,data,callback) =>{
  fs.open(lib.baseDir+dir+'/'+file+'.json','r+',(err,fileDescriptor)=>{
    if(!err && fileDescriptor){
      let stringData = JSON.stringify(data);

      //Truncate the file
      fs.truncate(fileDescriptor, (err)=>{
        if (!err){
          //Write to the file and close it
          fs.writeFile(fileDescriptor,stringData,(err)=>{

            if (!err){
              fs.close(fileDescriptor,(err)=>{
                if (!err){
                  callback(false);
                }
                else{
                  console.log('Error closing the file');
                }
              })
            }
          })
        }
        else{
          callback('Error truncating file');
        }
      })
    }else{
      callback('Could not open the file for updating');
    }
  })
}

//Delete the file

lib.delete = (dir,file,callback) =>{
  //Unlink the file
  fs.unlink(lib.baseDir+'/'+dir+'/'+file+'.json', (err)=>{
    if (!err){
      callback(false);
    }
    else{
      callback('Error deleting the file');
    }
  });
}
//Export the module
module.exports = lib;
