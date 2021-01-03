import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import DataLoader from 'dataloader';

import schema from './graphql/schema.js';
import { 
    getContributorList,
    getArticlesByContributorList
} from './graphql/repository.js';

// Fake auth middleware.  This injects a user onto the req object
// which is standard practice.  The graphqlHTTP function then takes
// the req object, and that becomes the context.
function fakeValidateToken(req, res, next) {
    // Here we would look at req.headers["authorization"], pull out
    // the bearer token, decode/validate it.

    // TODO: res.send(401) error if not authenticated

    // Pretend the user is authenticated
    req.user = {
        userId: 1000,
        userLogin: "testuser",
        userName: "Test User"
    }

    next();
}

// This middleware makes DataLoaders, and adds them to the req
// object.  This way they have access to the user credentials.
function makeDataLoaders(req, res, next) {
    // For more info on the top of DataLoader usage, see the main page:
    //   * https://github.com/graphql/dataloader
    req.dataLoaders = {
        contributorListLoader: new DataLoader(keys => getContributorList(req.user, keys)),
        articlesByContributorLoader: new DataLoader(keys => getArticlesByContributorList(req.user, keys))
    }

    next();
}

const extensions = ({
    document,
    variables,
    operationName,
    result,
    context,
}) => {
    // This function allows you to tack extra data onto the result,
    // once the query has completed
    return {
        greeting: "Hello, world!"
    };
};

const app = express();
app.use(
    "/graphql",
    fakeValidateToken, // add token validation here
    // TODO: here is probably where you want to generate DataLoaders 
    // for the current user.  I guess, stick them on req.DataLoaders
    makeDataLoaders, // this would take the req.user object and make data loaders
    graphqlHTTP({
        schema,
        graphiql: true,
        extensions
    })
);

app.listen(5000, () => {
    console.log('Listening on port 5000');
});
