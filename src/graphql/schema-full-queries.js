import { makeExecutableSchema } from '@graphql-tools/schema';

const articles = [
    { id:"1", name: 'The History of Node.js', topic: 'Node.js', date: '2020-08-25T00:00:00Z', contributorId:"1"},
    { id:"2", name: 'Understanding Docker Concepts', topic: 'Containers', date: '2020-07-23T00:00:00Z', contributorId:"2"},
    { id:"3", name: 'Linting in Node.js using ESLint', topic: 'Node.js', date: '2020-08-24T00:00:00Z', contributorId:"2"},
    { id:"4", name: 'REST APIs - Introductory guide', topic: 'API', date: '2020-06-26T00:00:00Z', contributorId:"1"},
];

const contributors = [
    { id:"1", name: 'John Doe', url: '/john-doe', major: 'Computer Science'},
    { id:"2", name: 'Jane Doe', url: '/jane-doe', major: 'Physics'},
];

function delay(msTime, result) {
    return new Promise(resolve => {
        setTimeout(() => resolve(result), msTime);
    });
}

const articlesWithContributor = articles.map(article => {
    return {
        ...article,
        contributor: contributors.find(c => c.id = article.contributorId)
    };
});

export const typeDefs = `
    type Query {
        article(id: ID!): Article
        articlesByTopic(topic: String!): [Article]
        articlesByContributor(contributorId: ID!): [Article]
        contributor(id: ID!): Contributor
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

async function getArticleById(_, args) {
    const result = articlesWithContributor.find(item => item.id === args.id);
    return await delay(3000, result);
}

async function getArticlesByTopic(_, args) {
    const result = articlesWithContributor.filter(item => item.topic === args.topic);
    return await delay(3000, result);
}

async function getArticlesByContributor(_, args) {
    const result = articlesWithContributor.filter(item => item.contributorId === args.contributorId);
    console.log(result);
    return await delay(3000, result);
}

async function getContributor(_, args){
    const result = contributors.find(item => item.id === args.id);
    return await delay(3000, result);
}

// Learn more about resolvers:
//     https://graphql.org/learn/execution/
//
// A resolver function receives four arguments:
//   * obj: The current object (from the datasource), which needs to be resolved. Usually
//     never used in top-level queries (entry points)
//   * args: The arguments provided to the field in the GraphQL query.
//   * context: A value which is provided to every resolver and holds important 
//     contextual information like the currently logged in user, or access to a database.
//   * info: A value which holds field-specific information relevant to the current 
//     query as well as the schema details, also refer to type GraphQLResolveInfo for more details.
const resolvers = {
    Query: {
        article: getArticleById,
        articlesByTopic: getArticlesByTopic,
        articlesByContributor: getArticlesByContributor,
        contributor: getContributor
    },

    // (not needed because we're using articlesWithContributor)
    // Article: {
    //     contributor(article) {
    //         return contributors.find(contributor => contributor.id === article.contributorId);
    //     }
    // },

    Contributor: {
        articles(contributor) {
            console.log(contributor)
            return articles.filter(article => article.contributorId === contributor.id);
        }
    }
}

export default makeExecutableSchema({
    typeDefs,
    resolvers
});
