# GraphQL Proof of Concept

This is a proof of concept GraphQL api server using node.js.  This project demonstrates the following:
* Full CRUD operations
* Using DataLoaders to join two tables.
* How auth middleware would be incorporated
* Basic project organization into repository layer and schema layer.
There is very little business logic.

This example uses the following NPM libraries:
* graphql: the reference implementation of GraphQL
* dataloader: to address the so-called "N+1" problem
* express-graphql: creates GraphQL middleware for express
* graphql-tools: a power tool that helps  you to build up schemas and resolvers.

There are a bunch of older versions of the schema that represent various stages
of learning:
* schema-maual.js: how to manually create a GraphQL schema.  Don't do it this way.  There are much simpler ways to build a schema.
* schema-basic: demonstrates the same schema built using graphql-tools.
* schema-full-queries.js: demonstrates how you would solve the N+1 problem without using the DataLoader library. (not recommended)

# Run this project
Standard stuff:
```
npm install
npm start
```

After that, go to http://localhost:5000/graphql and start using GraphQL!

# Queries
Look in schema.js to see info about the schema.

This project has two in-memory tables:
* articles
* contributors

There is a 1:many relationship from contributors to articles.

Get article by ID (there are 4 articles, id 1-4)
```
{
  article(id: 3) {
    id
    name
    topic
    date
    contributor {
      name
      major
    }
}
```

Get all articles by topic (not case-sensitive)
```
{
  articlesByTopic(topic: "node.js") {
    id
    name
    topic
    date
    contributor {
      name
      major
    }
	}
}
```

Get all articles by contributor
```
{
  articlesByContributor(contributorId: 1) {
    id
    name
    topic
    date
    contributor {
      name
      major
    }
	}
}
```

Get contributor by id
```
{
  contributor(id: 2) {
    id
    name
    url
    major
    articles {
      name
      topic
      date
    }
  }
}
```

# Mutations
Create article
```
mutation 
{
  createArticle(
    name: "What I want for Christmas"
    topic: "general"
    contributorId: 1
) {
    id
    name
    topic
    date
    contributor {
      name
      major
    }
  }
}
```

Update article
```
mutation 
{
  updateArticle(
    id: 1, 
    name: "foobar"
) {
    id
    name
    topic
    date
    contributor {
      name
      major
    }
  }
}
```

Delete article
```
mutation
{
  deleteArticle(id: 100)
}
```