import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

/** Bare-bones DynamoDB Client */
export const ddbClient = new DynamoDBClient({});
