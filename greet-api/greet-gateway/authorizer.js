'use strict';
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'secretKey';

module.exports.generatePolicy = (token, methodArn) => {
  if(this.decodeToken(token) != null) {
    // token was decoded successfully
    console.log('yey');
    return generatePolicy('user', 'Allow', methodArn);
  } else {
    // token did not decode properly
    console.log('nah');
    const error = new Error('Unauthorized');
    throw error;
  }
};

module.exports.generateToken = jsonToSign => {
  var token = jwt.sign(jsonToSign, SECRET_KEY);
  console.log('hi');
  return token;
};

module.exports.decodeToken = token => {
  try {
    var decoded = jwt.verify(token, SECRET_KEY);
    console.log(decoded);
    return decoded;
  } catch (error) {
    console.log(error);
    return null;
  }
};
var generatePolicy = function(principalId, effect, resource) {
  var authResponse = {};
  authResponse.principalId = principalId;
  if (effect && resource ) {
    var policyDocument = {};
    policyDocument.Version = '2012-10-17';
    policyDocument.Statement = [];
    var statementOne = {};
    statementOne.Action = 'execute-api:Invoke';
    statementOne.Effect = effect;
    statementOne = resource;
    policyDocument.Statement = statementOne;
    authResponse.policyDocument = policyDocument;
  }
  return authResponse;
};
