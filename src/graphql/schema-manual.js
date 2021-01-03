import graphql, { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList, GraphQLSchema } from 'graphql';

const articles = [
    { name: 'The History of Node.js', topic: 'Node.js', date: '2020-08-25T00:00:00Z', id:"1", contributorId:"1"},
    { name: 'Understanding Docker Concepts', topic: 'Containers', date: '2020-07-23T00:00:00Z', id:"2", contributorId:"2"},
    { name: 'Linting in Node.js using ESLint', topic: 'Node.js', date: '2020-08-24T00:00:00Z', id:"3", contributorId:"2"},
    { name: 'REST APIs - Introductory guide', topic: 'API', date: '2020-06-26T00:00:00Z', id:"4", contributorId:"1"},
];

const contributors = [
    { name: 'John Doe', url: '/john-doe', major: 'Computer Science', id:"1"},
    { name: 'Jane Doe', url: '/jane-doe', major: 'Physics', id:"2"},
];

const ArticleType = new GraphQLObjectType({
    name: 'Article',
    fields () {
        return {
            id: { type: GraphQLID },
            name: { type: GraphQLString },
            topic: { type: GraphQLString },
            date: { type: GraphQLString },
            contributorId: { type: GraphQLID },
            contributor: {
                type: ContributorType,
                resolve (parent, args) {
                    // This does an inner join for 1:many
                    var matches = contributors.filter(item => item.id === parent.contributorId);
                    return matches.length && matches[0];
                }
            }
        }
    }
});

const ContributorType = new GraphQLObjectType({
    name: 'Contributor',
    fields () {
        return {
            id: { type: GraphQLID },
            name: { type: GraphQLString },
            url: { type: GraphQLString },
            major: { type: GraphQLString },
            articles: {
                type: new GraphQLList(ArticleType),
                resolve (parent, args) {
                    // This does an inner join for many:1
                    return articles.filter(item => item.contributorId === parent.id);
                }
            }
        }
    }
});

const RootQuery = new GraphQLObjectType({
    name: 'RootqueryType',
    fields: {
        article: {
            type: ArticleType,
            args: {id:{type: GraphQLID}},
            resolve(parent, args){
                const matches = articles.filter(item => item.id === args.id);
                return matches.length && matches[0];
            }
        },
        articles: {
            type: new GraphQLList(ArticleType),
            args: {
                topic: {
                    type: GraphQLString
                }
            },
            resolve (parent, args) {
                return articles.filter(item => item.topic === args.topic);
            }
        },
        contributor: {
            type: ContributorType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args){
                const matches = contributors.filter(item => item.id === args.id);
                return matches.length && matches[0];
            }
        }
    }
});


export default new GraphQLSchema({
    query: RootQuery
});
