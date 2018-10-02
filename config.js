/*
Create and export configuration variables
*/

//Container for all the environments
let environments = {};

//Staging (default) environment
environments.staging = {
  'port': 3000,
  'envName': 'staging',
};

//Production environment
environments.production = {
  'port': 5000,
  'envName': 'production',
};
let currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';
let environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

//Export the module
console.log(environmentToExport);
module.export = environmentToExport;
