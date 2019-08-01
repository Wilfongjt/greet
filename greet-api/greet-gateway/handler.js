'use strict';
const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});
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
module.exports.index = async (event) => {
  // return list of words with link to documents
  // need to remove duplicate words
  let keywords = event.queryStringParameters && event.queryStringParameters.keywords;
  let vals = []; // list of keywords
  // let param = {};
  let param_list = [];
  let data = [];

  let headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type,Accept-Langauge",
      "Access-Control-Allow-Methods": "OPTIONS,GET"
  };
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

  // wait for the searches to end
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
