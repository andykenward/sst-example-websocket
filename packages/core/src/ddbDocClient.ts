import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { ddbClient } from "./ddbClient";

/** Bare-bones document client */
export const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);
