import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "@websocket/core";
import { APIGatewayProxyHandler } from "aws-lambda";
import { Table } from "sst/node/table";

export const main: APIGatewayProxyHandler = async (event) => {
  const command = new PutCommand({
    TableName: Table.Connections.tableName,
    Item: {
      id: event.requestContext.connectionId,
    },
  });

  await ddbDocClient.send(command);

  return { statusCode: 200, body: "Connected" };
};
