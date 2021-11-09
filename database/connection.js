const AWS = require("aws-sdk");

const dbSettings = {
  region: "us-east-1",
  endpoint: "http://dynamodb.us-east-1.amazonaws.com",
  accessKeyId: "AKIARRA3QLZ7NHA7PAUI",
  secretAccessKey: "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"
};

const getConnection = async () => {
  try {
    AWS.config.update(dbSettings);
    const dynamodb = await new AWS.DynamoDB.DocumentClient();
    return dynamodb;
  } catch (error) {
    console.error(error);
  }
};

module.exports = getConnection;