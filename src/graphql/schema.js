import { makeExecutableSchema } from '@graphql-tools/schema';
import DataLoader from 'dataloader';

import { 
    getArticleById,
    getArticlesByTopic,
    getArticlesByContributor,
    createArticle,
    updateArticle,
    deleteArticle,
    getContributor,
} from './repository.js';

export const typeDefs = `
    type Query {
        article(id: ID!): Article
        articlesByTopic(topic: String!): [Article]
        articlesByContributor(contributorId: ID!): [Article]
        contributor(id: ID!): Contributor
    },

    type Mutation {
        createArticle(name: String!, topic: String!, contributorId: ID!): Article!
        updateArticle(id: ID!, name: String, topic: String, contributorId: ID): Article!
        deleteArticle(id: ID): Boolean
    },

    type Article {
        id: ID
        name: String
        topic: String
        date: String
        contributorId: ID
        contributor: Contributor
    },

    type Contributor {
        id: ID
        name: String
        url: String
        major: String
        articles: [Article]
    }
`;

/////////////////////////////////////////////////////////////
// Learn more about resolvers:
//     https://graphql.org/learn/execution/
//
// A resolver function receives four arguments:
//   * obj: The current object, which contains the data to be resolved.
//   * args: The arguments provided to the field in the GraphQL query.
//   * context: A value which is provided to every resolver and holds important 
//     contextual information like the currently logged in user, or access to a 
//     database. BY DEFAULT, this contains a reference to express's req object.
//   * info: A value which holds field-specific information relevant to the 
//     current query as well as the schema details, also refer to type 
//     GraphQLResolveInfo for more details.
const resolvers = {
    Query: {
        article: (_, { id }, { user }) => getArticleById(user, id),
        articlesByTopic: (_, { topic }, { user }) => getArticlesByTopic(user, topic),
        articlesByContributor: (_, { contributorId }, { user }) => getArticlesByContributor(user, contributorId),
        contributor: (_, { id }, { user }) => getContributor(user, id)
    },

    Mutation: {
        createArticle: (_, {name, topic, contributorId}, { user }) => createArticle(user, name, topic, contributorId),
        updateArticle: (_, {id, name, topic, contributorId}, { user }) => updateArticle(user, id, name, topic, contributorId),
        deleteArticle: (_, { id }, { user }) => deleteArticle(user, id)
    },

    Article: {
        async contributor(article, _, context) {
            return context.dataLoaders.contributorListLoader.load(article.contributorId);
        }
    },

    Contributor: {
        async articles(contributor, _, context) {
            return context.dataLoaders.articlesByContributorLoader.load(contributor.id);
        }
    }
}

export default makeExecutableSchema({
    typeDefs,
    resolvers
});
