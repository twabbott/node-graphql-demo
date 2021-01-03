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

const globalDelay = 1000;

function delay(result) {
    console.log(`lagging ${globalDelay}ms...`);
    return new Promise(resolve => {
        setTimeout(() => resolve(result), globalDelay);
    });
}

//////////////////////////////////////////////////
// Article
export async function getArticleById(user, id) {
    return await delay(articles.find(item => item.id === id));
}

export async function getArticlesByTopic(user, topic) {
    const lowerTopic = topic.toLowerCase();
    return await delay(articles.filter(item => item.topic.toLocaleLowerCase() === lowerTopic));
}

export async function getArticlesByContributor(user, contributorId) {
    const list = articles.filter(item => item.contributorId === contributorId);
    return await delay(list);
}

export async function getArticlesByContributorList(user, ids) {
    const list = articles.filter(article => ids.findIndex(id => id === article.contributorId) >= 0);
    return await delay([list]);
}

export async function createArticle(user, name, topic, contributorId) {
    const newArticle = {
        id: articles.length + 1,
        name,
        topic,
        date: Date.now().toString(),
        contributorId
    };

    articles.push(newArticle);

    return await delay(newArticle);
}

export async function updateArticle(user, id, name, topic, contributorId) {
    const article = await getArticleById(user, id);


    article.name = name ? name: article.name;
    article.topic = topic ? topic: article.topic;
    article.contributorId = contributorId ? contributorId: article.contributorId;

    return article;
}

export async function deleteArticle(user, id) {
    const index = articles.findIndex(item => item.id === id);
    if (index >= 0) {
        articles.splice(index, 1);
    }
    
    return delay(index >= 0);
}

//////////////////////////////////////////////////
// Contributor
export async function getContributor(user, id){
    return await delay(contributors.find(item => item.id === id));
}

export async function getContributorList(user, ids) {
    return await delay(contributors.filter(contributor => ids.findIndex(id => id === contributor.id ) >= 0));
}
