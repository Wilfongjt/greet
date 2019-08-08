'use strict';
const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});
const authorizer = require('./authorizer');
const users = require('./users');
const JWT_EXPIRATION_TIME = '5m';

const cors_headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Accept-Langauge",
    "Access-Control-Allow-Methods": "OPTIONS,GET"
};
// REGISTER
/*
module.exports.register = async (event, context) => {
}
*/
// SIGNIN
module.exports.signin = async (event, context) => {
  // get un and pw
  const { username, password } = JSON.parse(event.body);
  try {
    const user = users.signin(username, password);
    const token = authorizer.generateToken({user});
    const response = {
      statusCode: 200,
      headers: cors_headers,
      body: JSON.stringify({
        token
      })
    };
    return response;
  } catch(e) {
    console.log('Error logging in: ${e.message}');
    const response = { // Error response
     statusCode: 401,
     headers: {
       'Access-Control-Allow-Origin': '*', // cors header
     },
     body: JSON.stringify({
       error: e.message,
     }),
    };
    return response;
  }
};
// AUTHORIZE
module.exports.authorize = async (event, context) => {
  const token = event.authorizationToken;
  try {
    // verify JWT
    const decoded = authorizer.decodeToken(token);
    // Check  user has privileges
    const user = decoded.user;
    // Check privileges to resource
    const isAllowed = authorizer.authorizeMe(user.scopes, event.methodArn);
    // return IAM poloicy
    const effect = isAllowed ? 'Allow' : 'Deny';
    const userId = user.username;
    const authorizerContext = { user: JSON.stringify(user) };
    const policy = authorizer.generatePolicy(userId, effect, event.methodArn, authorizerContext);

    return policy;
  } catch (error) {
    console.log('Unauthorized');
    return error.message;

  }
};
// HELLO
module.exports.hello = async (event) => {
  let message = "hello";
  // const name = event.queryStringParameters && event.queryStringParameters.name;
  const body = JSON.parse(event.body);

  if (body.name !== null) {
    message = "hello " + body.name;
  }
  if (process.env.STAGE_NAME !== 'pr') {
    message += " " + process.env.STAGE_NAME;
  }

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // cors header
    },
    body: JSON.stringify({
      message: message,
      input: event,
    }, null, 2),
  };
};
// GOODBYE
module.exports.goodbye = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Goodbye function executed successfully!',
      input: event,
    }, null, 2),
  };
};
// INDEX
module.exports.index = async (event) => {
  // return list of words with link to documents
  // need to remove duplicate words
  let keywords = event.queryStringParameters && event.queryStringParameters.keywords;
  let vals = []; // list of keywords
  // let param = {};
  let param_list = [];
  let data = [];
  let headers = cors_headers;
  // keyword not sent
  if (keywords === undefined
    || keywords === null
  ) {
    return {
      statusCode: 403, // forbidden
      headers: headers,
      body: JSON.stringify({})
    };
  }
  // keyword is empty
  if (keywords.length === 0) {
    return {
      statusCode: 400, // bad format
      headers: headers,
      body: JSON.stringify({})
    };
  }
  // handle multiple keywords
  vals = keywords.split(" ");
  if(vals.length === 0){
    return {
      statusCode: 400,
      headers: headers,
      body: JSON.stringify({ param_list, data }) };
  }
  let i = 0;
  /*
   prepare a search for each word
  */
  for(i = 0; i < vals.length; i++){
    let skv = "%w.1".replace("%w",vals[i]);
    // let gsi_1 = "gsi_1_"
    param_list.push({
      TableName: process.env.TABLE_NAME,
      IndexName: process.env.GSI_1,
      KeyConditionExpression: "sk = :sk1",
      ExpressionAttributeValues: {
       ":sk1": skv
      }
    });
  }
  /*
  run all the searches
  */
  const plst = [];
  try {
    for(i=0; i < param_list.length; i++){
      plst.push(docClient.query(param_list[i]).promise());
    }
  } catch(error){
    return {statusCode: 400, body: error};
  }
  // wait for the searches to complete
  try {
    const results = await Promise.all(plst);
    return {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify({results}),
      isBase64Encoded: false
    };
  } catch(error){
    return {statusCode: 400, body: error};
  }
};
