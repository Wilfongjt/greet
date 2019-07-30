'use strict';
const AWS = require('aws-sdk');
module.exports.hello = async (event) => {
  let message = "hello";
  const name = event.queryStringParameters && event.queryStringParameters.name;
  if (name !== null) {
    message = "hello " + name;
  }
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: message,
      input: event,
    }, null, 2),
  };
  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
module.exports.goodbye = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Goodbye function executed successfully!',
      input: event,
    }, null, 2),
  };
  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
