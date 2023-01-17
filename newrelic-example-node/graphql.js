// See: https://www.apollographql.com/docs/apollo-server/v3/deployment/lambda

const { ApolloServer, gql } = require('apollo-server-lambda');
// DIRE WARNING: DO NOT INCLUDE newrelic in package.json
const newrelic = require('newrelic');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
    type Query {
        hello: String
    }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    // See: https://www.apollographql.com/docs/apollo-server/v3/data/resolvers#resolver-arguments
    hello: (parent, args, context, info) => {
      console.log('In Query: hello')

      // Create a custom New Relic Event
      newrelic.recordCustomEvent("ApolloServerEvent", {
        "apolloResolver": "hello",
        "apolloHandler": "apollo.resolver.hello",
        "apolloPath": info.path.key,
      });

      // Add custom attributes to the out-of-the-box AwsLambdaInvocation event
      newrelic.addCustomAttributes({
        "apolloResolver": "hello",
        "apolloHandler": "apollo.resolver.hello",
        "apolloPath": info.path.key,
      });

      return 'Hello world!'
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: true,
  cache: 'bounded',
});

exports.graphqlHandler = server.createHandler();
