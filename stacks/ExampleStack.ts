import { StackContext, Table, WebSocketApi } from "sst/constructs";

export function ExampleStack({ stack }: StackContext) {
  // Do the following code *before* instantiating
  // *any* API gateway (both regular and websocket)
  // const role = new iam.Role(stack, "cloudwatch-logs-role", {
  //   assumedBy: new iam.ServicePrincipal("apigateway.amazonaws.com"),

  //   managedPolicies: [
  //     iam.ManagedPolicy.fromAwsManagedPolicyName(
  //       "service-role/AmazonAPIGatewayPushToCloudWatchLogs"
  //     ),
  //   ],
  // });

  // new apig.CfnAccount(stack, "cfn-account", {
  //   cloudWatchRoleArn: role.roleArn,
  // });
  //

  // Create the table
  const table = new Table(stack, "Connections", {
    fields: {
      id: "string",
    },
    primaryIndex: { partitionKey: "id" },
  });

  // Create the WebSocket API
  const api = new WebSocketApi(stack, "Api", {
    defaults: {
      function: {
        bind: [table],
      },
    },
    accessLog: false, // is this required?
    routes: {
      $connect: "packages/functions/src/connect.main",
      $disconnect: "packages/functions/src/disconnect.main",
      sendmessage: "packages/functions/src/sendMessage.main",
    },
  });

  // Show the API endpoint in the output
  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
