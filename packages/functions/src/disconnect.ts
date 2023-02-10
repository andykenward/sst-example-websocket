import { DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "@websocket/core";
import { APIGatewayProxyHandler } from "aws-lambda";
import { Table } from "sst/node/table";

const TableName = Table.Connections.tableName;

export const main: APIGatewayProxyHandler = async (event) => {
  const command = new DeleteCommand({
    TableName,
    Key: {
      id: event.requestContext.connectionId,
    },
  });

  await ddbDocClient.send(command);

  return { statusCode: 200, body: "Disconnected" };
};
