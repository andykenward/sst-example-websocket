import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from "@aws-sdk/client-apigatewaymanagementapi";
import { DeleteCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "@websocket/core";
import { APIGatewayProxyHandler, type AttributeValue } from "aws-lambda";
import { Table } from "sst/node/table";

const TableName = Table.Connections.tableName;

export const main: APIGatewayProxyHandler = async (event) => {
  const messageData = event.body ? JSON.parse(event.body).data : undefined;
  const { stage, domainName } = event.requestContext;

  // Get all the connections
  const connections = await ddbDocClient.send(
    new ScanCommand({ TableName, ProjectionExpression: "id" })
  );

  // can this be ApiGatewayV2Client ?
  const apiG = new ApiGatewayManagementApiClient({
    endpoint: `https://${domainName}/${stage}`,
  });

  const postToConnection = async function (
    item: Record<string, AttributeValue>
  ) {
    const id: string | undefined = item.id.S;
    try {
      // Send the message to the given client
      const command = new PostToConnectionCommand({
        ConnectionId: id,
        Data: messageData,
      });
      await apiG.send(command);
    } catch (e: any) {
      if (e.statusCode === 410) {
        // Remove stale connections
        await ddbDocClient.send(
          new DeleteCommand({ TableName, Key: { id: id } })
        );
      }
    }
  };

  // Iterate through all the connections
  if (connections.Items)
    await Promise.allSettled(
      connections.Items.map((item) => postToConnection(item))
    );

  return { statusCode: 200, body: "Message sent" };
};
