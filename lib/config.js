/*
Create and export configuration variables
*/

//Container for all the environments
let environments = {};

//Staging (default) environment
environments.staging = {
  'httpPort': 3000,
  'httpsPort': 3001,
  'envName': 'staging',
  'hashingSecret' : 'thisisASecret',
};

//Production environment
environments.production = {
  'httpPort': 5000,
  'httpsPort': 5001,
  'envName': 'production',
  'hashingSecret' : 'thisIsAlsoASecret',
};
let currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';
let environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] :
environments.staging;

//Export the module
module.exports = environmentToExport;
