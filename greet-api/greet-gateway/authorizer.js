'use strict';
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'secretKey';
// const users = require('./users');
const JWT_EXPIRATION_TIME = '5m';

const authorizeUser =  (userScopes, methodArn) => {
  // check privileges
  // search user's privileges for one thjat matches the end of methodaArn
  const hasValidScope = _.some(userScopes, scope => _.endsWith(methodArn, scope));
  return hasValidScope;
};
module.exports.generateToken = jsonToSign => {
  var token = jwt.sign(jsonToSign, SECRET_KEY, { expiresIn: JWT_EXPIRATION_TIME });
  return token;
};

module.exports.decodeToken = token => {
  try {
    var decoded = jwt.verify(token, SECRET_KEY);
    // console.log(decoded);
    return decoded;
  } catch (error) {
    console.log(error);
    return null;
  }
};
module.exports.authorizeMe = (userScopes, methodArn) => {
  return authorizeUser(userScopes, methodArn);
};

// module.exports.generatePolicy = (token, methodArn) => {
/**
  * Returns an IAM policy document for a given user and resource.
  *
  * @method generatePolicy
  * @param {String} userId - user id
  * @param {String} effect  - Allow / Deny
  * @param {String} resource - resource ARN
  * @param {String} context - response context
  * @returns {Object} policyDocument
  */
module.exports.generatePolicy = (userId, effect, resource, authorizerContext) => {
  var policy = {};
  policy.principalId = userId;
  if (effect && resource ) {
    // policyDocument
    var policyDocument = {};
    policyDocument.Version = '2012-10-17';
    policyDocument.Statement = [];
    // Statement
    var statementOne = {
      Action: 'execute-api:Invoke',
      Effect: effect,
      Resource: resource
    };
    // assemble the policy
    policyDocument.Statement.push(statementOne);
    policy.policyDocument = policyDocument;
    policy.context = authorizerContext;
  }
  return policy;

};
/*
var generateIAMPolicy = function(userId, effect, resource, authorizerContext) {
  var policy = {};
  policy.principalId = userId;
  if (effect && resource ) {
    // policyDocument
    var policyDocument = {};
    policyDocument.Version = '2012-10-17';
    policyDocument.Statement = [];
    // Statement
    var statementOne = {
      Action: 'execute-api:Invoke',
      Effect: effect,
      Resource: resource
    };
    // assemble the policy
    policyDocument.Statement.push(statementOne);
    policy.policyDocument = policyDocument;
    policy.context = authorizerContext;
  }
  return policy;
};
*/
