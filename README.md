# Instrumented Node.js Lambda with Apollo Server

This is a "Hello, World" style Lambda function in Node.js, instrumented with the New Relic Agent and integrated with Apollo Server v3.

This example is both instructive, and a diagnostic tool: if you can
deploy this Lambda function, and see its events in NR One, you'll
know that all the telemetry plumbing is connected correctly. 

## Caveats
- Uses Apollo Server v3 (deprecated) 
- Common JS modules only
- Assumes New Relic is installed via Layers

## Dire warnings
- DO NOT INCLUDE `newrelic` in `package.json`. If your application "works" however you are not seeing custom attributes or events this may be the cause.
- If you get a `"errorMessage": "Unable to import module 'app'",` the _most likely_ cause is a syntax error 

## Building and deploying

### Prerequisites
- [New Relic](https://docs.newrelic.com/docs/serverless-function-monitoring/aws-lambda-monitoring/enable-lambda-monitoring/enable-aws-lambda-monitoring/)
- [Apollo](https://www.apollographql.com/docs/apollo-server/v3/deployment/lambda)
  - You can ignore the `serverless` setup, however it is handy for finding syntax issues in `graphql.js`

### Deploy script

From a command prompt run

    ./deploy.sh <accountId> <region>
    
where `<accountId>` is your New Relic account ID, and  `<region>` is your AWS Region, like "us-west-2".

This will package and deploy the CloudFormation stack for this example function.

At this point you can invoke the function via the AWS Lambda console. As provided, the example
function doesn't pay attention to its invocation event. If everything
has gone well, each invocation gets reported to New Relic, and its
telemetry appears in NR One.

## Code Structure

### template.yaml
This function is deployed using a SAM template, which is a CloudFormation
template with some extra syntactic sugar for Lambda functions. In it, we
tell CloudFormation where to find lambda function code, what layers to use, and
what IAM policies to add to the Lambda function's execution role. We also set
environment variables that are available to the handler function. 

### app.js
Lambda functions written in JavaScript are Node.js modules. The runtime loads them
just like any Node module, and then invokes the handler function for each 
invocation event. New Relic publishes a Lambda Layer that wraps your handler
function, and initializes the New Relic agent, allowing us to collect telemetry.

There are a couple examples here of how you might add custom events and attributes
to the default telemetry.

Since JavaScript is a dynamic, interpreted language, the Agent can inject instrumentation
into the various client libraries you might be using in your function. This happens 
once, during cold start, and provides rich, detailed instrumentation out of the box, 
with minimal developer effort.

### graphql.js
Liberally borrowed from [Apollo Server Documentation](https://www.apollographql.com/docs/apollo-server/v3/deployment/lambda)

### query.json
Sample test input for the AWS Lambda console
