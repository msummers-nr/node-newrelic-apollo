// See: https://github.com/newrelic/newrelic-lambda-extension/tree/main/examples/sam/node
'use strict';
// DIRE WARNING: DO NOT INCLUDE newrelic in package.json
const newrelic = require('newrelic');
const graphql = require('./graphql')

// In a Node.js Lambda the runtime loads the handler code as a module, everything in the top level
// of the module is run only once during cold-start.
console.log("Lambda Handler starting up");

// Entry point defined in  ../template.yaml: NEW_RELIC_LAMBDA_HANDLER
// This code runs for each invocation.
exports.lambdaHandler = async (event, context) => {
    // Create a custom event, `SELECT * FROM ApolloServerEvent` in New Relic One will find it
    newrelic.recordCustomEvent("ApolloServerEvent", {
        "lambdaHandler": "newrelic.lambdaHandler"
    });

    // Add custom attributes the out-of-the-box AwsLambdaInvocation event
    newrelic.addCustomAttributes({
        "lambdaHandler": "newrelic.lambdaHandler"
    });

    // Anything written to stdout ends up in CloudWatch
    console.log("Hello, world");

    return (await graphql.graphqlHandler(event, context))
};
