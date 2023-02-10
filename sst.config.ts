import { RemovalPolicy } from "aws-cdk-lib";
import { SSTConfig } from "sst";
import { ExampleStack } from "./stacks/ExampleStack";

export default {
  config(_input) {
    return {
      name: "websocket",
      region: "us-east-1",
    };
  },
  stacks(app) {
    if (app.stage !== "production") {
      app.setDefaultRemovalPolicy(RemovalPolicy.DESTROY);
    }
    app.stack(ExampleStack);
  },
} satisfies SSTConfig;
