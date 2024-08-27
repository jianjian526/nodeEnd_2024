var debug = require('debug')('backendapp:gqlController');
const { graphqlHTTP } = require('express-graphql');

// Duplicate function implementationを防止
export { }

function createGraphqlHTTP(type: String, input: { schema: any, rootValue: any }, dbManager: any) {
    if (type === 'GET' || type === 'POST') {
        return graphqlHTTP({
            schema: input.schema,
            rootValue: input.rootValue,
            graphiql: true,
            context: { dbManager },
            method: type
        });
    } else {
        return graphqlHTTP({
            schema: input.schema,
            rootValue: input.rootValue,
            graphiql: true,
            context: { dbManager }
        });
    }
}

// add url-route in /controllers:
function addMapping(app: any, mapping: any, dbManager: any) {
    for (var url in mapping) {
        if (url.startsWith('GET ')) {
            var path = url.substring(4);

            app.use(path, createGraphqlHTTP('GET', mapping[url], dbManager));
            console.log(`register URL mapping: GET ${path}`);
        } else if (url.startsWith('POST ')) {
            var path = url.substring(5);

            app.use(path, createGraphqlHTTP('POST', mapping[url], dbManager));
            console.log(`register URL mapping: POST ${path}`);
        } else if (url.startsWith('ALL ')) {
            var path = url.substring(4);

            app.use(path, createGraphqlHTTP('ALL', mapping[url], dbManager));
            console.log(`register URL mapping: ALL ${path}`);
        } else {
            console.log(`invalid URL: ${url}`);
        }
    }
}

function addControllers(router: any, dir: string, dbManager: any) {
    const fs = require('fs');

    fs.readdirSync(__dirname + '/' + dir).filter((f: any) => {
        return f.endsWith('.ts');
    }).forEach((f: any) => {
        console.log(`process controller: ${f}...`);
        let mapping = require(__dirname + '/' + dir + '/' + f);
        addMapping(router, mapping, dbManager);
    });
}

module.exports = function (app: any, dir: string, dbManager: any) {
    let controllers_dir = dir || 'gqlControllers';
    // const router = require('express-router')();

    addControllers(app, controllers_dir, dbManager);

    debug('use gqlController-------');
};